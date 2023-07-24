import React from "react";
import { MdExpandMore, MdExpandLess } from "react-icons/md";
import style from "./commentBox.module.css";
import { useSession } from "next-auth/react";
import CommentForm from "./CommentForm";
import { media_Item } from "@/typeScript/basics";
interface Iprops {
  useStates: {
    cmtView: boolean;
    descView: boolean;
    setCmtView: Function;
    setDescView: Function;
  };
  meadia_item: media_Item;
}
const CommentBox = ({ useStates, meadia_item }: Iprops) => {
  const { cmtView, descView, setCmtView, setDescView } = useStates;
  const { caption, desc, comments, _id } = meadia_item;
  const { data: session } = useSession();
  return (
    <>
      {!descView && (
        <div className={`${style.commentBox} ${cmtView ? "h-full" : ""} `}>
          <div className={`${style.commentBoxInnerDiv}  `}>
            {comments?.map((cmnt, i) => {
              const { comment, name } = cmnt;
              return (
                <div
                  key={comment + i}
                  className={`${style.comment}`}
                  style={{ display: cmtView ? " " : i == 0 ? "" : "none" }}
                >
                  <span className="">
                    <button className=""></button>
                    <p>
                      {name ? name : 'unknown'}
                    </p>
                  </span>
                  <p>{cmtView ? comment : comment.slice(0, 50) + "....."}</p>
                </div>
              );
            })}
            {!comments && (
              <p className="w-full text-center font-medium ">
                No comments yet!
              </p>
            )}
          </div>

          <span
            className={`${style.commentBoxSpan} ${cmtView ? "pt-[80%]" : ""} `}
          >
            {cmtView && session && (
              <div className="w-full ">
                <CommentForm meadia_item={meadia_item} />
              </div>
            )}
            <button
              className=""
              onClick={() => {
                setCmtView(!cmtView);
                setDescView(false);
              }}
            >
              {cmtView ? (
                <MdExpandLess className="p-0" />
              ) : (
                <MdExpandMore className="p-0" />
              )}
            </button>
          </span>
        </div>
      )}
    </>
  );
};

export default CommentBox;
