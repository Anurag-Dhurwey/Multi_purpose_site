import { client } from "@/utilities/sanityClient";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
export async function POST(req: Request) {
  const { form, meadia_item, user } = await req.json();
  const { _id } = meadia_item;
  try {
    const res = await client
      .patch(_id)
      .setIfMissing({comments: []}).insert('after', 'comments[-1]', [ {_key:uuidv4(), comment: form, userId:user._id,name:user.name,email:user.email }])
      .commit();
    return NextResponse.json({ ...res });
  } catch (error) {
    console.error(error);
  }
}
