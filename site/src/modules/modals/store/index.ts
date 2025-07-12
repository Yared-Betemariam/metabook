import { create } from "zustand";

interface ModalStore {
  open: string;
  closeModal: () => void;
  openModal: (opt: {
    open: string;
    data?: unknown;
    view?: boolean;
    onCompleted?: (data?: unknown) => void;
  }) => void;

  // for datas
  data: unknown;
  view?: boolean;
  onCompleted: ((data?: unknown) => void) | null;
}

export const useModalStore = create<ModalStore>((set) => ({
  open: "",
  data: null,
  view: undefined,
  onCompleted: null,
  openModal: ({ open, data, view, onCompleted }) => {
    set({
      open,
      data: data ?? null,
      view,
      onCompleted: onCompleted ?? null,
    });
  },
  closeModal: () =>
    set({
      open: "",
      data: null,
      view: undefined,
      onCompleted: null,
    }),
}));
