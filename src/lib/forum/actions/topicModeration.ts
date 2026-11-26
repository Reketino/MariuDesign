"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

async function verifyAdmin() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("You must be logged in.");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profileError || profile?.role !== "admin") {
    throw new Error("You are not authorized to perform this action.");
  }

  return supabase;
}

export async function toggleTopicPinAction(topicId: string) {
  const supabase = await verifyAdmin();

  const { data: topic, error: fetchError } = await supabase
    .from("forum_topics")
    .select("is_pinned")
    .eq("id", topicId)
    .single();

  if (fetchError || !topic) {
    throw new Error("Could not find topic.");
  }

  const { error: updateError } = await supabase
    .from("forum_topics")
    .update({
      is_pinned: !topic.is_pinned,
    })
    .eq("id", topicId);

  if (updateError) {
    console.error("Failed to update topic pin:", updateError);
    throw new Error("Could not update topic.");
  }

  revalidatePath("/forum");
  revalidatePath(`/forum/topic/${topicId}`);

  return;
}

export async function toggleTopicLockAction(topicId: string) {
    const supabase = await verifyAdmin();

    const { data: topic, error: fetchError } = await supabase
    .from("forum_topics")
    .select("is_locked")
    .eq("id", topicId)
    .single();

    if (fetchError || !topic) {
      throw new Error("Could not find topic.");
    }
    
    const { error: updateError } = await supabase
    .from("forum_topics")
    .update({ is_locked: !topic.is_locked })
    .eq("id", topicId)

    if (updateError) {
      console.error("Failed to update topic lock:", updateError);
      throw new Error("Could not update topic.");
    }

    revalidatePath("/forum");
    revalidatePath(`/forum/topic/${topicId}`);;

    
}
