"use client";
import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import { client } from "@/lib/sanityClient";
import { setUser, set_my_uploads } from "@/redux_toolkit/features/counterSlice";
import { useDispatch } from "react-redux";
import { useAppDispatch, useAppSelector } from "@/redux_toolkit/hooks";
import Image from "next/image";
const page = () => {
  const dispatch = useAppDispatch();
  const { data: session } = useSession();

  const getUserInfo = async () => {
    const userData = await client.fetch(
      `*[_type=="user" && email=="${session?.user?.email}"]`
    );
    dispatch(setUser({ ...userData[0] }));
  };

  const user = useAppSelector((state) => state.hooks.user);
  const { name, email, image, _id } = user;
  const all_Media_content = useAppSelector((state) => state.hooks.media_Items);
  const my_uploads = useAppSelector((state) => state.hooks.my_uploads);

  useEffect(() => {
    if (session) {
      if (!user.email || !user.name || !user.image) {
        getUserInfo();
      }

      if (!my_uploads.length) {
        dispatch(set_my_uploads({all_posts:all_Media_content,email}));
      }
    } else {
      alert("session not found login again");
    }
  }, [session]);

  if (!session) {
    return (
      <>
        <div>
          <h3>Session not found</h3>
        </div>
      </>
    );
  }
  console.log(my_uploads)

  return (
    <div className="w-full flex justify-center items-start">
      <div className="flex justify-between items-center">
        {user.image && (
          <Image
            src={image}
            width={1000}
            height={1000}
            alt="profile"
            className="w-[150px] h-[150px] rounded-full overflow-hidden"
          />
        )}
        <div className="flex-1">
          <h4>
            Name : <span>{name}</span>
          </h4>
          <h4>
            Email : <span>{email}</span>
          </h4>
        </div>
      </div>
    </div>
  );
};

export default page;
