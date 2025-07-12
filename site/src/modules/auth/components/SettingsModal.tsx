"use client";

import DialogWrapper from "@/components/custom/dialog-wrapper";
import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import FormButton, {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useModalStore } from "@/modules/modals/store";
import { ProfileFormValues, profileSchema } from "@/schemas";
import { trpc } from "@/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { IoPerson } from "react-icons/io5";
import { toast } from "sonner";
import { useUser } from "../hooks";

export const SettingsModal = () => {
  const { user, updateUser } = useUser();
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
    console.log(values);
    mutate(values);
  };

  return (
    <>
      <DialogWrapper
        onOpen={() => closeModal()}
        open={open === "settings"}
        title={"Settings"}
        description={"Update your profile settings"}
      >
        <div className="flex items-center gap-5 mb-6">
          <div className="size-14 rounded-full border shadow-inner bg-gradient-to-br from-zinc-400 to-zinc-500 overflow-hidden relative grid place-content-center">
            <IoPerson className="size-8 text-white drop-shadow" />
          </div>
          <div className="flex flex-col">
            <p className="text-xl font-medium tracking-tight">{user?.name}</p>
            <span className=" opacity-70 text-sm mr-1">{user?.email}</span>
          </div>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} disabled />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-4">
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
            </div>
          </form>
        </Form>
      </DialogWrapper>
    </>
  );
};
