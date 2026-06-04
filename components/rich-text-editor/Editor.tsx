'use client'
import {EditorContent, useEditor} from "@tiptap/react"
import { editorExtention } from "./extensions";
import { MenuBar } from "./MenuBar";
import { ReactNode } from "react";
interface iAppProps{
    field: any;
    sendButton: ReactNode;
    footerleft?: ReactNode
}
export function RichTextEditor({field,sendButton,footerleft}:iAppProps){
    const editor= useEditor({
        immediatelyRender: false, // Don't render immediately on the server to avoid SSR issues
        content: (()=>{
            if(!field?.value) return '';
            try{
                return JSON.parse(field.value);
            }catch{
                return "";
            }
        })(),
        onUpdate: (({editor})=>{
            if(field?.onChange){
                field.onChange(JSON.stringify(editor.getJSON()));
            }
        }),
        extensions: editorExtention,
        editorProps:{
            attributes:{
                class: 'max-w-none min-h-[125px] focus:outline-none p-4 prose  dark:prose-invert marker:text-primary'
            }
        }
    });
    return (
        <div className="relative w-full border border-input rounded-lg overflow-hidden dark:bg-input/30 flex flex-col">
            <MenuBar editor={editor} />
            <EditorContent editor={editor} className="max-h-[200px] overflow-y-auto" />
            <div className="flex items-center justify-between gap-2 px-3 py-2 border-t border-input bg-card">
                <div className="min-h-8 flex items-center">{footerleft}</div>
                <div className="shrink-0">{sendButton}</div>
            </div>
        </div>
    )
}