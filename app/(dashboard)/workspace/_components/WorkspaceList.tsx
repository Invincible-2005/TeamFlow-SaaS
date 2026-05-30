"use client"
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { orpc } from "@/lib/orpc";
import { cn } from "@/lib/utils";
import { LoginLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { useSuspenseQuery } from "@tanstack/react-query";

const colorcombination=[
    'bg-blue-500 hover:bg-blue-600 text-white',
    'bg-emerald-500 hover:bg-emerald-600 text-white',
    'bg-purple-500 hover:bg-purple-600 text-white',
    'bg-amber-500 hover:bg-amber-600 text-white',
    'bg-rose-500 hover:bg-rose-600 text-white',
    'bg-indigo-500 hover:bg-indigo-600 text-white',
    'bg-cyan-500 hover:bg-cyan-600 text-white',
    'bg-pink-500 hover:bg-pink-600 text-white',
]
const getWorkspacecolor=(id:string)=>{
    const charSum=id.split("").reduce((sum,char)=>sum+char.charCodeAt(0),0);
    const colorind=charSum%colorcombination.length;
    return colorcombination[colorind];
}
export default function WorkspaceList(){
    const {
        data:{ workspaces,currentworkspace }
    }=useSuspenseQuery(orpc.workspace.list.queryOptions()); //what does it mean to hydrate it on the client side
    return(
        <TooltipProvider>
            <div className="flex flex-col gap-2">
                {workspaces.map((ws)=>{
                    const isActive=currentworkspace.orgCode===ws.id;
                    return(
                        <Tooltip key={ws.id}>
                        <TooltipTrigger asChild>
                            <LoginLink orgCode={ws.id}>
                            <Button size="icon" 
                            // className="size-12 transition-all duration-200"
                            className={cn('size-10 transition-all duration-200',
                                getWorkspacecolor(ws.id),
                            isActive ? 'rounded-lg':'rounded-xl hover:rounded-lg')}
                            >
                                <span className="text-sm font-semibold">{ws.avatar}</span>
                            </Button>
                            </LoginLink>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                            <p>{ws.name} {isActive && "(Current)"}</p>
                        </TooltipContent>
                    </Tooltip>
                    )
                })
                }
            </div>
        </TooltipProvider>
    )
}