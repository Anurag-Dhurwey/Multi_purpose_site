import React, { useState } from "react";
import { BiSolidCommentDetail } from "react-icons/bi";
import { BsInfoSquareFill } from "react-icons/bs";
import { MdOutlineClose } from "react-icons/md";
import TitleDesc from "./miniComps/TitleDesc";
import CommentBox from "./miniComps/CommentBox";
const MobileViewMetaData = ({ meadia_item, user }) => {
  const { caption, desc, comments, _id } = meadia_item;
  const [cmtView, setCmtView] = useState(false);
  const [descView, setDescView] = useState(false);


  return (
    <div className=" relative min-[430px]:hidden">
      <span className="flex gap-x-4 justify-center items-center pt-1 pr-1">
        <button
          onClick={() => {
            setDescView(true);
          }}
        >
          <BsInfoSquareFill
            style={{
              fontSize: "large",
              fontWeight: "600",
              color: "white",
            }}
          />
        </button>
        <button
          onClick={() => {
            setCmtView(true);
          }}
        >
          <BiSolidCommentDetail
            style={{
              fontSize: "x-large",
              fontWeight: "600",
              color: "white",
            }}
          />
        </button>
      </span>
      {cmtView || descView ? (
        <div className="w-[80vw] h-[395px] overflow-hidden absolute top-0 right-0">
          <span className=" absolute top-0 right-0 p-1">
            <button
              onClick={() => {
                setDescView(false), setCmtView(false);
              }}
            >
              <MdOutlineClose
                style={{
                  fontSize: "large",
                  fontWeight: "600",
                  color: "black",
                }}
              />
            </button>
          </span>
          {descView && (
            <TitleDesc
              useStates={{ cmtView, descView, setCmtView, setDescView }}
              user={user}
              caption={caption}
              desc={desc}
            />
          )}
          {cmtView && (
            <CommentBox
              useStates={{ cmtView, descView, setCmtView, setDescView }}
              meadia_item={meadia_item}
            />
          )}
        </div>
      ) : null}
    </div>
  );
};

export default MobileViewMetaData;
