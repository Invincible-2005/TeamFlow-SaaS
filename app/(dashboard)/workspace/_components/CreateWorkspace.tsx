"use client"
import { WorksapceSchemaType, workspaceSchema } from "@/app/schemas/workspace";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { orpc } from "@/lib/orpc";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function CreateWorkspace(){
    const [open,setopen]=useState(false);
    const queryClient=useQueryClient();
    const form = useForm({
        resolver: zodResolver(workspaceSchema as any),
   
        defaultValues:{
            name: ""
        }
    });
    const createWorksapceMutation=useMutation(
        orpc.workspace.create.mutationOptions({
            onSuccess:(newWorspace)=>{
                toast.success(`Workspace ${newWorspace.workspaceName} created susscessfully`);
                queryClient.invalidateQueries({
                    queryKey: orpc.workspace.list.queryKey(),
                });
                form.reset();
                setopen(false);
            },
            onError: ()=>{
                toast.error("Falied to create Workspace try again!");
            }
        })
    )
      function onSubmit(values:WorksapceSchemaType) {
        createWorksapceMutation.mutate(values)
      };
    return(
        //This open lets us control the state rather than shadcnui
        <Dialog open={open} onOpenChange={setopen}> 
        <TooltipProvider>
        <Tooltip>
            {/* TooltipTrigger controls the state for Tooltip */}
        <TooltipTrigger asChild>
            {/* DialogTrigger controls the state for Dialog */}
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="size-10 rounded-xl border-2 border-dashed border-muted-foreground/50 text-muted-foreground hover:border-muted-foreground hover:text-foreground hover:rounded-lg transition-all duration-100">
                    <Plus className="size-5" />
                </Button>
            </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent side="right">
            <p>Create Workspace</p>
        </TooltipContent>
        </Tooltip>
        </TooltipProvider>
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>Create Workspace</DialogTitle>
                <DialogDescription>Create a new workspace get started</DialogDescription>
                <Form {...form}>
                    <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField control={form.control} name="name" render={({field})=>(
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    {/* we spread the field so it can confirm the properties from the zod schema */}
                                    <Input placeholder="My Workspace" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <Button disabled={createWorksapceMutation.isPending} type="submit">
                            {createWorksapceMutation.isPending ? 'Creating...' : 'Create Workspace'}
                        </Button>
                    </form>
                </Form>
            </DialogHeader>
        </DialogContent>
        </Dialog>
    )
}