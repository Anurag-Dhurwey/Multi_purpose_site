import { client } from "@/lib/sanityClient";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { form, meadia_item, user } = await req.json();
  const { _id } = meadia_item;
  try {
    const res = await client
      .patch(_id)
      .setIfMissing({comments: []}).insert('after', 'comments[-1]', [ { comment: form, postedBy: { _type: "reference", _ref: user._id } }])
      .commit({
        // Adds a `_key` attribute to array items, unique within the array, to
        // ensure it can be addressed uniquely in a real-time collaboration context
        autoGenerateArrayKeys: true,
      });
    return NextResponse.json({ ...res });
  } catch (error) {
    console.error(error);
  }
}
