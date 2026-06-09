import InviteMember  from "./member/InviteMember";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { MembersOverview } from "./member/MembersOverview";
interface channelHeaderProps{
    channelName: string | undefined;
}
export function ChannelHeader({channelName}:channelHeaderProps){
    return(
        <div className="flex items-center justify-between h-14 px-4 border-b">
            <h1 className="text-lg font-semibold">#{channelName}</h1>
            <div className="flex items-center space-x-3">
                <MembersOverview />
                <InviteMember />
                <ThemeToggle />
            </div>
        </div>
    )
}