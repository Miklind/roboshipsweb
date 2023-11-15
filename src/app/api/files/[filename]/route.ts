import fs from 'fs/promises'
import path from 'path';

export async function GET(request: Request, { params }: { params: { filename: string } }) {
    
    try
    {
        const dirPath = path.join(process.cwd(), 'public/shipfiles' , params.filename);
        let file = await fs.readFile(dirPath, 'utf8')
        let ship = JSON.parse(file)
        return Response.json(ship)
    }
    catch(err)
    {
        return Response.json({error: "Error loading file. " + err})
    }    
}

export async function POST(request: Request, { params }: { params: { filename: string } }) {

    const shipData = await request.json()

    try
    {
        const dirPath = path.join(process.cwd(), 'public/shipfiles' , params.filename);
        await fs.writeFile(dirPath, JSON.stringify(shipData))        
    }
    catch(err)
    {
        return Response.json({error: "Error saving file. " + err})
    }  

    return Response.json( shipData )
  }