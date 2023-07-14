import { client } from "@/lib/sanityClient";
import { NextResponse } from "next/server";
import { uploadForm, user } from "@/typeScript/basics";

interface Body {
  jsonRes: object;
  user: user;
  form: uploadForm;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { jsonRes, user, form }: Body = body;
    const doc = {
      _type: "post",
      meadiaFile: {
        _type: "file",
        asset: {
          _type: "reference",
          _ref: jsonRes._id,
        },
      },
      postedBy: {
        _type: "reference",
        _ref: user._id,
      },
      caption: form.caption,
      desc: form.desc,
      tag: "",
    };
    const res = await client.create(doc);

    return NextResponse.json(res);
  } catch (error) {
    console.error(error);
    // return NextResponse.json(error);
  }
}
