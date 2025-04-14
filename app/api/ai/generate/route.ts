import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try{
        const { prompt } = await request.json();

        const finalPrompt = ` Generate a BlockNote-JS compatible array of blocks about ${prompt}. 
        Follow these rules STRICTLY: 
        1. Output MUST be a valid JSON array of block objects. 
        2. Each block MUST include:   
            - "id" (unique string, e.g., "block-1")
            - "type" (e.g., "paragraph", "heading", "bulletListItem")
            - "content" (string or inline content array)
             - "props" (object, e.g., '{ "textAlignment": "left" }' or '{ "level": 2 }' for headings)
        3. NEVER include '{ "blocks": [...] }' or any outer wrapper. ONLY the array.
        4. NEVER include Markdown, backticks, or explanations. ONLY raw JSON.
        5. Do not start with a title or heading. Make the first block a paragraph related to the topic.
        Example valid output:
        [
            {"id":"1","type":"paragraph","content":"Text","props":{}},
            {"id":"2","type":"heading","content":"Title","props":{"level":2}}
        ]`;

        const response = await fetch(process.env.DEEPSEEK_ENDPOINT as string, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.DEEPSEEK_API_KEY}`
            },
            body: JSON.stringify({
                model: "deepseek/deepseek-chat:free",
                messages: [
                    {
                        role: "user",
                        content: finalPrompt
                    }
                ]
            })
        })

        const data = await response.json()

        return NextResponse.json(data);
    } catch (e) {
        // Log full error details
        console.error("Error in /api/ai/generate:", e);
        return NextResponse.json({ error: e || "Unknown error" }, { status: 500 });
    }
    }