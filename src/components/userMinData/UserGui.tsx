import { profileSlugObjType } from "@/typeScript/basics";
import React, { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { isUserOnline } from "../chat/miniComps/OnlineOffline";
import { useAppSelector } from "@/redux_toolkit/hooks";
import style from './userGui.module.css'

interface propType {
  user: profileSlugObjType;
  children?: ReactNode;
  disableProfineNav?: boolean;
}

const UserGui = ({ children, user, disableProfineNav }: propType) => {
  const { _id, _key, image, name, email } = user;
  if(!_id&&!name&&!email){
    return null
  }
  const onLineUsers = useAppSelector((state) => state.hooks.onLineUsers);
  const slug = encodeURIComponent(JSON.stringify({ ...user }));
  const isOnline =
    _id && name && email
      ? isUserOnline({ _id, name, email, image }, onLineUsers)
      : false;
  return (
    <span className={style.userguiSpan}>
      {disableProfineNav ? (
        <ImageComp image={image} />
      ) : (
        <Link href={`/profile/${slug}`}>
          <ImageComp image={image} />
        </Link>
      )}

      <p style={{ color: isOnline ? "green" : "black" }} className="text-xs">
        {name?.length && name.length <=10?name:name?.slice(0,9)+'...'}
      </p>
      <>{children}</>
    </span>
  );
};

export default UserGui;

const ImageComp = ({ image }: { image: string | undefined }) => {
  return (
    <>
      {image?.includes("https://") ? (
        <Image
          src={`${image}`}
          height={100}
          width={100}
          alt="image"
          className={style.userGuiImage}
        />
      ) : null}
    </>
  );
};
