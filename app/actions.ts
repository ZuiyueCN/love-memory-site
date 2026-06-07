"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getCurrentAdminEmail, loginAdmin, logoutAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { removePhotoFile, uploadPhotoFile } from "@/lib/supabase";

export type ActionState = {
  ok: boolean;
  message: string;
};

const emptyState: ActionState = {
  ok: false,
  message: ""
};

function getString(formData: FormData, key: string) {
  return String(formData.get(key) || "").trim();
}

function parseDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new Error("日期格式不正确。");
  }
  return date;
}

async function requireAdminAction() {
  const email = await getCurrentAdminEmail();

  if (!email) {
    throw new Error("登录已过期，请重新登录后再操作。");
  }

  return email;
}

const photoSchema = z.object({
  title: z.string().min(1, "照片标题不能为空。"),
  description: z.string().optional(),
  takenAt: z.string().min(1, "请选择拍摄日期。"),
  location: z.string().optional(),
  category: z.string().min(1, "分类不能为空。"),
  isFeatured: z.boolean()
});

const timelineSchema = z.object({
  title: z.string().min(1, "节点标题不能为空。"),
  body: z.string().min(1, "节点正文不能为空。"),
  happenedAt: z.string().min(1, "请选择发生日期。"),
  order: z.coerce.number().int().default(0),
  photoId: z.string().optional()
});

const commentSchema = z.object({
  author: z.string().min(1, "昵称不能为空。").max(24, "昵称不能超过 24 个字。"),
  body: z.string().min(1, "评论内容不能为空。").max(300, "评论不能超过 300 个字。"),
  photoId: z.string().min(1, "缺少照片信息。")
});

const guestbookSchema = z.object({
  author: z.string().min(1, "昵称不能为空。").max(24, "昵称不能超过 24 个字。"),
  body: z.string().min(1, "留言内容不能为空。").max(500, "留言不能超过 500 个字。")
});

const momentSchema = z.object({
  title: z.string().min(1, "动态标题不能为空。"),
  body: z.string().min(1, "动态正文不能为空。"),
  postedAt: z.string().min(1, "请选择动态日期。"),
  location: z.string().optional()
});

type UploadedMomentPhoto = {
  imageUrl: string;
  storagePath: string;
  order: number;
};

export async function loginAction(_previousState: ActionState = emptyState, formData: FormData): Promise<ActionState> {
  void _previousState;
  try {
    const email = getString(formData, "email");
    const password = getString(formData, "password");
    const ok = await loginAdmin(email, password);

    if (!ok) {
      return {
        ok: false,
        message: "邮箱或密码不正确。"
      };
    }
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "登录失败。"
    };
  }

  redirect("/admin");
}

export async function logoutAction() {
  await logoutAdmin();
  redirect("/");
}

export async function createPhotoAction(_previousState: ActionState = emptyState, formData: FormData): Promise<ActionState> {
  void _previousState;
  try {
    await requireAdminAction();
    const parsed = photoSchema.parse({
      title: getString(formData, "title"),
      description: getString(formData, "description") || undefined,
      takenAt: getString(formData, "takenAt"),
      location: getString(formData, "location") || undefined,
      category: getString(formData, "category") || "日常",
      isFeatured: formData.get("isFeatured") === "on"
    });
    const file = formData.get("photo");

    if (!(file instanceof File) || file.size === 0) {
      return {
        ok: false,
        message: "请选择要上传的照片。"
      };
    }

    const uploaded = await uploadPhotoFile(file);

    await prisma.photo.create({
      data: {
        title: parsed.title,
        description: parsed.description,
        imageUrl: uploaded.publicUrl,
        storagePath: uploaded.storagePath,
        takenAt: parseDate(parsed.takenAt),
        location: parsed.location,
        category: parsed.category,
        isFeatured: parsed.isFeatured
      }
    });

    revalidatePath("/");
    revalidatePath("/album");
    revalidatePath("/admin");

    return {
      ok: true,
      message: "照片已添加。"
    };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "添加照片失败。"
    };
  }
}

export async function updatePhotoAction(id: string, formData: FormData) {
  try {
    await requireAdminAction();
    const parsed = photoSchema.parse({
      title: getString(formData, "title"),
      description: getString(formData, "description") || undefined,
      takenAt: getString(formData, "takenAt"),
      location: getString(formData, "location") || undefined,
      category: getString(formData, "category") || "日常",
      isFeatured: formData.get("isFeatured") === "on"
    });

    await prisma.photo.update({
      where: { id },
      data: {
        title: parsed.title,
        description: parsed.description,
        takenAt: parseDate(parsed.takenAt),
        location: parsed.location,
        category: parsed.category,
        isFeatured: parsed.isFeatured
      }
    });

    revalidatePath("/");
    revalidatePath("/album");
    revalidatePath("/admin");
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "更新照片失败。");
  }
}

export async function deletePhotoAction(id: string) {
  try {
    await requireAdminAction();
    const photo = await prisma.photo.findUnique({ where: { id } });
    if (!photo) {
      return;
    }

    await prisma.photo.delete({ where: { id } });
    await removePhotoFile(photo.storagePath);

    revalidatePath("/");
    revalidatePath("/album");
    revalidatePath("/timeline");
    revalidatePath("/admin");
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "删除照片失败。");
  }
}

export async function deletePhotosAction(formData: FormData) {
  try {
    await requireAdminAction();
    const ids = formData
      .getAll("photoIds")
      .map((value) => String(value))
      .filter(Boolean);

    if (ids.length === 0) {
      return;
    }

    const photos = await prisma.photo.findMany({
      where: {
        id: {
          in: ids
        }
      },
      select: {
        id: true,
        storagePath: true
      }
    });

    if (photos.length === 0) {
      return;
    }

    await prisma.photo.deleteMany({
      where: {
        id: {
          in: photos.map((photo) => photo.id)
        }
      }
    });

    await Promise.all(photos.map((photo) => removePhotoFile(photo.storagePath)));

    revalidatePath("/");
    revalidatePath("/album");
    revalidatePath("/timeline");
    revalidatePath("/admin");
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "批量删除照片失败。");
  }
}

export async function createTimelineAction(_previousState: ActionState = emptyState, formData: FormData): Promise<ActionState> {
  void _previousState;
  try {
    await requireAdminAction();
    const parsed = timelineSchema.parse({
      title: getString(formData, "title"),
      body: getString(formData, "body"),
      happenedAt: getString(formData, "happenedAt"),
      order: getString(formData, "order") || 0,
      photoId: getString(formData, "photoId") || undefined
    });

    await prisma.timelineEvent.create({
      data: {
        title: parsed.title,
        body: parsed.body,
        happenedAt: parseDate(parsed.happenedAt),
        order: parsed.order,
        photoId: parsed.photoId
      }
    });

    revalidatePath("/");
    revalidatePath("/timeline");
    revalidatePath("/admin");

    return {
      ok: true,
      message: "时间线节点已添加。"
    };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "添加时间线失败。"
    };
  }
}

export async function deleteTimelineAction(id: string) {
  await requireAdminAction();
  await prisma.timelineEvent.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/timeline");
  revalidatePath("/admin");
}

export async function updateTimelineAction(id: string, formData: FormData) {
  try {
    await requireAdminAction();
    const parsed = timelineSchema.parse({
      title: getString(formData, "title"),
      body: getString(formData, "body"),
      happenedAt: getString(formData, "happenedAt"),
      order: getString(formData, "order") || 0,
      photoId: getString(formData, "photoId") || undefined
    });

    await prisma.timelineEvent.update({
      where: { id },
      data: {
        title: parsed.title,
        body: parsed.body,
        happenedAt: parseDate(parsed.happenedAt),
        order: parsed.order,
        photoId: parsed.photoId
      }
    });

    revalidatePath("/");
    revalidatePath("/timeline");
    revalidatePath("/admin");
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "更新时间线失败。");
  }
}

export async function createPhotoCommentAction(
  _previousState: ActionState = emptyState,
  formData: FormData
): Promise<ActionState> {
  void _previousState;
  try {
    const parsed = commentSchema.parse({
      author: getString(formData, "author"),
      body: getString(formData, "body"),
      photoId: getString(formData, "photoId")
    });

    await prisma.photoComment.create({
      data: parsed
    });

    revalidatePath("/album");

    return {
      ok: true,
      message: "评论已发布。"
    };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "发布评论失败。"
    };
  }
}

export async function deletePhotoCommentAction(id: string) {
  await requireAdminAction();
  await prisma.photoComment.delete({ where: { id } });
  revalidatePath("/album");
  revalidatePath("/admin");
}

export async function createGuestbookMessageAction(
  _previousState: ActionState = emptyState,
  formData: FormData
): Promise<ActionState> {
  void _previousState;
  try {
    const parsed = guestbookSchema.parse({
      author: getString(formData, "author"),
      body: getString(formData, "body")
    });

    await prisma.guestbookMessage.create({
      data: parsed
    });

    revalidatePath("/guestbook");
    revalidatePath("/");

    return {
      ok: true,
      message: "留言已发布。"
    };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "发布留言失败。"
    };
  }
}

export async function deleteGuestbookMessageAction(id: string) {
  await requireAdminAction();
  await prisma.guestbookMessage.delete({ where: { id } });
  revalidatePath("/guestbook");
  revalidatePath("/admin");
}

export async function toggleGuestbookPinAction(id: string, isPinned: boolean) {
  await requireAdminAction();
  await prisma.guestbookMessage.update({
    where: { id },
    data: { isPinned }
  });
  revalidatePath("/guestbook");
  revalidatePath("/admin");
}

export async function createMomentPostAction(
  _previousState: ActionState = emptyState,
  formData: FormData
): Promise<ActionState> {
  void _previousState;
  try {
    await requireAdminAction();
    const parsed = momentSchema.parse({
      title: getString(formData, "title"),
      body: getString(formData, "body"),
      postedAt: getString(formData, "postedAt"),
      location: getString(formData, "location") || undefined
    });
    const files = formData.getAll("photos").filter((file): file is File => file instanceof File && file.size > 0);

    if (files.length === 0) {
      return {
        ok: false,
        message: "请至少上传一张组图照片。"
      };
    }

    if (files.length > 9) {
      return {
        ok: false,
        message: "一条动态最多上传 9 张照片。"
      };
    }

    const uploaded: UploadedMomentPhoto[] = [];
    for (const [index, file] of files.entries()) {
      try {
        const result = await uploadPhotoFile(file);
        uploaded.push({
          imageUrl: result.publicUrl,
          storagePath: result.storagePath,
          order: index
        });
      } catch (error) {
        const sizeMb = (file.size / 1024 / 1024).toFixed(1);
        throw new Error(
          `第 ${index + 1} 张图片上传失败（${file.name || "未命名"}，${sizeMb}MB）：${
            error instanceof Error ? error.message : "未知错误"
          }`
        );
      }
    }

    const postedAt = parseDate(parsed.postedAt);

    await prisma.$transaction(async (tx) => {
      await tx.momentPost.create({
        data: {
          title: parsed.title,
          body: parsed.body,
          postedAt,
          location: parsed.location,
          photos: {
            create: uploaded
          }
        }
      });

      await tx.photo.createMany({
        data: uploaded.map((photo, index) => ({
          title: `${parsed.title} 第 ${index + 1} 张`,
          description: parsed.body,
          imageUrl: photo.imageUrl,
          storagePath: null,
          takenAt: postedAt,
          location: parsed.location,
          category: "动态",
          isFeatured: false
        }))
      });
    });

    revalidatePath("/");
    revalidatePath("/album");
    revalidatePath("/moments");
    revalidatePath("/admin");

    return {
      ok: true,
      message: "组图动态已发布，并已同步保存到相册。"
    };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "发布组图动态失败。"
    };
  }
}

export async function deleteMomentPostAction(id: string) {
  await requireAdminAction();
  const post = await prisma.momentPost.findUnique({
    where: { id },
    include: { photos: true }
  });

  if (!post) {
    return;
  }

  const imageUrls = post.photos.map((photo) => photo.imageUrl);

  await prisma.momentPost.delete({ where: { id } });
  await prisma.photo.deleteMany({
    where: {
      category: "动态",
      imageUrl: {
        in: imageUrls
      }
    }
  });

  for (const photo of post.photos) {
    await removePhotoFile(photo.storagePath);
  }

  revalidatePath("/");
  revalidatePath("/album");
  revalidatePath("/moments");
  revalidatePath("/admin");
}
