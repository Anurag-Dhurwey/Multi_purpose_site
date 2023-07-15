import React from "react";
import Image from "next/image";
import Link from "next/link";
import { getFileAsset } from "@sanity/asset-utils";

const Media = ({ meadiaFile, profileView }:{meadiaFile:Array<T>, profileView:boolean}) => {
  const url = getFileAsset(meadiaFile.asset, {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: "production",
  }).url;
  const meadiaType = `${url.substring(url.lastIndexOf(".") + 1)}`;

  return (
    <>
       <Link href={""} className=" self-start">
          {["webm", "mp4", "avi", "ogg"].includes(meadiaType) && (
            <video controls src={url} className=" max-h-[395px] rounded-md" />
          )}

          {["jpeg", "jpg", "png"].includes(meadiaType) && (
            <Image
              src={url}
              alt="post"
              width={1000}
              height={1000}
              className="max-h-[395px] w-auto rounded-md"
            />
          )}
        </Link>
    </>
  );
};

export default Media;
