import MarkdownIt from "markdown-it";
import DOMPurify from "dompurify";
import { editorExtention } from "@/components/rich-text-editor/extensions";
import { generateJSON } from "@tiptap/react";
const md=new MarkdownIt({html:false,linkify:true,breaks:false});
export function markdowntoJSON(markdown:string){
    const html=md.render(markdown);
    const cleanHTML=DOMPurify.sanitize(html, {USE_PROFILES:{html:true}});
    return generateJSON(cleanHTML,editorExtention);
}
