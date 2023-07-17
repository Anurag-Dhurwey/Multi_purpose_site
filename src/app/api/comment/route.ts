import { client } from "@/lib/sanityClient";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { form, meadia_item, user } = await req.json();
  const { _id } = meadia_item;
  try {
    const res = await client
      .patch(_id)
      .set({
        comments: [
          ...meadia_item.comments,
          { comment: form, postedBy: { _type: "reference", _ref: user._id } },
        ],
      })
      .commit();
    return NextResponse.json({ ...res });
  } catch (error) {
    console.error(error);
  }
}
