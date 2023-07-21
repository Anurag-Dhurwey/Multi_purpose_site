"use client";
import React, { useEffect, useState } from "react";
import { AiFillLike } from "react-icons/ai";
import { useSession } from "next-auth/react";
import { client } from "@/lib/sanityClient";
import { useAppDispatch, useAppSelector } from "@/redux_toolkit/hooks";
import { setUser, set_media_items } from "@/redux_toolkit/features/indexSlice";
import { getUserId } from "@/lib/functions/getUserId";
import { media_Item, postedBy } from "@/typeScript/basics";
const LikesButton = ({ meadia_item }: { meadia_item: media_Item }) => {
  const dispatch = useAppDispatch();
  const { data: session } = useSession();
  const user = useAppSelector((state) => state.hooks.user);
  const media_Items = useAppSelector((state) => state.hooks.media_Items);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [api, setApi] = useState<boolean>(false);


  const handleLikeButton = async () => {
    if(session){
      setApi(true);
    const user_with_id = await getUserId({ dispatch, setUser, user, session });
    try {
      setIsLiked((val) => !val);
      const res = await fetch("/api/likeButton", {
        method: "POST",
        body: JSON.stringify({ meadia_item, user: user_with_id, isLiked }),
      });
      const jsonRes = await res.json();
      // setIsLiked(true);
      if (jsonRes) {
        const updatedMeadia_Items = media_Items.map((item) => {
          if (item._id == jsonRes._id) {
            if (isLiked) {
              const newLikesList = item.likes?.filter((like) => {
                return like.postedBy.email !== session?.user?.email;
              });
              setIsLiked(false);
              return { ...item, likes: [...newLikesList] };
            } else {
              const _key = jsonRes?.likes.map((item: like) => {
                console.log(item.postedBy._ref == user._id);
                if (item.postedBy._ref == user._id) {
                  console.log(item._key);
                  return item._key;
                }
              });
              if (item.likes) {
                return {
                  ...item,
                  likes: [
                    ...item.likes,
                    {
                      _key: _key[0],
                      postedBy: { email: session?.user?.email },
                    },
                  ],
                };
              } else {
                return {
                  ...item,
                  likes: [
                    {
                      _key: _key[0],
                      postedBy: { email: session?.user?.email },
                    },
                  ],
                };
              }
            }
          } else {
            return item;
          }
        });
        dispatch(set_media_items([...updatedMeadia_Items]));
        console.log(jsonRes);
      }
    } catch (error) {
      setIsLiked((val) => !val);
      console.error(error);
      console.log("unable to like =>> Internal server error");
    } finally {
      setApi(false);
    }
    }else{
      console.log('session not found')
    }
  };

  useEffect(() => {
    const mapLikes = meadia_item.likes?.filter((item) => {
      if (item._key) {
        return item.postedBy.email == session?.user?.email;
      }
    });
    if (mapLikes?.length) {
      console.log(mapLikes);
      setIsLiked(true);
    }
  }, [api, media_Items, session]);

  return (
    <button
      disabled={api}
      onClick={() => handleLikeButton()}
      className="text-2xl"
    >
      <AiFillLike style={{ color: isLiked ? "blue" : "white" }} />
    </button>
  );
};

export default LikesButton;

interface like {
  _key: string;
  postedBy: { _type: string; _ref: string };
}
