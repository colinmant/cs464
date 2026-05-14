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
      return Response.json({ error: error.message }, { status: 500 })
    }

    if (!data || data.length === 0) {
      return Response.json({ message: `Dataset with slug ${slug} not found.` }, { status: 404 })
    }

    return Response.json({ message: "Successfully deleted", deletedItem: data[0] }, { status: 200 })
  }
  return Response.json({ message: "No slug provided" }, { status: 400 })
}
