import { client } from "@/lib/sanityClient";
import { NextResponse } from "next/server";

interface item {
  postedBy: {
    email: string;
  };
  _key: string;
}

export async function POST(req: Request) {
  const { meadia_item, user, isLiked } = await req.json();
  try {
    if (isLiked) {
      console.log(user);
      const _key = meadia_item.likes?.map((item: item) => {
        if (item.postedBy.email == user.email) {
          console.log(item._key + " _key");
          console.log(item);
          return item._key;
        }
      });
      const res = await client
        .patch(meadia_item._id)
        .unset(["likes[0]", `likes[_key==${_key}]`])
        .commit();

      // while removing liked posts from user array it must need _key but getting a uniq _key from database is little bit slow and it will consume extra bandwith

      //   const removeFromUserArray = await client
      //     .patch(user._id)
      //     .unset(["likedPosts[0]", `likedPosts[_key==${user_key}]`])
      //     .commit();
      return NextResponse.json({ ...res });
    } else {
      // to add on posts likes array
      const res = await client
        .patch(meadia_item._id)
        .setIfMissing({ likes: [] })
        .insert("after", "likes[-1]", [
          { postedBy: { _type: "reference", _ref: user._id } },
        ])
        .commit({
          autoGenerateArrayKeys: true,
        });
      // to add on user's liked posts array
      // const userArray = await client
      //   .patch(user._id)
      //   .setIfMissing({ likedPosts: [] })
      //   .insert("after", "likedPosts[-1]", [
      //     { post: { _type: "reference", _ref: meadia_item._id } },
      //   ])
      //   .commit({ autoGenerateArrayKeys: true });
      return NextResponse.json({ ...res });
    }
  } catch (error) {
    console.error(error);
  }
}
