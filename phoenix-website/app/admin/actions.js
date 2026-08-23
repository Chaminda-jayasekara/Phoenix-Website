"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { revalidatePath } from "next/cache";
import { createSessionToken, COOKIE_NAME, MAX_AGE_SECONDS } from "@/lib/adminAuth";

export async function adminLogin(prevState, formData) {
  const password = String(formData.get("password") || "");

  if (!process.env.ADMIN_PASSWORD) {
    return { error: "Server is not configured with an admin password." };
  }
  if (password !== process.env.ADMIN_PASSWORD) {
    return { error: "Incorrect password." };
  }

  const token = await createSessionToken();
  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: MAX_AGE_SECONDS,
    path: "/",
  });

  redirect("/admin");
}

export async function adminLogout() {
  cookies().delete(COOKIE_NAME);
  redirect("/admin/login");
}

export async function upsertCategory(prevState, formData) {
  const id = formData.get("id");

  const ageCategories = String(formData.get("ageCategories") || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const subCategoriesRaw = String(formData.get("subCategories") || "").trim();
  const subCategories = subCategoriesRaw
    ? subCategoriesRaw.split(",").map((s) => s.trim()).filter(Boolean)
    : null;

  const nestedRaw = String(formData.get("nestedSubCategories") || "").trim();
  let nestedSubCategories = null;
  if (nestedRaw) {
    try {
      nestedSubCategories = JSON.parse(nestedRaw);
    } catch {
      return { error: "Nested sub-categories must be valid JSON (or leave it blank)." };
    }
  }

  const payload = {
    slug: String(formData.get("slug") || "")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9-]+/g, "-"),
    label: String(formData.get("label") || "").trim(),
    description: String(formData.get("description") || "").trim(),
    age_categories: ageCategories,
    sub_categories: subCategories,
    nested_sub_categories: nestedSubCategories,
    supports_group_entry: formData.get("supportsGroupEntry") === "on",
    has_submission: formData.get("hasSubmission") === "on",
    submission_label: String(formData.get("submissionLabel") || "Submission link"),
    submission_hint: String(formData.get("submissionHint") || ""),
    rules_video_url: String(formData.get("rulesVideoUrl") || ""),
    rules_pdf_url: String(formData.get("rulesPdfUrl") || ""),
    sort_order: Number(formData.get("sortOrder") || 0),
  };

  if (!payload.slug || !payload.label) {
    return { error: "Slug and label are required." };
  }
  if (ageCategories.length === 0) {
    return { error: "At least one age category is required." };
  }

  let error;
  if (id) {
    ({ error } = await supabaseAdmin.from("categories").update(payload).eq("id", id));
  } else {
    ({ error } = await supabaseAdmin.from("categories").insert(payload));
  }

  if (error) return { error: error.message };

  revalidatePath("/categories");
  revalidatePath("/admin");
  revalidatePath("/admin/categories");
  return { success: true };
}

export async function deleteCategory(id) {
  await supabaseAdmin.from("categories").delete().eq("id", id);
  revalidatePath("/categories");
  revalidatePath("/admin");
  revalidatePath("/admin/categories");
}

export async function updateSiteSettings(prevState, formData) {
  const eventDateRaw = formData.get("eventDate");
  const payload = {
    event_date: eventDateRaw ? new Date(eventDateRaw).toISOString() : null,
    hero_description: String(formData.get("heroDescription") || ""),
    general_rules_video_url: String(formData.get("generalRulesVideoUrl") || ""),
    general_rules_pdf_url: String(formData.get("generalRulesPdfUrl") || ""),
  };

  const { error } = await supabaseAdmin.from("site_settings").update(payload).eq("id", 1);
  if (error) return { error: error.message };

  revalidatePath("/");
  revalidatePath("/admin/settings");
  return { success: true };
}
