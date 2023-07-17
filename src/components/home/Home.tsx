"use client";
import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../redux_toolkit/hooks";
import { RootState } from "@/redux_toolkit/store";
import { client, urlFor } from "../../lib/sanityClient";
import {
  toggle_dark_mode,
  set_media_items,
} from "../../redux_toolkit/features/indexSlice";
import Metadata_with_Comment from "../metadataOfMedia/MetaData";
import { useSession } from "next-auth/react";
import Media from "../media/Media";
const Home = () => {
  const scrrenMode = useAppSelector((state: RootState) => state.hooks.darkmode);
  const { data: session } = useSession();
  const media_Items = useAppSelector(
    (state: RootState) => state.hooks.media_Items
  );
  const dispatch = useAppDispatch();

  const getPostedMeadia = async () => {
    const media = await client.fetch(
      `*[_type == "post"]{_id,caption,desc,meadiaFile,postedBy->,tag,comments[]{comment,postedBy->}}`
    );
    dispatch(set_media_items(media));
    console.log(media);
    return media;
  };

  useEffect(() => {
    if (!media_Items?.length) {
      getPostedMeadia();
    }
  }, []);
  console.log(media_Items);
  return (
    <div className="w-full flex justify-center items-center">
      {/* <div className="w-[15%] h-screen bg-slate-600"></div> */}
      <div className="w-[80%] h-screen ">
        {media_Items.map((item, i) => {
          const { meadiaFile, postedBy } = item;
          // const { name: user } = postedBy;
          return (
            <div
              key={i}
              className="w-full py-2 flex justify-evenly items-start bg-green-600 rounded-xl"
            >
              <div
                className={`h-[395px] w-[65%] overflow-hidden flex justify-center items-center`}
              >
                <Media meadiaFile={meadiaFile} profileView={false} />
              </div>

              {/* in this Comment component all the information of media file is available */}
              {/* we will fix that later */}
              <Metadata_with_Comment
                meadia_item={item}
                user={postedBy.name ? postedBy.name : "Unknown"}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Home;
