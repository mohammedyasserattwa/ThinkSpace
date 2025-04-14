"use client";

import { useState } from "react"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogTrigger
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea";
import { Sparkle, Stars } from "lucide-react";

interface AIGenerateModalProps {
    onGenerate: (generatedText: string) => void;
}

export const AIGenerateModal = ({ onGenerate }: AIGenerateModalProps) => {
    const [open, setOpen] = useState(false)
    const [prompt, setPrompt] = useState("")
    const [loading, setLoading] = useState(false)

    const handleGenerate = async () => {
        setLoading(true)
        try{
            const res = await fetch("/api/ai/generate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ prompt })
            })

            const data = await res.json()
            const generatedText = data.choices?.[0]?.message?.content || ""
            onGenerate(generatedText)
            setOpen(false)
        } catch (e){
            console.error(e)
        }
        setLoading(false)
    }

    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size={"sm"}
            className="text-muted-foreground text-xs"
          >
            <Stars className="mr-2 h-4 w-4" />
            Generate with AI
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          {loading ? (
            <div className="flex items-center justify-center gap-x-2 h-[150px]">
              <Sparkle className="h-4 w-4 motion-safe:animate-spin" />
              <span className="text-muted-foreground">Generating...</span>
            </div>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center">
                  <Sparkle className="mr-2 h-4 w-4" />
                  Generate with AI
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  You can ask AI to generate anything you want! Want some Icons?
                  Just say it. Want quotes? Sure thing! Want bullet points?
                  Easy!
                </p>
                <Textarea
                  className="h-[125px] resize-none"
                  placeholder="a morning routine.."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
              </div>
              <DialogFooter>
                <Button
                  variant="ghost"
                  className="text-red-500"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="outline"
                  disabled={loading || prompt.length === 0}
                  onClick={handleGenerate}
                >
                  Generate
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    );
}
