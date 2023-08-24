"use client";
import React, { useEffect, useState } from "react";
import { AiFillLike } from "react-icons/ai";
import { useSession } from "next-auth/react";
import { client } from "@/utilities/sanityClient";
import { useAppDispatch, useAppSelector } from "@/redux_toolkit/hooks";
import { set_media_items } from "@/redux_toolkit/features/indexSlice";
import { like, media_Item, postedBy } from "@/typeScript/basics";
import { message } from "antd";
import { v4 as uuidv4 } from "uuid";

const LikesButton = ({ meadia_item }: { meadia_item: media_Item }) => {
  const dispatch = useAppDispatch();
  const { data: session } = useSession();
  const admin = useAppSelector((state) => state.hooks.admin);
  const media_Items = useAppSelector((state) => state.hooks.media_Items);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [btnColor, setBtnColor] = useState<string>();
  const [api, setApi] = useState<boolean>(false);

  async function like() {

    try {
      const res = await client
        .patch(meadia_item._id)
        .setIfMissing({ likes: [] })
        .insert("after", "likes[-1]", [
          {
            _key: uuidv4(),
            userId: admin._id,
            name: admin.name,
            email: admin.email,
          },
        ])
        .commit();
      const key: like | undefined = res.likes.find(
        (item: like) => item.userId == admin._id
      );
      console.log({ key, isLiked, res });
      if (key?._key) {
        const updatedMeadia_Items = media_Items.map((item) => {
          if (item._id == res._id && admin.email && admin.name && admin._id) {
            return {
              ...item,
              likes: item.likes
                ? [
                    ...item.likes,
                    {
                      _key: key._key,
                      userId: admin._id,
                      email: admin.email,
                      name: admin.name,
                    },
                  ]
                : [
                    {
                      _key: key._key,
                      userId: admin._id,
                      email: admin.email,
                      name: admin.name,
                    },
                  ],
            };
          } else {
            return item;
          }
        });
        // setIsLiked(true);
        dispatch(set_media_items([...updatedMeadia_Items]));
      } else {
        throw new Error("_key not found");
      }
    } catch (error) {
      setBtnColor((pre) => (pre == "white" ? "blue" : "white"));
      console.error(error);
    }
  }

  async function unLike() {
    setBtnColor("white")
    try {
      const key = meadia_item.likes?.find(
        (item: like) => item.email == admin.email
      );
      if (key?._key) {
        const res = await client
          .patch(meadia_item._id)
          .unset(["likes[0]", `likes[_key=="${key._key}"]`])
          .commit();

        const updatedMeadia_Items = media_Items.map((item) => {
          if (item._id == res._id && admin.email && admin.name && admin._id) {
            const newLikesList = item.likes?.filter((like) => {
              return like.email !== admin.email;
            });
            const returnVal = { ...item, likes: newLikesList };
            return returnVal;
          } else {
            return item;
          }
        });
        dispatch(set_media_items([...updatedMeadia_Items]));
      } else {
        throw new Error("_key not found");
      }
    } catch (error) {
      setBtnColor((pre) => (pre == "white" ? "blue" : "white"));
      console.error(error);
    }
  }

  const handleLikeButton = async () => {
    if (session && admin._id && admin.email) {
      setApi(true);

      try {
        if (isLiked) {
          await unLike();
        } else {
          await like();
        }
      } catch (error) {
        console.error(error);
        message.error("Internal server error");
      } finally {
        setApi(false);
      }
    } else {
      console.error("session not found");
      message.error("session not found");
    }
  };

  useEffect(() => {
    const mapLikes = meadia_item.likes?.find((item) => item.email == admin.email && item.userId == admin._id);
    if (mapLikes) {
      setIsLiked(true);
      setBtnColor("blue");
    }else{
      setIsLiked(false);
      setBtnColor("white");
    }
  }, [api, media_Items, session]);

  return (
    <>
      <button
        disabled={api}
        onClick={() => handleLikeButton()}
        className="text-2xl"
      >
        <AiFillLike style={{ color: btnColor }} />
      </button>
    </>
  );
};

export default LikesButton;
