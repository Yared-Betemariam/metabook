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
import { Textarea } from "@/components/ui/textarea";
import { Account } from "@/db/schema";
import { useModalStore } from "@/modules/modals/store";
import { AccountFormValues, accountSchema } from "@/schemas";
import { trpc } from "@/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useUserAccounts } from "../hooks";

export const AccountsModal = () => {
  const { open, closeModal, data, view } = useModalStore();
  const { data: accounts } = useUserAccounts();
  const utils = trpc.useUtils();

  const account = data as Account | null;
  const isFresh = accounts?.data ? accounts.data.length <= 0 : false;

  const createMutation = trpc.accounts.create.useMutation({
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message);

        utils.accounts.user.invalidate();

        form.reset();

        closeModal();
      }
    },
    onError: () => {
      toast.error("Something went wrong! Please try again");
    },
  });

  const updateMutation = trpc.accounts.edit.useMutation({
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message);

        utils.accounts.user.invalidate();

        closeModal();
      }
    },
    onError: () => {
      toast.error("Something went wrong! Please try again");
    },
  });

  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountSchema),
    reValidateMode: "onSubmit",
    defaultValues: {
      name: account?.name || "",
      balance: account?.balance ? account.balance.toString() : "",
      description: account?.description ?? undefined,
    },
  });

  useEffect(() => {
    if (account) {
      form.reset({
        name: account.name ?? "",
        balance: account?.balance ? account.balance.toString() : "",
        description: account.description ?? undefined,
      });
    }
  }, [account]);

  const onSubmit = (values: AccountFormValues) => {
    if (account) {
      updateMutation.mutate({
        ...values,
        id: account.id,
        description: values.description || undefined,
      });
    } else {
      createMutation.mutate({
        ...values,
        description: values.description || undefined,
      });
    }
  };

  return (
    <DialogWrapper
      onOpen={() => closeModal()}
      open={open === "account" || isFresh}
      title={
        account ? "Update account" : isFresh ? "Get started" : "Create account"
      }
      description={
        account
          ? "Update trading account details"
          : isFresh
          ? "Get started by creating your first account"
          : "Create a new trading account"
      }
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="px-6 space-y-4">
            <div className="flex gap-4">
              <FormField
                control={form.control}
                name="name"
                disabled={!!view}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="100k Funded" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="balance"
                disabled={!!view}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Balance</FormLabel>
                    <FormControl itemType="number">
                      <Input placeholder="5000" {...field} type="text" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Description on your trading account..."
                      {...field}
                    />
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
              disabled={!!view}
              label={
                updateMutation.isPending || createMutation.isPending
                  ? account
                    ? "Saving"
                    : "Creating"
                  : account
                  ? "Save"
                  : "Create"
              }
              loading={updateMutation.isPending || createMutation.isPending}
            />
          </DialogFooter>
        </form>
      </Form>
    </DialogWrapper>
  );
};
