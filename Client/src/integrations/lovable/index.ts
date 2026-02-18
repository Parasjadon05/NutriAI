// Lovable integration - NutriAI uses Appwrite for auth. This is a stub for compatibility.

type SignInOptions = {
  redirect_uri?: string;
  extraParams?: Record<string, string>;
};

export const lovable = {
  auth: {
    signInWithOAuth: async (_provider: "google" | "apple", _opts?: SignInOptions) => {
      return { error: new Error("Use Appwrite auth via AuthContext") };
    },
  },
};
