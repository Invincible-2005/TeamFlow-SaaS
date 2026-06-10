import { updateMessageSchema, UpdateMessageSchemaType } from "@/app/schemas/message";
import { RichTextEditor } from "@/components/rich-text-editor/Editor";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Message } from "@/lib/generated/prisma/client";
import { orpc } from "@/lib/orpc";
import { zodResolver } from "@hookform/resolvers/zod";
import { InfiniteData, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
interface EditMessageProps{
    message: Message;
    onSave: ()=>void;
    onCancel: ()=>void;
}

export function EditMessage({message,onSave,onCancel}:EditMessageProps){
    const queryClient=useQueryClient();
    const form=useForm({
        resolver: zodResolver(updateMessageSchema),
        defaultValues:{
            messageId: message.id,
            content: message.content,
        },
    });
    const updateMutation=useMutation(orpc.message.update.mutationOptions({
        onSuccess: (updated)=>{
            // it is not scalable to query the message from database if we have a lot of pages so we will just fetch that from our cache
            type MessagePage={items: Message[],nextCursor?: string};
            type InfiniteMessages=InfiniteData<MessagePage>;
            queryClient.setQueryData<InfiniteMessages>(
                ["message.list",message.channelId],
                (old)=>{
                    if(!old) return old;
                    const updatedMessage=updated.message
                    const pages=old.pages.map((page)=>({
                        ...page,
                        items: page.items.map((m)=>m.id===updatedMessage.id ? {...m,...updatedMessage}: m),
                    }));
                    return{
                        ...old,
                        pages,
                    }
                }
            );
            toast.success("Message Updated Succesfully");
            onSave();
        },
        onError: (error)=>{
            toast.error(error.message)
        },
    }));
    function onSubmit(data: UpdateMessageSchemaType){
        updateMutation.mutate(data);
    }
    return(
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                control={form.control}
                name='content'
                render={({field})=>(
                    <FormItem>
                        <FormControl>
                            <RichTextEditor field={field} 
                            sendButton={
                                <div className="flex items-center gap-4">
                                    <Button type="button" size="sm" variant="outline" onClick={onCancel} disabled={updateMutation.isPending}>
                                        Cancel
                                    </Button>
                                    <Button type="submit" size="sm" disabled={updateMutation.isPending}>
                                        {updateMutation.isPending ? 'Saving':'Save'}
                                    </Button>
                                </div>
                            } 
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
                />
            </form>
        </Form>
    )
}