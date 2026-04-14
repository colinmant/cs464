import { supabase } from '@/lib/supabase'
import { DataFile } from '@/types/data'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const name = searchParams.get('name')

    try {
        // query param containing name -> return specified dataset
        if (name) {
            const { data: dataset, error: datasetError } = await supabase
                .from('datasets')
                .select('*')
                .eq('dataset_slug', name)
                .single()

            if (datasetError || !dataset) {
                return Response.json({ error: `No dataset found for ${name}` }, { status: 404 })
            }

            const { data: items, error: itemsError } = await supabase
                .from('dataset_items')
                .select('item_name, item_order')
                .eq('dataset_id', dataset.id)
                .order('item_order', { ascending: true })

            if (itemsError) {
                throw itemsError
            }

            const dataFile: DataFile = {
                title: dataset.title,
                description: dataset.description || '',
                items: items.map(item => ({
                    name: item.item_name,
                    order: item.item_order
                }))
            }

            return Response.json(dataFile)
        }

        // no query param -> return all datasets
        const { data: datasets, error: datasetsError } = await supabase
            .from('datasets')
            .select('*')
            .order('dataset_slug', { ascending: true })

        if (datasetsError) {
            throw datasetsError
        }

        const allData: Record<string, DataFile> = {}

        // fetch items for each dataset
        for (const dataset of datasets || []) {
            const { data: items, error: itemsError } = await supabase
                .from('dataset_items')
                .select('item_name, item_order')
                .eq('dataset_id', dataset.id)
                .order('item_order', { ascending: true })

            if (itemsError) {
                throw itemsError
            }

            allData[dataset.dataset_slug] = {
                title: dataset.title,
                description: dataset.description || '',
                items: (items || []).map(item => ({
                    name: item.item_name,
                    order: item.item_order
                }))
            }
        }

        return Response.json({ datasets: allData })
    } catch (error) {
        console.error('Database error:', error)
        return Response.json({ error: 'Failed to fetch datasets' }, { status: 500 })
    }
}
