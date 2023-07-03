"use client";
import React, { useEffect } from "react";
import { buildFileUrl } from "@sanity/asset-utils";
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
    const media = await client.fetch(`*[_type == "post"]`);
    // console.log(media)
    dispatch(set_media_items(media));
    return media;
  };
  console.log(all_Media_content);

  useEffect(() => {
    usersList();
  }, []);

  return (
    <div className="w-full flex justify-center items-center">
      <div className="w-[15%] h-screen bg-slate-600"></div>
      <div className="w-[60%] h-screen bg-green-600">
        {all_Media_content.map((item, i) => {
          const { caption, desc, meadiaFile, postedBy } = item;
          // console.log(buildFileUrl(meadiaFile))
          console.log(getFileAsset(meadiaFile.asset,{projectId: '8u4ze61m', dataset:'production'}))

          return (
            <div key={i}>
              <video controls src={getFileAsset(meadiaFile.asset,{projectId: '8u4ze61m', dataset:'production'}).url}/>
            </div>
          );
        })}
      </div>
      <div className="w-[15%] h-screen bg-yellow-700"></div>
    </div>
  );
};

export default Home;
