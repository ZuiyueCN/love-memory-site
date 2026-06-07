import "server-only";
import { createClient } from "@supabase/supabase-js";
import { optionalEnv, requireEnv } from "@/lib/env";

export const photoBucket = optionalEnv("SUPABASE_STORAGE_BUCKET", "love-photos");

export function getSupabaseAdmin() {
  return createClient(requireEnv("NEXT_PUBLIC_SUPABASE_URL"), requireEnv("SUPABASE_SERVICE_ROLE_KEY"), {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

export async function uploadPhotoFile(file: File) {
  if (!file.type.startsWith("image/")) {
    throw new Error("只能上传图片文件。");
  }

  const maxSize = 4 * 1024 * 1024;
  if (file.size > maxSize) {
    throw new Error("图片不能超过 4MB。");
  }

  const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const storagePath = `photos/${Date.now()}-${crypto.randomUUID()}.${extension}`;
  const supabase = getSupabaseAdmin();

  const { error } = await supabase.storage.from(photoBucket).upload(storagePath, file, {
    cacheControl: "31536000",
    contentType: file.type,
    upsert: false
  });

  if (error) {
    throw new Error(`图片上传失败：${error.message}`);
  }

  const {
    data: { publicUrl }
  } = supabase.storage.from(photoBucket).getPublicUrl(storagePath);

  return {
    publicUrl,
    storagePath
  };
}

export async function removePhotoFile(storagePath: string | null) {
  if (!storagePath) {
    return;
  }

  const supabase = getSupabaseAdmin();
  const { error } = await supabase.storage.from(photoBucket).remove([storagePath]);

  if (error) {
    throw new Error(`图片文件删除失败：${error.message}`);
  }
}
