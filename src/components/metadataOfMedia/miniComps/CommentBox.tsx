'use client'
import React,{useState} from "react";
import { MdExpandMore, MdExpandLess } from "react-icons/md";
import { RiDeleteBinLine } from "react-icons/ri";
import style from "./commentBox.module.css";
import { useSession } from "next-auth/react";
import CommentForm from "./CommentForm";
import { media_Item } from "@/typeScript/basics";
import { client } from "@/utilities/sanityClient";
import { set_media_items } from "@/redux_toolkit/features/indexSlice";
import { useAppDispatch, useAppSelector } from "@/redux_toolkit/hooks";
import { message } from "antd";

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
  const dispatch = useAppDispatch();
  const media_Items = useAppSelector((state) => state.hooks.media_Items);
const [api,setApi]=useState<boolean>(false)
  const OnDeleteHandle = async (_key: string) => {
    setApi(true)
    try {
      const res = await client
        .patch(_id)
        .unset(["comments[0]", `comments[_key=="${_key}"]`])
        .commit();
      if (res) {
        const filteredComments = comments?.filter((cmt) => {
          return cmt._key !== _key;
        });
        if(filteredComments){
          const updatedItems = media_Items.map((item) => {
            if (item._id == _id) {
              return { ...item, comments: [...filteredComments] };
            } else {
              return item;
            }
          });
          dispatch(set_media_items([...updatedItems]));
        }
      }
    } catch (error) {
      message.error("internal server error");
      console.error("unable to delete");
    }finally{
      setApi(false)
    }
  };

  return (
    <>
      {!descView && (
        <div className={`${style.commentBox} ${cmtView ? "h-full" : ""} `}>
          <div className={`${style.commentBoxInnerDiv}  `}>
            {comments?.map((cmnt, i) => {
              const { comment, name, _key, email } = cmnt;
              return (
                <div
                  key={comment + i}
                  className={`${style.comment}`}
                  style={{ display: cmtView ? " " : i == 0 ? "" : "none" }}
                >
                  <span className="">
                    <button className={style.Img}></button>
                    <p>{name ? name : "unknown"}</p>
                  
                    {email == session?.user?.email && (
                      <button onClick={() => OnDeleteHandle(_key)} disabled={api}>
                        <RiDeleteBinLine />
                      </button>
                    )}
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
            className={`${style.commentBoxSpan} ${cmtView ? "mt-[80%]" : ""} `}
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
