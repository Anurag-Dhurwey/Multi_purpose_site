"use client";
import React, { useEffect } from "react";
import style from "./home.module.css";
import { useAppDispatch, useAppSelector } from "../../redux_toolkit/hooks";
import { RootState } from "@/redux_toolkit/store";
import {
  toggle_dark_mode,
  set_media_items,
  setUser,
} from "../../redux_toolkit/features/indexSlice";
import DesktopMetaData from "../metadataOfMedia/DesktopMetaData";
import { useSession } from "next-auth/react";
import Media from "../media/Media";
import LikesButton from "../metadataOfMedia/miniComps/LikesButton";
import MobileViewMetaData from "../metadataOfMedia/MobileViewMetaData";
import { getMediaItems } from "@/lib/functions/getMediaItems";
import { message } from "antd";

const Home = () => {
  const scrrenMode = useAppSelector((state: RootState) => state.hooks.darkmode);
  const { data: session } = useSession();
  const user = useAppSelector((state) => state.hooks.user);
  const media_Items = useAppSelector(
    (state: RootState) => state.hooks.media_Items
  );
  const dispatch = useAppDispatch();
  const [messageApi, contextHolder]=message.useMessage()

  useEffect(() => {
    if (!media_Items?.length) {
      getMediaItems({dispatch,set_media_items,messageApi});
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
  console.log(media_Items);
  
  return (
    <div className={style.main}>
      {contextHolder}
      {/* <div className="w-[15%] h-screen bg-slate-600"></div> */}
      <div className={style.secondDiv}>
        {media_Items.map((item, i) => {
          const { meadiaFile, postedBy } = item;
          return (
            <div key={i} className={style.itemsOuterDiv}>
              <div className={style.itemsInnerDiv}>
                <Media meadiaFile={meadiaFile} />
                <span className=" absolute top-0 right-0 flex justify-center items-start gap-x-4 rounded-xl">
                  <span className="flex items-center pt-1 gap-x-[2px] min-[430px]:pr-1">
                    <LikesButton meadia_item={item} />
                    <p style={{fontSize:'small'}}>{item.likes ? item.likes.length : 0}</p>
                  </span>
                  <MobileViewMetaData
                    meadia_item={item}
                    user={postedBy.name ? postedBy.name : "Unknown"}
                  />
                </span>
              </div>
              <DesktopMetaData
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
