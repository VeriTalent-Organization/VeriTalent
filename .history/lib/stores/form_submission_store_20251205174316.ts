import { CreateUserInterface } from "@/types/create_user";
import { userTypes } from "@/types/user_type";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CreateUserStore {
  user: CreateUserInterface;
  setUser: (data: Partial<CreateUserInterface>) => void;
  resetUser: () => void;
}

export const useCreateUserStore = create<CreateUserStore>()(
  persist(
    (set) => ({
      user: {
        user_type: userTypes.TALENT,
        full_name: "",
        email: "",
        password: "",
        country: "",
        has_agreed_to_terms: false,
        professional_status: "",
        current_designation: "",
        organisation_name: "",
        location: "",
      },

      setUser: (data) =>
        set((state) => ({
          user: {
            ...state.user,
            ...data,
          },
        })),

      resetUser: () =>
        set({
          user: {
            user_type: userTypes.TALENT,
            full_name: "",
            email: "",
            password: "",
            country: "",
            has_agreed_to_terms: false,
            professional_status: "",
            current_designation: "",
            organisation_name: "",
            location: "",
          },
        }),
    }),
    {
      name: "create-user-store", // key in localStorage
    }
  )
);
