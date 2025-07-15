import { Button } from "@/components/ui/button";
import { FormButton } from "@/components/ui/form";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import { useMemo } from "react";
import { useConfirmationModalStore } from "../store";
import DialogWrapper from "@/components/custom/dialog-wrapper";

export function ConfirmationModal() {
  const {
    isLoading,
    handleClick,
    variant,
    title,
    description,
    open,
    closeModal,
  } = useConfirmationModalStore();

  return (
    <DialogWrapper
      title={`Are you absolutely sure you want to ${title}?`}
      description={
        !false
          ? `This action cannot be undone. This will permanently ${
              title || description
            }.`
          : undefined
      }
      open={open}
      onOpen={() => closeModal()}
    >
      <DialogFooter className="border-t-0">
        <DialogClose asChild>
          <Button variant="outline">Cancel</Button>
        </DialogClose>
        <FormButton
          small
          onClick={handleClick ?? undefined}
          variant={variant}
          type="button"
          label="Confirm"
          loading={isLoading}
        />
      </DialogFooter>
    </DialogWrapper>
  );
}
