"use client";
import React, { useEffect, useState } from "react";
import { AiFillLike } from "react-icons/ai";
import { useSession } from "next-auth/react";
import { client } from "@/lib/sanityClient";
import { useAppDispatch, useAppSelector } from "@/redux_toolkit/hooks";
import { setUser, set_media_items } from "@/redux_toolkit/features/indexSlice";
const LikesButton = ({ meadia_item }) => {
  const dispatch = useAppDispatch();
  const { data: session } = useSession();
  const user = useAppSelector((state) => state.hooks.user);
  const media_Items = useAppSelector((state) => state.hooks.media_Items);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [api, setApi] = useState<boolean>(false);

  // the below get user function is repetitive it is also called in comment component and other all the function which need user with _id
  const getUserId = async () => {
    if (!user._id) {
      try {
        const id = await client.fetch(
          `*[_type=="user" && email=="${session?.user?.email}"]{_id}`
        );
        dispatch(setUser({ ...user, _id: id[0]._id }));
        return { ...user, _id: id[0]._id };
      } catch (error) {
        console.error(error);
        alert(`Unable to find Profile ID => ${error.message} `);
      }
    } else {
      return user;
    }
  };

  const handleLikeButton = async () => {
    setApi(true);
    const user_with_id = await getUserId();
    try {
      setIsLiked((val) => !val);
      const res = await fetch("/api/likeButton", {
        method: "POST",
        body: JSON.stringify({ meadia_item, user: user_with_id, isLiked }),
      });
      const jsonRes = await res.json();
      setIsLiked(true);
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
              const _key = jsonRes?.likes.map((item) => {
                console.log(item.postedBy._ref == user._id);
                console.log(item.postedBy._ref + " " + user._id);
                if (item.postedBy._ref == user._id) {
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
  }, [api, media_Items,session]);

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
