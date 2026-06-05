import { convertJsontoHtml } from "@/lib/json-to-html";
import {type JSONContent } from "@tiptap/react";
import DOMpurify from 'dompurify';
import parse from 'html-react-parser'

interface iAppProps{
    content: JSONContent,
    className?: string,
}
export function SafeContent({content}:iAppProps){
    const html=convertJsontoHtml(content);
    const clean=DOMpurify.sanitize(html);
    return (
        <div className="text-sm break-work max-w-none prose dark:prose-invert mark:text-primary">{parse(clean)}</div>
    )
}