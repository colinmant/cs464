import { Dataset, DatasetDatabaseItem } from '@/types/data'
import { getSupabaseClient } from '@/lib/supabase'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const name = searchParams.get('name')

    try {
        const supabase = getSupabaseClient()

        // query param containing name -> return specified dataset
        if (name) {
            const { data: datasetData, error: datasetError } = await supabase
                .from('datasets')
                .select('id, dataset_slug, title, description')
                .eq('dataset_slug', name)
                .single()

            const dataset = datasetData as Dataset | null

            if (datasetError || !dataset) {
                return Response.json({ error: `No dataset found for ${name}` }, { status: 404 })
            }

            const { data: itemsData, error: itemsError } = await supabase
                .from('dataset_items')
                .select('item_name, item_order')
                .eq('dataset_id', dataset.id)
                .order('item_order', { ascending: true })

            const items = (itemsData || []) as DatasetDatabaseItem[]

            if (itemsError) {
                throw itemsError
            }

            const dataFile: Dataset = {
                id: dataset.id,
                title: dataset.title,
                description: dataset.description || '',
                items: (items || []).map(item => ({
                    name: item.item_name,
                    order: item.item_order
                }))
            }

            return Response.json(dataFile)
        }

        // no query param -> return all datasets
        const { data: datasetsData, error: datasetsError } = await supabase
            .from('datasets')
            .select('id, dataset_slug, title, description')
            .order('dataset_slug', { ascending: true })

        const datasets = (datasetsData || []) as Dataset[]

        if (datasetsError) {
            throw datasetsError
        }

        const allData: Record<string, Dataset> = {}

        // fetch items for each dataset
        for (const dataset of datasets || []) {
            const { data: itemsData, error: itemsError } = await supabase
                .from('dataset_items')
                .select('item_name, item_order')
                .eq('dataset_id', dataset.id)
                .order('item_order', { ascending: true })

            const items = (itemsData || []) as DatasetDatabaseItem[]

            if (itemsError) {
                throw itemsError
            }

            allData[dataset.dataset_slug ?? ""] = {
                id: dataset.id,
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
