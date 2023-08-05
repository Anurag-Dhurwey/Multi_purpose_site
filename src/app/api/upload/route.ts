import { client } from "@/utilities/sanityClient";
import { NextResponse } from "next/server";
import { uploadForm, user } from "@/typeScript/basics";

interface Body {
  uploadedFileRes: {
    _id:string
  };
  user: user;
  form: uploadForm;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { uploadedFileRes, user, form }: Body = body;
    const doc = {
      _type: "post",
      meadiaFile: {
        _type: "file",
        asset: {
          _type: "reference",
          _ref: uploadedFileRes._id,
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
    const createdPost = {
      caption: form.caption,
      desc: form.desc,
      tag: "",
      meadiaFile: {
        _type: "file",
        asset: {
          _type: "reference",
          _ref: uploadedFileRes._id,
        },
      },
      postedBy: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
      comments: [],
      likes: [],
    };
    return NextResponse.json({res,createdPost});
  } catch (error) {
    console.error(error);
    // return NextResponse.json(error);
  }
}
