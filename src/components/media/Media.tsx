"use client";
import React, { useState } from "react";
import Image from "next/image";
import { getFileAsset } from "@sanity/asset-utils";
import { meadiaFile } from "@/typeScript/basics";

const Media = ({
  meadiaFile,
  profileView,
}: {
  meadiaFile: meadiaFile;
  profileView?: boolean;
}) => {
  const url = getFileAsset(meadiaFile.asset, {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: "production",
  }).url;
  const meadiaType = `${url.substring(url.lastIndexOf(".") + 1)}`;
  const [imgCover, setImgCover] = useState<boolean>(false);
  return (
    <>
      <span
        className="flex justify-center items-center w-full h-full"
        onClick={() => setImgCover(!imgCover)}
      >
        {["webm", "mp4", "avi", "ogg"].includes(meadiaType) && (
          <video controls src={url} className=" max-h-[395px] rounded-md" />
        )}

        {["jpeg", "jpg", "png"].includes(meadiaType) && (
          <Image
            src={url}
            alt="post"
            width={1000}
            height={1000}
            className={`max-h-[395px] ${
              !imgCover ? " object-cover" : "h-auto w-auto"
            } rounded-md `}
          />
        )}
      </span>
    </>
  );
};

export default Media;
