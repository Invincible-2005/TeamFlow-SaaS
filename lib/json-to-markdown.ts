import {renderToMarkdown} from "@tiptap/static-renderer/pm/markdown"
import { baseExtention } from "@/components/rich-text-editor/extensions";

function normalizeWhiteSpace(markdown:string){
    return markdown
    .replace(/\s+$/gm,"") //trim trailing spaces per line
    .replace(/\n{3,}/g,"\n\n") // collapse >2 blank lines
    .trim();
}
export async function TiptapJSONtoMarkdown(json:string){
    //Parse json
    let content;
    try{
        content=JSON.parse(json);
    }catch{
        return '';
    }
    const markdown=renderToMarkdown({
        extensions: baseExtention,
        content:content,
    });
    return normalizeWhiteSpace(markdown);
}