"use client";
import React, { useEffect } from "react";
import { getFileAsset } from "@sanity/asset-utils";
import { useAppDispatch, useAppSelector } from "../../redux_toolkit/hooks";
import { RootState } from "@/redux_toolkit/store";
import { client, urlFor } from "../../lib/sanityClient";
import {
  toggle_dark_mode,
  set_media_items,
} from "../../redux_toolkit/features/counterSlice";
import Image from "next/image";
import Comment from "../comment/Comment";
import { useSession } from "next-auth/react";
const Home = () => {
  const scrrenMode = useAppSelector((state: RootState) => state.hooks.darkmode);
  const { data: session } = useSession();
  const all_Media_content = useAppSelector(
    (state: RootState) => state.hooks.media_Items
  );
  const dispatch = useAppDispatch();

  const postedMeadia = async () => {
    const media = await client.fetch(
      `*[_type == "post" && postedBy->email=="anuragdhurwey9211@gmail.com"]{_id,caption,desc,meadiaFile,postedBy->,tag,comments[]{comment,postedBy->}}`
    );
    // console.log(media)
    dispatch(set_media_items(media));
    return media;
  };

  useEffect(() => {
    if (!all_Media_content?.length) {
      postedMeadia();
    }
  }, []);

  return (
    <div className="w-full flex justify-center items-center">
      {/* <div className="w-[15%] h-screen bg-slate-600"></div> */}
      <div className="w-[80%] h-screen ">
        {all_Media_content.map((item, i) => {
          const { caption, desc, meadiaFile, postedBy, comments } = item;
          const { name:user } = postedBy;
          const url = getFileAsset(meadiaFile.asset, {
            projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
            dataset: "production",
          }).url;
          const meadiaType = `${url.substring(url.lastIndexOf(".") + 1)}`;

          return (
            <div
              key={i}
              className="w-full py-2 flex justify-evenly items-start bg-green-600"
            >
              <div className="w-[65%] h-[395px] overflow-hidden flex justify-center items-center">
                {["webm", "mp4", "avi", "ogg"].includes(meadiaType) && (
                  <video controls src={url} className=" max-h-[395px]" />
                )}

                {["jpeg", "jpg", "png"].includes(meadiaType) && (
                  <Image
                    src={url}
                    alt="post"
                    width={1000}
                    height={1000}
                    className="max-h-[395px]"
                  />
                )}
              </div>

              {/* in this Comment component all the information of media file is available */}
              {/* we will fix that later */}
              <Comment
                comments={comments}
                caption={caption}
                desc={desc}
                user={user}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Home;
