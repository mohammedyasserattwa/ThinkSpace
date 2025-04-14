"use client";

import { Doc } from "@/convex/_generated/dataModel";
import { IconPicker } from "./icon-picker";
import { Button } from "./ui/button";
import { ImageIcon, Smile, X } from "lucide-react";
import { ElementRef, useRef, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import TextareaAutosize from "react-textarea-autosize";
// import { removeIcon } from "@/convex/documents";
// import { on } from "events";
import { useCoverImage } from "@/hooks/use-cover-image";
import { AIGenerateModal } from "@/components/modals/ai-generate-modal";


interface ToolbarProps {
    onAIChange: (value: string) => void;
    initialData: Doc<"documents">;
    preview?: boolean;
    content: string;
}

export const Toolbar = ({
    onAIChange,
    initialData,
    preview,
    content
}: ToolbarProps) => {
    const inputRef = useRef<ElementRef<"textarea">>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [value, setValue] = useState(initialData.title);



    const update = useMutation(api.documents.update);
    const removeIcon = useMutation(api.documents.removeIcon);
    const coverImage = useCoverImage()
    const enableInputs = () => {
        if (preview) return

        setIsEditing(true);
        setTimeout(() => {
            setValue(initialData.title);
            inputRef.current?.focus();
        }, 0);
    }

    const disableInputs = () => setIsEditing(false);

    const onInput = (value: string) => {
        setValue(value)
        update({
            id: initialData._id,
            title: value || "Untitled"
        })
    }

    const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter") {
            e.preventDefault()
            disableInputs();
        }
    }

    const onIconSelect = (icon:string) => {
        update({
            id: initialData._id,
            icon
        })
    }

    const onRemoveIcon = () => {
        removeIcon({
            id: initialData._id
        })
    }

    const handleAIGenerate = (text: string) => {
        onAIChange(text);
    };

    return (
      <div className="pl-[54px] group relative">
        <div className="opacity-100  flex items-center gap-x-1 py-4">
          {!!initialData.icon && !preview && (
            <>
              <IconPicker onChange={onIconSelect}>
                <Button
                  className="text-muted-foreground text-xs"
                  variant={"outline"}
                  size={"sm"}
                >
                  {initialData.icon}
                  <div>&nbsp;</div>
                  Edit Icon
                </Button>
              </IconPicker>

              <Button
                onClick={onRemoveIcon}
                className="text-muted-foreground text-xs"
                variant={"outline"}
                size={"sm"}
              >
                <X className="h-4 w-4" />
                Remove Icon
              </Button>
            </>
          )}
          {!initialData.icon && !preview && (
            <IconPicker asChild onChange={onIconSelect}>
              <Button
                className="text-muted-foreground text-xs"
                variant={"outline"}
                size={"sm"}
              >
                <Smile className="h-4 w-4 mr-2" />
                Add Icon
              </Button>
            </IconPicker>
          )}
          {!preview && <AIGenerateModal onGenerate={handleAIGenerate} />}
          {!initialData.coverImage && !preview && (
            <Button
              className="text-muted-foreground text-xs"
              variant={"outline"}
              size={"sm"}
              onClick={coverImage.onOpen}
            >
              <ImageIcon className="h-4 w-4 mr-2" />
              Add Cover Image
            </Button>
          )}
        </div>
        {isEditing && !preview ? (
          <TextareaAutosize
            ref={inputRef}
            onBlur={disableInputs}
            onKeyDown={onKeyDown}
            value={value}
            onChange={(e) => onInput(e.target.value)}
            className="text-5xl bg-transparent font-bold break-words outline-none text-[#3F3F3F] dark:text-[#cfcfcf] resize-none"
          />
        ) : (
          <div className="flex justify-start items-center align-center mb-[10px]">
            <p className="text-6xl hover:opacity-75 transition">
              {initialData?.icon}
            </p>
            <div
              className="pd-[11.5px] text-5xl font-bold break-words text-[#3F3F3F] dark:text-[#cfcfcf]"
              onClick={enableInputs}
            >
              {initialData.title}
            </div>
          </div>
        )}
      </div>
    );

}