"use client"
import { channelNameSchema, ChannelSchemaNameType, transformChannelName } from "@/app/schemas/channel";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { orpc } from "@/lib/orpc";
import { zodResolver } from "@hookform/resolvers/zod";
import { isDefinedError } from "@orpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export function CreateNewChannel() {
    const [open, setopen] = useState(false); // we use useState hook to control the dialog state
    const queryClient=useQueryClient();
    const form = useForm({
        resolver: zodResolver(channelNameSchema),
        defaultValues: {
            name: "",
        },
    });
    const createChannelMuatation=useMutation(
        orpc.channel.create.mutationOptions({
            onSuccess:(newChannel) => {
                toast.success(`Workspace ${newChannel.name} created susscessfully!`);
                queryClient.invalidateQueries({
                    queryKey: orpc.channel.list.queryKey(),
                });
                form.reset();
                setopen(false);
            },
            onError: (error) => {
                if (isDefinedError(error)) {
                    toast.error(error.message);
                    return;
                }
                toast.error("Falied to create Channel try again!");
                return;
            }
        }),
    );
    function onSubmit(values: ChannelSchemaNameType){
        createChannelMuatation.mutate(values);
    }
    const watchName = form.watch('name');
    const transformedname = watchName ? transformChannelName(watchName) : "";
    return (
        <Dialog open={open} onOpenChange={setopen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="w-full">
                    <Plus className="size-4" />
                    Add Channel
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create Channel</DialogTitle>
                    <DialogDescription>
                        Create new channel to get Started
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form className="space-y-6"  onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="My Channel" {...field} />
                                    </FormControl>
                                    {transformedname && transformedname !== watchName && (
                                        <p className="text-sm text-muted-foreground">Will be created as: <code className="bg-muted px-1 py-0.5 rounded text-xs">{transformedname}</code></p>
                                    )}
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button disabled={createChannelMuatation.isPending} type="submit">
                            {createChannelMuatation.isPending ? 'Creating...' : 'Create new Channel'}
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}