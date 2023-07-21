"use client";
import React, { useState } from "react";
import style from "./desktopMetaData.module.css";
import TitleDesc from "./miniComps/TitleDesc";
import CommentBox from "./miniComps/CommentBox";
import { media_Item } from "@/typeScript/basics";
interface Iprops{
  meadia_item:media_Item,user:string
}
const DesktopMetaData = ({ meadia_item, user }:Iprops) => {
  const { caption, desc, comments, _id } = meadia_item;
  const [cmtView, setCmtView] = useState(false);
  const [descView, setDescView] = useState(false);

  return (
    <div className={`${style.main}`}>
      <TitleDesc
        useStates={{ cmtView, descView, setCmtView, setDescView }}
        user={user}
        caption={caption}
        desc={desc}
      />
      <CommentBox
        useStates={{ cmtView, descView, setCmtView, setDescView }}
        meadia_item={meadia_item}
      />
      <div></div>
    </div>
  );
};

export default DesktopMetaData;
