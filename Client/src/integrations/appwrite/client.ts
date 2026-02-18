import { Client, Account, Databases, Storage, Functions } from "appwrite";

const endpoint = import.meta.env.VITE_APPWRITE_ENDPOINT;
const projectId = import.meta.env.VITE_APPWRITE_PROJECT_ID;

export const appwrite = new Client().setEndpoint(endpoint).setProject(projectId);

export const account = new Account(appwrite);
export const databases = new Databases(appwrite);
export const storage = new Storage(appwrite);
export const functions = new Functions(appwrite);

export const DB_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID || "nutriai";
export const PROFILES_COLLECTION = "profiles";
export const MEAL_LOGS_COLLECTION = "meal_logs";
export const MEAL_IMAGES_BUCKET = "meal-images";
export const ANALYZE_FUNCTION_ID = import.meta.env.VITE_APPWRITE_ANALYZE_FUNCTION_ID || "analyze-food-image";
