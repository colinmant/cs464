import * as z from "zod";
import { getSupabaseClient } from "@/lib/supabase";
import { NextRequest } from "next/server";

const MIN_ITEMS = 2
// The expected structure of the request body & validation rules
const Data = z.object({
    slug: z.string("Missing slug")
      .min(3, "Slug must be at least 3 characters long")
      .regex(/^[a-z0-9\-]*$/, "Slug must be lowercase and can only contain letters, numbers, and hyphens")
      .regex(/^.*[a-z0-9]$/, "Slug must not end with a hyphen"),
    title: z.string("Missing title").min(1, "Title cannot be empty"),
    description: z.string().optional(),
    items: z.array(
      z.object({
          name: z.string("Missing item name").min(1, "Item name cannot be empty"),
          order: z.number().min(0, "Item order must be a positive integer")
      })
    ).min(MIN_ITEMS, `At least ${MIN_ITEMS} item(s) are required`)
})

export async function POST(request: NextRequest) {
  try {
    const body = Data.parse(await request.json())
    const supabase = getSupabaseClient()

    // Validate the order values are unique within the items array
    const orderSet = new Set<number>(body.items.map(item => item.order))
    if(orderSet.size !== body.items.length) {
      return Response.json({ error: "Item order values must be unique" }, { status: 400 })
    }

    // Create the dataset entry
    const { data, error } = await supabase
      .from('datasets')
      .insert([{
        dataset_slug: body.slug,
        title: body.title,
        description: body.description,
        updated_at: new Date().toISOString(),
      }])
      .select('id')

    if (error) {
      if(error.code === '23505') { // unique violation
        return Response.json({ error: 'A dataset with this slug already exists' }, { status: 409 })
      }
      return Response.json({ error: 'Failed to create dataset' }, { status: 500 })
    }

    const datasetId = data?.[0]?.id

    if (!datasetId) {
      console.error('No dataset ID returned after insertion')
      return Response.json({ error: 'Failed to create dataset' }, { status: 500 })
    }

    // Create the dataset items
    const itemsToInsert = body.items.map(item => ({
      dataset_id: datasetId,
      item_name: item.name,
      item_order: item.order,
    }))

    const { error: itemsError } = await supabase
      .from('dataset_items')
      .insert(itemsToInsert)

    if (itemsError) {
      console.error('Error inserting dataset items:', itemsError)
      // Rollback the dataset creation since item creation failed
      await supabase.from('datasets').delete().eq('id', datasetId)
      return Response.json({ error: 'Failed to create dataset items' }, { status: 500 })
    }

    return Response.json({ message: 'Dataset created successfully', datasetId }, { status: 201 })


  } catch (err) {
    if (err instanceof z.ZodError) {
      return Response.json({ error: z.treeifyError(err) }, { status: 400 })
    } else if(err instanceof SyntaxError) {
      return Response.json({ error: "Invalid JSON" }, { status: 400 })
    }
    return Response.json({ error: "Internal Server Error" }, { status: 500 })
  }
}