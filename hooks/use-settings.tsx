import { create } from "zustand";

type SearchStore = {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
}

export const useSettings = create<SearchStore>((set) => ({
    isOpen: false,
    onOpen: () => set({isOpen: true}),
    onClose: () => set({isOpen: false}),
}) )
