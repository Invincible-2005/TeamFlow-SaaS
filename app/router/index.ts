import { createChannel, getChannel, listChannels } from "./channel";
import { InviteMember, ListMembers } from "./member";
import { createMessage, listMessages, listthreadReplies, updateMessage } from "./message";
import { createWorkspaces, listWorkspaces } from "./workspace";

export const router ={
    workspace:{
        list: listWorkspaces,
        create:createWorkspaces,
        member:{
            list: ListMembers,
            invite: InviteMember
        },
    },
    channel:{
        create: createChannel,
        list:listChannels,
        get: getChannel,
    },
    message:{
        update: updateMessage,
        create: createMessage,
        list: listMessages,
        thread:{
            list: listthreadReplies,
        }
    }
}