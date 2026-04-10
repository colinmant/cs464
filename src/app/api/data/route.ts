import path from 'path'
import fs from 'fs/promises'
import { DataFile } from '@/types/data'


const dataDirectory = path.join(process.cwd(), "data")

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const name = searchParams.get('name')

    // query param containing name -> return specified file
    if (name) {
        const filePath = path.join(dataDirectory, `${name}.json`)
        try {
            const content = await fs.readFile(filePath, 'utf-8')
            return Response.json(JSON.parse(content))
        } catch {
            return Response.json({ error: `No dataset found for ${name}` }, { status: 404 })
        }
    } 

    // no query param

    // get files
    const files = (await fs.readdir(dataDirectory)).filter(f => f.endsWith('.json'))
    const allData: Record<string, DataFile> = {}

    // iterate through json files in dataDirectory 
    for (const file of files){
        const filePath = path.join(dataDirectory, file)
        const content = await fs.readFile(filePath, 'utf-8')
        allData[file.replace('.json', '')] = JSON.parse(content)
    }
    return Response.json(allData)
}
