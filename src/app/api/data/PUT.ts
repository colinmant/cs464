import * as z from "zod";
import { getSupabaseClient } from "@/lib/supabase";
import { NextRequest } from "next/server";

export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    const body = Data.parse(await request.json());
    const supabase = getSupabaseClient();

    const orderSet = new Set(body.items.map(i => i.order));
    if (orderSet.size !== body.items.length) {
      return Response.json({ error: "Item order values must be unique" }, { status: 400 });
    }

    const { data: dataset, error: updateError } = await supabase
      .from('datasets')
      .update({
        dataset_slug: body.slug,
        title: body.title,
        description: body.description,
        updated_at: new Date().toISOString(),
      })
      .eq('dataset_slug', slug)
      .select('id')
      .single();

    if (updateError) return Response.json({ error: updateError.message }, { status: 500 });

    const datasetId = dataset.id;

    await supabase.from('dataset_items').delete().eq('dataset_id', datasetId);

    const itemsToInsert = body.items.map(item => ({
      dataset_id: datasetId,
      item_name: item.name,
      item_order: item.order,
    }));

    const { error: itemsError } = await supabase
      .from('dataset_items')
      .insert(itemsToInsert);

    if (itemsError) return Response.json({ error: "Failed to update items" }, { status: 500 });

    return Response.json({ message: "Dataset updated successfully" });

  } catch (err) {
    if (err instanceof z.ZodError) return Response.json({ error: err.flatten() }, { status: 400 });
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
