import { client } from "@/lib/sanityClient";
import { NextResponse } from "next/server";
import { uploadForm } from "@/typeScript/basics";
import { basename } from "path";
import { createReadStream } from "fs";

interface reqBody extends uploadForm {
  _id:string
}

export async function POST(req: Request) {
  try {
    const body:reqBody = await req.json();
   const { caption, desc, file,fileList, _id ,fileData}=body
    // const meadiaAsset = await client.assets.upload("image", meadia_file, {
    //   contentType: meadia_file.type,
    //   filename: meadia_file.name,
    // });
    console.log(fileData)

    return NextResponse.json(fileData);
  } catch (error) {
    console.error(error);
    // return NextResponse.json(error);
  }
}
