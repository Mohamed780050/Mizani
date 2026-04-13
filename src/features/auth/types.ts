export type AuthActionState = {
  success?: string;
  error?: string;
  fieldErrors?: Record<string, string[]>;
  resetKey?: string; // Used to re-render form if needed
};
