import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface LanguageStoreState {
  selectedLanguageId: string | null;
  hasHydrated: boolean;
  setSelectedLanguageId: (languageId: string) => void;
  clearSelectedLanguageId: () => void;
  setHasHydrated: (hydrated: boolean) => void;
}

export const LANGUAGE_STORE_KEY = "language-selection-storage";

export const useLanguageStore = create<LanguageStoreState>()(
  persist(
    (set) => ({
      selectedLanguageId: null,
      hasHydrated: false,
      setSelectedLanguageId: (languageId: string) =>
        set({ selectedLanguageId: languageId }),
      clearSelectedLanguageId: () => set({ selectedLanguageId: null }),
      setHasHydrated: (hydrated: boolean) => set({ hasHydrated: hydrated }),
    }),
    {
      name: LANGUAGE_STORE_KEY,
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.error("Failed to hydrate language store:", error);
        }
        state?.setHasHydrated(true);
      },
    }
  )
);
