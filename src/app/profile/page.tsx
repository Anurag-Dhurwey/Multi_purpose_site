"use client";
import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import { client } from "@/lib/sanityClient";
import {
  setUser,
  set_my_uploads,
  set_media_items,
} from "@/redux_toolkit/features/indexSlice";
import { useAppDispatch, useAppSelector } from "@/redux_toolkit/hooks";
import Image from "next/image";
import { Media } from "@/components";
const Page = () => {
  const dispatch = useAppDispatch();
  const { data: session } = useSession();

  const getUserInfo = async () => {
    const userData = await client.fetch(
      `*[_type=="user" && email=="${session?.user?.email}"]`
    );
    dispatch(setUser({ ...userData[0] }));
  };

  const getMyUploads = async () => {
    const media = await client.fetch(
      `*[_type == "post" && postedBy->email=="${session?.user?.email}"]{_id,caption,desc,meadiaFile,postedBy->,tag,comments[]{comment,postedBy->}}`
    );
    dispatch(set_my_uploads(media));
    console.log(media)
    return media;
  };

  const user = useAppSelector((state) => state.hooks.user);
  const { name, email, image, _id } = user;
  const media_Items = useAppSelector((state) => state.hooks.media_Items);
  const my_uploads = useAppSelector((state) => state.hooks.my_uploads);

  useEffect(() => {
    if (session) {
      if (!user.email || !user.name || !user.image) {
        getUserInfo();
      }

      if (!my_uploads.length) {
        getMyUploads()
      } 
    } else {
      console.log("session not found login again");
    }
  }, [session, media_Items]);

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
        {user.image && (
          <Image
            src={image}
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
            <div key={i} className={`h-40 w-40 overflow-hidden flex justify-center items-center`}>
              <Media meadiaFile={meadiaFile} profileView={true} key={i} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Page;
