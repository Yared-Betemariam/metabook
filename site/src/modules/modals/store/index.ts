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

interface ConfirmationModalStore {
  openModal: (data: {
    title: string;
    onClick: () => void;
    description?: string;
    onCompleted?: () => void;
    variant?: "default" | "destructive";
  }) => void;

  open: boolean;
  variant?: "default" | "destructive";

  isLoading: boolean;

  title: string | null;
  description: string | null;

  handleClick: (() => void) | null;

  closeModal: () => void;
}

export const useConfirmationModalStore = create<ConfirmationModalStore>(
  (set) => ({
    isLoading: false,
    open: false,
    title: null,
    description: null,
    handleClick: null,

    openModal: ({ title, description, onClick, variant }) => {
      const handleClick = () => {
        set({ isLoading: true });

        onClick();
      };

      set({
        open: true,
        title: title ?? null,
        description: description ?? null,
        handleClick: handleClick,
        variant: variant,
      });
    },

    closeModal: () =>
      set({
        open: false,
        title: null,
        isLoading: false,
        description: null,
        handleClick: null,
      }),
  })
);
