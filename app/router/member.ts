import z from "zod";
import { heavyWriteSecurityMiddleware } from "../middlewares/arcjet/heavy-write";
import { standardSecurityMiddleware } from "../middlewares/arcjet/standard";
import { requiredAuthMiddleware } from "../middlewares/auth";
import { base } from "../middlewares/base";
import { requiredWorkspaceMiddleware } from "../middlewares/workspace";
import { inviteMemberSchema } from "../schemas/member";
import { init, organization_user, Organizations, Users } from "@kinde/management-api-js";
import { getAvatar } from "@/lib/get-avatar";
import { readSecurityMiddleware } from "../middlewares/arcjet/read";

export const InviteMember=base
 .use(requiredAuthMiddleware)
 .use(requiredWorkspaceMiddleware)
 .use(standardSecurityMiddleware)
 .use(heavyWriteSecurityMiddleware)
 .route({
    method: 'POST',
    path: "/workspace/members/invite",
    summary: "Invite Member",
    tags: ["Members"]
 })
 .input(inviteMemberSchema)
 .output(z.void())
 .handler(async({input,context,errors})=>{
    try{
        init();
        await Users.createUser({
            requestBody:{
                organization_code:context.workspace.orgCode,
                profile:{
                    given_name: input.name,
                    picture: getAvatar(null,input.email),
                },
                identities: [
                    {
                        type: "email",
                        details: {
                            email: input.email,
                        },
                    },
                ],
            },
        });
    } catch (err: unknown) {
        // If the user already exists in Kinde (status 400), we fetch them by email and add them to this organization
        if (err && typeof err === 'object' && 'status' in err && err.status === 400) {
            try {
                const usersResponse = await Users.getUsers({ email: input.email });
                const existingUser = usersResponse.users?.[0];

                if (existingUser && existingUser.id) {
                    await Organizations.addOrganizationUsers({
                        orgCode: context.workspace.orgCode,
                        requestBody: {
                            users: [{ id: existingUser.id }]
                        }
                    });
                    return; // Successfully added to org
                }
            } catch (fallbackErr) {
                console.error("Error trying to add existing user to organization:", fallbackErr);
            }
        }
        
        console.error("Kinde createUser error:", err);
        throw errors.INTERNAL_SERVER_ERROR();
    }
 });
export const ListMembers=base
 .use(requiredAuthMiddleware)
 .use(requiredWorkspaceMiddleware)
 .use(standardSecurityMiddleware)
 .use(readSecurityMiddleware)
 .route({
    method: 'GET',
    path: "/workspace/members",
    summary: "List all members",
    tags: ["Members"],
 })
 .input(z.void())
 .output(z.array(z.custom<organization_user>()))
 .handler(async({context,errors})=>{
    try{
        init();
        const data=await Organizations.getOrganizationUsers({
            orgCode: context.workspace.orgCode,
            sort: 'name_asc',
        });
        if(!data.organization_users) {
            throw errors.NOT_FOUND();
        }
        return data.organization_users;
    }catch{
        throw errors.INTERNAL_SERVER_ERROR();
    }
 })