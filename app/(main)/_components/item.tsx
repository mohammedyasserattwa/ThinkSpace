"use client";

import { Id } from "@/convex/_generated/dataModel";
import { LucideIcon, ChevronDown, ChevronRight, Plus, MoreHorizontal, Trash } from "lucide-react";
import {cn} from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { 
    DropdownMenuSeparator,
    DropdownMenu,
    DropdownMenuTrigger, 
    DropdownMenuContent, 
    DropdownMenuItem 
} from "@/components/ui/dropdown-menu";
import { useUser } from "@clerk/clerk-react";

interface ItemProps {
    id?: Id<"documents">;
    documentIcon?: string;
    active?: boolean;
    expanded?: boolean;
    isSearch?: boolean;
    level?: number;
    onExpand?: () => void;
    label:string;
    onClick?: () => void;
    icon: LucideIcon;
}

export const Item = ({
    id,
    active,
    documentIcon,
    isSearch, 
    level = 0,
    onExpand,
    expanded,
    label, onClick, icon:Icon
} : ItemProps) => {
    const {user} = useUser();
    const create = useMutation(api.documents.create);
    const archive = useMutation(api.documents.archive);
    const router = useRouter(); 
    const handleExpand = (e : React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.stopPropagation();
        onExpand?.()

    }

    const onArchive = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.stopPropagation();
        if(!id) return;
        const promise = archive({id})
        .then(() => router.push("/documents"))

        toast.promise(promise, {
            loading: "Moving to Trash...",
            success: "Note Moved to Trash",
            error: "Failed to archive document"
        })
    }

    const onCreate = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => { 
        e.stopPropagation();
        if (!id) return;
        const promise = create({title: "Untitled", parentDocument: id})
        .then((documentId) => {
            if(!expanded) onExpand?.();
            router.push(`/documents/${documentId}`);
        })

        toast.promise(promise, {
            loading: "Creating document...",
            success: "Document created",
            error: "Failed to create document"
        })
    }
    const ChevronIcon = expanded ? ChevronDown : ChevronRight;



    return (
        <div
        onClick={onClick}
        role="button"
        style={{
            paddingLeft: level ? `${(level*12) + 12}px` :"12px"
        }}
        className={cn("group min-h-[27px] text-sm pr-3 py-1 w-full hover:bg-primary/5 flex items-center text-muted-foreground font-medium",
            active && "bg-primary/5 text-primary",
        )}>
            {!!id && (
                <div 
                    role="button"
                    className="h-full rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 mr-1"
                    onClick={handleExpand}
                    >
                    <ChevronIcon className="shrink-0 h-4 w-4 text-muted-foreground/50"/>
                </div>
            )}
            {documentIcon ? (
                <div className="shrink-0 mr-2 text-[18px]">
                    {documentIcon}
                </div>
            ): <Icon className="shrink-0 h-[18px] w-[18px] mr-2 text-muted-foreground"/>}
            
            <span className="truncate">
                {label}
            </span>
            {isSearch && (
                <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                    <span className="text-sx">⌘</span>K | CTRL K
                </kbd>
            )}
            {
                !!id && (
                    <div className="ml-auto flex item-center gap-x-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger 
                            onClick={(e) => e.stopPropagation()}
                            asChild>
                                <div role="button"
                                className="opacity-0 group-hover:opacity-100 h-full ml-auto hover:bg-neutral-300 dark:hover:bg-neutral-600"
                                >
                                    <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                                </div>

                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                            className="w-60"
                            align="start"
                            side="right"
                            forceMount
                            >
                                <DropdownMenuItem onClick={onArchive}>
                                    <Trash className="h-4 w-4 mr-2" />
                                    Delete
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <div className="text-xs text-muted-foreground p-2">
                                    Last edited by : {user?.fullName}
                                </div>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <div
                        className="opacity-0 group-hover:opacity-100 h-full ml-auto rounded-sm hover:bg-neutral-300 dar:hover:bg-neutral-600"
                        role="button"
                        onClick={onCreate}
                        >
                            <Plus  className="h-4 w-4 text-muted-foreground"/>
                        </div>
                    </div>
                )
            }
        </div>
    );
}

Item.Skeleton = function ItemSkeleton({level}: {level?:number}){
    return (
        <div
        style={{paddingLeft: level ? `${(level*12) + 25}px` : "12px"}}
        className="flex gap-x-2 py-[3px]"
        >
            <Skeleton className="h-4 w-4 " />
            <Skeleton className="h-4 w-[30%] " />
        </div>
    )
}