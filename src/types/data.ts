export interface DataItem {
    name: string
    order: number
}

export interface DataFile {
    title: string
    description: string
    items: DataItem[]
}