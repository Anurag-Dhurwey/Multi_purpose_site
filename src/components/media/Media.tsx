"use client";
import React, { useState } from "react";
import Image from "next/image";
import { getFileAsset } from "@sanity/asset-utils";
import { meadiaFile } from "@/typeScript/basics";

export const videoFormates = ["webm", "mp4", "avi", "ogg"];
export const imgFormates = ["jpeg", "jpg", "png", "svg", "gif"];

const Media = ({
  meadiaFile,
  profileView,
}: {
  meadiaFile: meadiaFile;
  profileView?: boolean;
}) => {
  function getFileExtensionFromUrl(url: string) {
    const urlParts = url.split(".");
    if (urlParts.length > 1) {
      return urlParts.pop()?.toLowerCase();
    }
    return null; // No file extension found
  }

  const url = getFileAsset(meadiaFile.asset, {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: "production",
  }).url;
  const meadiaType = getFileExtensionFromUrl(url);
  const [imgCover, setImgCover] = useState<boolean>(false);

  return (
    <>
      <span
        className="flex justify-center items-center w-full h-full"
        onClick={() => setImgCover(!imgCover)}
      >
        {meadiaType ?(
          <>
            {videoFormates.includes(meadiaType) && (
              <video controls src={url} className=" max-h-[395px] rounded-md" />
            )}

            {imgFormates.includes(meadiaType) && (
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
          </>
        ):(
          <> <p>asset not found</p></>
        )}
      </span>
    </>
  );
};

export default Media;
