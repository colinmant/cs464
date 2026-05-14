import * as z from "zod";
import { getSupabaseClient } from "@/lib/supabase";
import { NextRequest } from "next/server";

export async function DELETE(
  request: Request) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get('slug')
  const supabase = getSupabaseClient()

  if (slug) {
    const { data, error } = await supabase
      .from('datasets')
      .delete()
      .eq('dataset_slug', slug)
      .select();

    if (error) {
      return Resposne.json({ status: 500 }, { error: error.message })
    }

    if (!data || data.length === 0) {
      return { status: 404, message: `Dataset with slug ${slug} not found.`}
    }

    return Response.json({ status: 200 }, { message: Successfully deleted", deletedItem: data[0] })
  }
  return Response.json({ message: "No slug provided" }, { status: 400 })
}
