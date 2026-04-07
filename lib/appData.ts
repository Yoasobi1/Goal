import { supabase } from "./supabase";

export async function loadUserAppData() {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) throw userError;
  if (!user) throw new Error("No logged in user.");

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (profileError) throw profileError;

  const { data: goals, error: goalsError } = await supabase
    .from("goals")
    .select("*")
    .order("created_at", { ascending: false });

  if (goalsError) throw goalsError;

  return {
    profile,
    goals: goals ?? [],
  };
}