import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import Image from "next/image"

const members=[
    {id: '1',
        name:'John',
        imageURL:'https://avatar.vercel.sh/ruaug',
        email:"piyushkum2005@gmail.com"
    }
]
export function WorkspaceMemberList(){
    return (
        <div className="space-y-0.5 py-1">
            {members.map((member)=>(
                <div key={member.id} className="px-3 py-2 hover:bg-accent cursor-pointer transition-colors flex item-center space-x-3">
                    <div className="relative">
                        <Avatar className="size-8 relative">
                            <Image fill src={member.imageURL} alt="userImage" className="object-cover" />
                            <AvatarFallback>
                                {member.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm truncate">{member.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{member.email}</p>
                    </div>
                </div>
            ))}
        </div>
    )
}