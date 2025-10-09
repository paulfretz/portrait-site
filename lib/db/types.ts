/**
 * Database types for Supabase
 * These will be generated from the database schema once it's created (Task 3.0)
 *
 * For now, this is a placeholder to allow TypeScript compilation
 * TODO: Generate these types from Supabase after migration in Task 3.2
 */

// Placeholder Database type - will be replaced with actual schema types
export type Database = {
  public: {
    Tables: Record<string, never>;
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
};

// Common types that will be used across the application
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];
