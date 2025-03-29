import { proxy } from "valtio";
import { UseFormReturn, FieldValues } from "react-hook-form";

// Define the form store interface
interface FormStore {
  forms: Record<string, UseFormReturn<FieldValues>>; // Ensures valid indexing
  registerForm: (id: string, formInstance: UseFormReturn<FieldValues>) => void;
  validateAllForms: () => Promise<void>;
}

// Create the proxy store
export const formStore: FormStore = proxy({
  forms: {} as Record<string, UseFormReturn<FieldValues>>, // Explicitly type the object

  registerForm(id, formInstance) {
    this.forms[id] = formInstance; // Ensures proper indexing
  },

  async validateAllForms() {
    for (const form of Object.values(this.forms)) {
      await form.trigger(); // Triggers validation for all forms
    }
  },
});
