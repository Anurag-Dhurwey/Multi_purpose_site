"use client";
import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  set_Admin,
  set_my_uploads,
  set_media_items,
  set_onLineUsers,
} from "@/redux_toolkit/features/indexSlice";
import { useAppDispatch, useAppSelector } from "@/redux_toolkit/hooks";
import { client } from "@/utilities/sanityClient";
import { socketIoConnection } from "@/utilities/socketIo";
import Image from "next/image";
import { Media } from "@/components";
import { message } from "antd";
const Page = () => {
  const dispatch = useAppDispatch();
  const { data: session } = useSession();


  const getMyUploads = async () => {
    const media = await client.fetch(
      `*[_type == "post" && postedBy->email=="${session?.user?.email}"]{_id,caption,desc,meadiaFile,postedBy->,tag,comments[]{comment,postedBy->}}`
    );
    dispatch(set_my_uploads(media));
    console.log(media);
    return media;
  };

  const admin = useAppSelector((state) => state.hooks.admin);
  const { name, email, image, _id } = admin;
  const media_Items = useAppSelector((state) => state.hooks.media_Items);
  const my_uploads = useAppSelector((state) => state.hooks.my_uploads);


  useEffect(() => {
    if (session) {
      socketIoConnection({
        session,
        set_onLineUsers,
        set_Admin,
        dispatch,
        admin,
        message:message
      });
      if (!my_uploads.length) {
        getMyUploads();
      }
    }
  }, [session,media_Items]);

  if (!session) {
    return (
      <>
        <div>
          <h3>Session not found</h3>
        </div>
      </>
    );
  }
  console.log(my_uploads);

  return (
    <div className="w-full flex flex-col justify-center items-start">
      <div className="flex justify-between items-center gap-x-5">
        {admin.image && session.user?.image && (
          <Image
            src={session.user?.image}
            width={1000}
            height={1000}
            alt="profile"
            className="w-[100px] h-[100px] rounded-full overflow-hidden"
          />
        )}
        <div className="">
          <h4>
            Name : <span>{name}</span>
          </h4>
          <h4>
            Email : <span>{email}</span>
          </h4>
        </div>
      </div>
      <div className="w-full flex flex-wrap justify-center items-center gap-x-4 gap-y-2">
        {my_uploads.map((my_post, i) => {
          const { meadiaFile } = my_post;
          return (
            <div
              key={i}
              className={`h-40 w-40 overflow-hidden flex justify-center items-center`}
            >
              <Media meadiaFile={meadiaFile} profileView={true} key={i} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Page;
