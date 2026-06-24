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

type KindeApiError = {
    status?: number;
};

function getKindeErrorStatus(error: unknown) {
    return typeof error === "object" && error !== null && "status" in error
        ? (error as KindeApiError).status
        : undefined;
}

async function getKindeUserByEmail(email: string) {
    const usersResponse = await Users.getUsers({
        email,
        expand: "organizations",
        pageSize: 1,
    });

    return usersResponse.users?.find((user) => user.email?.toLowerCase() === email) ?? usersResponse.users?.[0];
}

async function addExistingUserToWorkspace(userId: string, orgCode: string) {
    await Organizations.addOrganizationUsers({
        orgCode,
        requestBody: {
            users: [{ id: userId }],
        },
    });
}

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
    const email=input.email.trim().toLowerCase();
    try{
        init();
        await Users.createUser({
            requestBody:{
                organization_code:context.workspace.orgCode,
                profile:{
                    given_name: input.name,
                    picture: getAvatar(null,email),
                },
                identities: [
                    {
                        type: "email",
                        details: {
                            email,
                        },
                    },
                ],
            },
        });
    } catch (err: unknown) {
        // Existing Kinde users must be looked up by id before they can be added to an organization.
        if (getKindeErrorStatus(err) === 400) {
            try {
                const existingUser = await getKindeUserByEmail(email);

                if (existingUser && existingUser.id) {
                    if(existingUser.organizations?.includes(context.workspace.orgCode)){
                        return;
                    }

                    await addExistingUserToWorkspace(existingUser.id,context.workspace.orgCode);
                    return;
                }
            } catch (fallbackErr) {
                if(getKindeErrorStatus(fallbackErr) === 403){
                    throw errors.FORBIDDEN({
                        message: "Kinde Management API needs the read:users scope to invite existing users.",
                    });
                }

                console.error("Error trying to add existing user to organization:", fallbackErr);
            }
        }
        
        if(getKindeErrorStatus(err) === 403){
            throw errors.FORBIDDEN({
                message: "Kinde Management API credentials are missing a required user or organization scope.",
            });
        }

        console.error("Kinde invite member error:", err);
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
