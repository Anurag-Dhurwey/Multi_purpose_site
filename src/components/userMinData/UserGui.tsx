import { profileSlugObjType } from "@/typeScript/basics";
import React, { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { isUserOnline } from "../chat/miniComps/OnlineOffline";
import { useAppSelector } from "@/redux_toolkit/hooks";


interface propType {
  user: profileSlugObjType;
  children?: ReactNode;
  disableProfineNav?: boolean;
}

const UserGui = ({ children, user, disableProfineNav }: propType) => {
  const { _id, _key, image, name, email } = user;
  const onLineUsers = useAppSelector((state) => state.hooks.onLineUsers);
  const slug = encodeURIComponent(JSON.stringify({ ...user }));
  const isOnline =
    _id && name && email
      ? isUserOnline({ _id, name, email, image }, onLineUsers)
      : false;
  return (
    <span className="py-2 px-1 rounded-xl  overflow-hidden flex flex-col justify-evenly items-center border-2 border-blue-500">
      {disableProfineNav ? (
        <ImageComp image={image} />
      ) : (
        <Link href={`/profile/${slug}`}>
          <ImageComp image={image} />
        </Link>
      )}

      <p style={{ color: isOnline ? "green" : "black" }} className="text-xs">
        {name}
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
          className=" max-sm:h-16 max-sm:w-16 rounded-full overflow-hidden"
        />
      ) : null}
    </>
  );
};
