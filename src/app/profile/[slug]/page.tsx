"use client";
import AdminProfile from "@/components/profiles/AdminProfile";
import UsersProfile from "@/components/profiles/UsersProfile";
import { useAppDispatch, useAppSelector } from "@/redux_toolkit/hooks";
import { min_id_of_usr, profileSlugObjType } from "@/typeScript/basics";
import { socketIoConnection } from "@/utilities/socketIo";
import { message } from "antd";
import { useSession } from "next-auth/react";
import React, { useEffect } from "react";

const Page = ({ params }: { params: { slug: string } }) => {
  const { data: session } = useSession();
  const admin = useAppSelector((state) => state.hooks.admin);
  const dispatch = useAppDispatch();
  const slug = params.slug;
  const data: profileSlugObjType = JSON.parse(decodeURIComponent(slug));

  function withUseEffect() {
    if (session) {
      socketIoConnection({
        session,
        dispatch,
        admin,
        message: message,
      });
    }
  }

  useEffect(() => {
    withUseEffect();
  }, [session]);

  if (!session && !data.email) return null;
  
  return (
    <section>
      {data.email == session?.user?.email ? (
        <AdminProfile />
      ) : (
        <UsersProfile user={data} />
      )}
    </section>
  );
};

export default Page;
