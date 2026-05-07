import * as z from "zod";
import { getSupabaseClient } from "@/lib/supabase";
import { NextRequest } from "next/server";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;
  const supabase = getSupabaseClient();

  const { error } = await supabase
    .from('datasets')
    .delete()
    .eq('dataset_slug', slug);

  if (error) {
    return Response.json({ error: "Failed to delete dataset" }, { status: 500 });
  }

  return Response.json({ message: "Dataset deleted successfully" }, { status: 200 });
}
