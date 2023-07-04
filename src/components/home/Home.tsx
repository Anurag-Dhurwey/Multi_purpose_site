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
const Home = () => {
  const scrrenMode = useAppSelector((state: RootState) => state.hooks.darkmode);
  const all_Media_content = useAppSelector(
    (state: RootState) => state.hooks.media_Items
  );
  const dispatch = useAppDispatch();

  const usersList = async () => {
    const media = await client.fetch(`*[_type == "post"]{_id,caption,desc,meadiaFile,postedBy->,tag}`);
    // console.log(media)
    dispatch(set_media_items(media));
    return media;
  };

  useEffect(() => {
    usersList();
  }, []);

  return (
    <div className="w-full flex justify-center items-center">
      <div className="w-[15%] h-screen bg-slate-600"></div>
      <div className="w-[80%] h-screen ">
        {all_Media_content.map((item, i) => {
          const { caption, desc, meadiaFile, postedBy } = item;
          const {userName}=postedBy
          const url = getFileAsset(meadiaFile.asset, { projectId: "8u4ze61m", dataset: "production",}).url;
          const meadiaType=`${url.substring(url.lastIndexOf(".") + 1)}`
          console.log(item)
          return (
            <div key={i} className="w-full py-2 flex justify-evenly items-start bg-green-600">
              <div className="w-[65%] h-fit">
              {
                ['webm','mp4','avi','ogg'].includes(meadiaType) && (
                  <video controls src={url}  />
                )
              }

              {
                ['jpeg' , 'jpg','png'].includes(meadiaType) && (
                  <Image src={url} alt="post" width={1000} height={1000} />
                )
              }
              </div>
              <div className="w-[30%] h-full bg-yellow-700 p-3">
                <div className="flex justify-start items-center gap-x-2">
                  <button className="h-8 w-8 bg-blue-600 rounded-3xl"></button>
                  <h4>{userName}</h4>
                </div>
                <div></div>
                <div></div>
              </div>
            </div>
          );
        })}
      </div>
  
    </div>
  );
};

export default Home;
