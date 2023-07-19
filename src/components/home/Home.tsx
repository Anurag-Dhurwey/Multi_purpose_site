"use client";
import React, { useEffect } from "react";
import style from './home.module.css'
import { useAppDispatch, useAppSelector } from "../../redux_toolkit/hooks";
import { RootState } from "@/redux_toolkit/store";
import { client, urlFor } from "../../lib/sanityClient";
import {
  toggle_dark_mode,
  set_media_items,
  setUser,
} from "../../redux_toolkit/features/indexSlice";
import Metadata_with_Comment from "../metadataOfMedia/MetaData";
import { useSession } from "next-auth/react";
import Media from "../media/Media";
import LikesButton from "../metadataOfMedia/miniComps/LikesButton";
const Home = () => {
  const scrrenMode = useAppSelector((state: RootState) => state.hooks.darkmode);
  const { data: session } = useSession();
  const user = useAppSelector((state) => state.hooks.user);
  const media_Items = useAppSelector(
    (state: RootState) => state.hooks.media_Items
  );
  const dispatch = useAppDispatch();

  const getPostedMeadia = async () => {
    const media = await client.fetch(
      `*[_type == "post"]{_id,caption,desc,meadiaFile,postedBy->,tag,comments[]{comment,postedBy->},likes[]{_key,postedBy->}}`
    );
    dispatch(set_media_items(media));
    console.log(media);
    return media;
  };

  useEffect(() => {
    if (!media_Items?.length) {
      getPostedMeadia();
    }
    if (!user.email) {
      dispatch(
        setUser({
          ...user,
          name: session?.user?.name,
          email: session?.user?.email,
        })
      );
    }
  }, [session]);
  console.log(user);
  return (
    <div className={style.main}>
      {/* <div className="w-[15%] h-screen bg-slate-600"></div> */}
      <div className={style.secondDiv}>
        {media_Items.map((item, i) => {
          const { meadiaFile, postedBy } = item;
          // const { name: user } = postedBy;
          return (
            <div
              key={i}
              className={style.itemsOuterDiv}
            >
              <div
                className={style.itemsInnerDiv}
              >
                <Media meadiaFile={meadiaFile} profileView={false} />
                <span className=" absolute top-1 right-1 px-1 flex flex-col items-center bg-[#ffffff63] rounded-xl">
                  <LikesButton meadia_item={item} />
                  <p>{item.likes?item.likes.length:0}</p>
                </span>
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
