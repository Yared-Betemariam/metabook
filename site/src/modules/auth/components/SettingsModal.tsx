"use client";

import DialogWrapper from "@/components/custom/dialog-wrapper";
import { Button } from "@/components/ui/button";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import FormButton, {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useActiveAccount, useUserAccounts } from "@/modules/accounts/hooks";
import {
  useConfirmationModalStore,
  useModalStore,
} from "@/modules/modals/store";
import { ProfileFormValues, profileSchema } from "@/schemas";
import { trpc } from "@/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit2, Plus, Trash } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { IoPerson } from "react-icons/io5";
import { toast } from "sonner";
import { useUser } from "../hooks";
import { ScrollAreaWrapper } from "@/components/custom/scrollarea-wrapper";

export const SettingsModal = () => {
  const { user, updateUser } = useUser();
  const { data: accounts, isLoading } = useUserAccounts();
  const account = useActiveAccount();
  const trpcUtils = trpc.useUtils();

  const { open, closeModal } = useModalStore();
  const { mutate, isPending } = trpc.updateProfile.useMutation({
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message);

        updateUser(form.getValues());
      }
    },
    onError: () => {
      toast.error("Something went wrong! Please try again");
    },
  });

  const deleteMutation = trpc.accounts.delete.useMutation({
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message);

        trpcUtils.accounts.user.invalidate();

        useConfirmationModalStore.getState().closeModal();
      }
    },
    onError: () => {
      toast.error("Something went wrong! Please try again");
    },
  });

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    reValidateMode: "onSubmit",
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name ?? undefined,
        email: user.email ?? undefined,
      });
    }
  }, [user]);

  const onSubmit = (values: ProfileFormValues) => {
    mutate(values);
  };

  return (
    <DialogWrapper
      onOpen={() => closeModal()}
      open={open === "settings"}
      title={"Settings"}
      description={"Update your profile settings"}
    >
      <div className="flex items-center gap-5 mb-6 px-6">
        <div className="size-12 rounded-full border shadow-inner bg-gradient-to-br from-zinc-400 to-zinc-500 overflow-hidden relative grid place-content-center">
          <IoPerson className="size-7 text-white drop-shadow" />
        </div>
        <div className="flex flex-col">
          <p className="text-xl font-medium tracking-tight">{user?.name}</p>
          <span className="opacity-70 text-sm mr-1">{user?.email}</span>
        </div>
      </div>
      <div className="border-y bg-zinc-100 mb-6 px-6 py-3 flex flex-col">
        <div className="flex items-center mb-2 justify-between">
          <span className="text-sm opacity-70">
            Accounts ({accounts?.data.length || 0})
          </span>
          <Button
            onClick={() =>
              useModalStore.getState().openModal({ open: "account" })
            }
            variant={"outline"}
            size={"icon"}
            className="rounded-full border-dashed size-6"
          >
            <Plus className="size-4" />
          </Button>
        </div>
        {accounts?.data && (
          <ScrollAreaWrapper className="flex flex-col max-h-20 pr-2">
            {accounts.data.map((item) => (
              <div
                key={item.id}
                className="flex group/item pb-1 gap-3 items-center text-sm"
              >
                <span
                  className={cn(
                    "size-2 bg-primary rounded-full ring-[1px] ring-offset-2 ring-ring/20",
                    account?.id == item.id ? "opacity-100" : "opacity-0"
                  )}
                />
                <span className="text-   font-medium">{item.name}</span>
                <span>(Blnc. ${item.balance})</span>
                {item.description && (
                  <span className="text-muted-foreground truncate">
                    {item.description}
                  </span>
                )}
                <div className="hidden group-hover/item:flex items-center gap-3 ml-auto">
                  <span
                    onClick={() =>
                      useModalStore.getState().openModal({
                        open: "account",
                        data: item,
                        onCompleted: () => {
                          trpcUtils.accounts.user.invalidate();
                        },
                      })
                    }
                    className="aspect-square hover:bg-white transition-all duration-300 hover:scale-110 p-0.5 rounded-full grid place-content-center"
                  >
                    <Edit2 className="size-3.5" />
                  </span>
                  <span
                    onClick={() =>
                      useConfirmationModalStore.getState().openModal({
                        title: "delete this account",
                        description: "delete the current account",
                        variant: "destructive",
                        onClick: async () => {
                          deleteMutation.mutate({ id: item.id });
                          return {
                            ok: true,
                          };
                        },
                      })
                    }
                    className="aspect-square hover:bg-white transition-all duration-300 hover:scale-110 p-0.5 rounded-full grid place-content-center"
                  >
                    <Trash className="text-destructive size-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </ScrollAreaWrapper>
        )}
        {isLoading && <span className="text-sm opacity-50">Loading...</span>}
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="px-6 space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              disabled
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant={"outline"}>
                Close
              </Button>
            </DialogClose>
            <FormButton
              small
              type="submit"
              label={isPending ? "Saving" : "Save"}
              loading={isPending}
            />
          </DialogFooter>
        </form>
      </Form>
    </DialogWrapper>
  );
};
