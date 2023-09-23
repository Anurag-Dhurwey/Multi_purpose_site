
"use client";
import style from './adminProfile.module.css'
import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  set_my_uploads,
} from "@/redux_toolkit/features/indexSlice";
import { useAppDispatch, useAppSelector } from "@/redux_toolkit/hooks";
import { client } from "@/utilities/sanityClient";
import Image from "next/image";
import { Media } from "@/components";
const AdminProfile = () => {
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
 
  function withUseEffect() {
    if (session) {
      if (!my_uploads.length) {
        getMyUploads();
      }
    }
  }

  useEffect(() => {
    withUseEffect()
   }, [session,media_Items]);
 
   if (!session) {
     return null
   }
   console.log(my_uploads);
   return (
    <div className={style.adminProfileParentDiv}>
      <div className={style.adminProfile_firstChildDiv}>
        {admin.image && session.user?.image && (
          <Image
            src={session.user?.image}
            width={1000}
            height={1000}
            alt="profile"
            className={style.adminProfile_firstChildDiv_Image}
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
      <div className={style.adminProfile_secondChildDiv}>
        {my_uploads.map((my_post, i) => {
          const { meadiaFile } = my_post;
          return (
            <div
              key={i}
              className={style.mappedUploads}
            >
              <Media meadiaFile={meadiaFile} profileView={true} key={i} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default AdminProfile
