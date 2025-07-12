import { useSession } from "next-auth/react";
import { ProfileFormValues } from "../components/SettingsModal";

export const useUser = () => {
  const { data, update, status } = useSession();

  const updateUser = (values: ProfileFormValues) => {
    if (values.name) {
      update({
        ...data,
        user: {
          ...data?.user,
          ...(values.name && { name: values.name }),
        },
      });
    }
  };

  return {
    user: data?.user || null,
    isLoading: status == "loading",
    updateUser,
  };
};
