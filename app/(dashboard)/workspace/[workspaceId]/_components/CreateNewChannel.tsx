"use client"
import { channelNameSchema, transformChannelName } from "@/app/schemas/channel";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

export function CreateNewChannel() {
    const [open, setopen] = useState(false); // we use useState hook to control the dialog state
    const form = useForm({
        resolver: zodResolver(channelNameSchema),
        defaultValues: {
            name: "",
        },
    });
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
                    <form className="space-y-6">
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
                        <Button type="submit">Create new Channel</Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}