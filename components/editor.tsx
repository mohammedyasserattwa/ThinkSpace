"use client"

import {
    BlockNoteEditor,
    PartialBlock
} from "@blocknote/core"

import {
    useCreateBlockNote
} from "@blocknote/react"

import {
    BlockNoteView
} from "@blockNote/mantine"

import "@blocknote/mantine/style.css"
import { useTheme } from "next-themes"
import { useEdgeStore } from "@/lib/edgestore"

interface EditorProps {
    onChange: (value: string) => void;
    initialContent?: string;
    editable?: boolean;
}

const Editor = ({
    onChange,
    initialContent,
    editable = true
}: EditorProps) => {
    const { resolvedTheme } = useTheme()
    const { edgestore } = useEdgeStore()

    const handleUpload = async (file: File) => {
        const response = await edgestore.publicFiles.upload({
            file
        })

        return response.url
    }

    const editor: BlockNoteEditor = useCreateBlockNote({
        initialContent: initialContent ? JSON.parse(initialContent) as PartialBlock[] : undefined,
        uploadFile: handleUpload
    })

    const handleChange = () => {
        onChange(JSON.stringify(editor.topLevelBlocks, null, 2))
    }
    

    return (
        <BlockNoteView 
        editor={editor} 
        editable={editable} 
        onChange={handleChange} 
        formattingToolbar
        linkToolbar
        sideMenu
        emojiPicker
        filePanel
        tableHandles
        slashMenu
        theme={ resolvedTheme === "dark" ? "dark" : "light" }
        />
    )
}

export default Editor;