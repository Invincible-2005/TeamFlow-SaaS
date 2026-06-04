import z from "zod";
import { standardSecurityMiddleware } from "../middlewares/arcjet/standard";
import { writeSecurityMiddleware } from "../middlewares/arcjet/write";
import { requiredAuthMiddleware } from "../middlewares/auth";
import { base } from "../middlewares/base";
import { requiredWorkspaceMiddleware } from "../middlewares/workspace";
import prisma from "@/lib/db";
import { createMessageSchema } from "../schemas/message";
import { getAvatar } from "@/lib/get-avatar";
import { Message } from "@/lib/generated/prisma/client";

export const createMessage = base
    .use(requiredAuthMiddleware)
    .use(requiredWorkspaceMiddleware)
    .use(standardSecurityMiddleware)
    .use(writeSecurityMiddleware)
    .route({
        method: 'POST',
        path: '/messages',
        summary: 'Create a message',
        tags: ['Messages'],
    })
    .input(createMessageSchema)
    .output(z.custom<Message>())
    .handler(async({input,context,errors})=>{
        // verify the channel belongs to the user organization
        const channel=await prisma.channel.findFirst({
            where:{
                id:input.channelId,
                workspaceId:context.workspace.orgCode,
            },
        });
        if(!channel){
            throw errors.FORBIDDEN();
        }
        const created=await prisma.message.create({
            data: {
                content: input.content,
                imageUrl: input.imageUrl,
                channelId: input.channelId,
                authorId: context.user.id,
                authorEmail: context.user.email!,
                authorName: context.user.given_name ?? 'Jhon Doe',
                authorAvatar: getAvatar(context.user.picture,context.user.email!),
            },
        });
        return{
            ...created,
        }
    })