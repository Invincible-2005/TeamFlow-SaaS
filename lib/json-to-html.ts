import { baseExtention } from "@/components/rich-text-editor/extensions";
import { generateHTML, JSONContent } from "@tiptap/react";

export function convertJsontoHtml(jsonContent: JSONContent): string{
    try{
        const content=typeof jsonContent=== 'string' ? JSON.parse(jsonContent):jsonContent;
        return generateHTML(content,baseExtention);
    }
    catch{
        console.log("Error converting json to html");
        return '';
    }
}