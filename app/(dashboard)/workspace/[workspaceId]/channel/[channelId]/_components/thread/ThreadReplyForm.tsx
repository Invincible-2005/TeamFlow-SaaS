"use client"
import { createMessageSchema, CreateMessageSchemaType } from "@/app/schemas/message";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form"
import { MessageComposer } from "../message/MessageComposer";
import { useAttachmentUpload } from "@/hooks/Use-Attachment-Upload";
import { useEffect, useState } from "react";
import { InfiniteData, useMutation, useQueryClient } from "@tanstack/react-query";
import { orpc } from "@/lib/orpc";
import { toast } from "sonner";
import { KindeUser } from "@kinde-oss/kinde-auth-nextjs";
import { getAvatar } from "@/lib/get-avatar";
import { MessageListItem } from "@/lib/types";
import { useChannelRealTime } from "@/providers/ChannelRealtimeProvider";

interface ThreadReplyProps{
    threadId:string;
    user: KindeUser<Record<string,unknown>>;
}

export function ThreadReplyForm({threadId,user}:ThreadReplyProps){
    const {channelId}=useParams<{channelId:string}>();
    const upload=useAttachmentUpload();
    const queryClient=useQueryClient();
    const {send}=useChannelRealTime();
    const [editorKey,setEditorKey]=useState(0);
    const form=useForm({
        resolver:zodResolver(createMessageSchema),
        defaultValues:{
            content:'',
            channelId: channelId,
            threadId:threadId,
        },
    });
    // we use a useEffect hook as useForm hook is not able to dynamically update our threadId
    useEffect(()=>{
        form.setValue('threadId',threadId);
    },[threadId,form]);
    const createMutation=useMutation(orpc.message.create.mutationOptions({
        onMutate: async(data)=>{
            const listOptions=orpc.message.thread.list.queryOptions({
                input:{
                    messageId:threadId,
                },
            });
            type MessagePage={
                items: Array<MessageListItem>,
                nextCursor?: string,
            };
            type InfiniteMessages= InfiniteData<MessagePage>;
            await queryClient.cancelQueries({queryKey: listOptions.queryKey});
            const previous=queryClient.getQueryData(listOptions.queryKey);
            const optimistic: MessageListItem={
                id: `optimistic-${crypto.randomUUID()}`,
                content: data.content,
                createdAt: new Date(),
                updatedAt: new Date(),
                authorId: user.id,
                authorEmail: user.email!,
                authorName: user.given_name ?? 'John Doe',
                authorAvatar: getAvatar(user.picture,user.email!),
                channelId:data.channelId,
                threadId:data.threadId!,
                imageUrl:data.imageUrl ?? null,
                reactions: [],
                replyCount: 0,
            };
            queryClient.setQueryData(
                listOptions.queryKey,
                (old)=>{
                    if(!old){
                        return old;
                    }
                    return{
                        ...old, 
                        messages: [...old.messages,optimistic],
                    };
                },
            );
            // Optimistically bump replyCount in main message list for the parent message
            queryClient.setQueryData<InfiniteMessages>(
                ["message.list",channelId],
                (old)=>{
                    if(!old) return old;
                    const pages=old.pages.map((page)=>({
                        ...page,
                        items: page.items.map((m)=>
                            m.id===threadId ? {...m,replyCount: m.replyCount+1} : m
                        ),
                    }));
                    return {...old,pages};
                }
            )
            return {
                listOptions,
                previous,
            };
        },
        onSuccess:(_data,_vars,ctx)=>{
            queryClient.invalidateQueries({queryKey:ctx.listOptions.queryKey});
            form.reset({channelId,content:'',threadId});
            upload.clear();
            setEditorKey((k)=>k+1);
            send({
                type: "message:replies:increment",
                payload: {messageId:threadId,delta:1},
            })
            return toast.success("Message Created Succesfully");
        },
        onError:(_err,_vars,ctx)=>{
            if(!ctx) return;
            const {listOptions,previous}=ctx;
            if(previous){
                queryClient.setQueryData(
                    listOptions.queryKey,
                    previous,
                )
            }
            return toast.error("Something went wrong");
        }
    }));
    function onSubmit(data:CreateMessageSchemaType){
        createMutation.mutate({
            ...data,
            imageUrl: upload.stagedUrl ?? undefined,
        })
    };
    return(
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField 
                control={form.control}
                name="content"
                render={({field})=>(
                    <FormItem>
                        <FormControl>
                            <MessageComposer 
                            value={field.value} 
                            onChange={field.onChange}
                            upload={upload} 
                            key={editorKey} // needed to reset the form without creating a useEffect in our rich text ediotr
                            onSubmit={()=>onSubmit(form.getValues())}
                            isSubmitting={createMutation.isPending}
                            />
                        </FormControl>
                    </FormItem>
                )}
                />
            </form>
        </Form>
    )
}