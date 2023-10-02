import { client } from "@/utilities/sanityClient";
import { NextResponse } from "next/server";

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file:null|File|string= form.get("file");
    console.log(file);

    if (file && typeof file != 'string') {
      const arr = await file.arrayBuffer();
      const buffer = Buffer.from(arr);
      const uploadedAssetRes = await client.assets.upload("file", buffer, {
        contentType: file.type,
        filename: file.name,
      });
      return NextResponse.json({result:true, res:uploadedAssetRes});
    }else{
      return NextResponse.json({ result:false,res:'This file is not supported'});
    }
  } catch (error) {
    console.error(error);
  }
}
