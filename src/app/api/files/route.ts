import fs from 'fs/promises'
import path from 'path';

export async function GET(request: Request) {            
    const dirPath = path.join(process.cwd(), 'public/shipfiles');
    let files : string[]=await fs.readdir(dirPath)
    
    return Response.json(files)
}