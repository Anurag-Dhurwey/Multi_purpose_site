"use client";
import { set_media_items } from "@/redux_toolkit/features/indexSlice";
import { useAppDispatch, useAppSelector } from "@/redux_toolkit/hooks";
import { uploadForm } from "@/typeScript/basics";
import { SanityAssetDocument } from "next-sanity";
import React from "react";
import style from "./upload.module.css";
import { stageType } from "@/app/upload/page";
const Upload = ({
  form,
  uploadedFileRes,
  visibility,
  setVisibility,
  setIsPosting,
  setOnSuccess,
  isPosting,
  onSuccess,
  stage,
  setStage,
}: propType) => {
  const dispatch = useAppDispatch();
  const admin = useAppSelector((state) => state.hooks.admin);
  const meadia_items = useAppSelector((state) => state.hooks.media_Items);

  async function publish(uploadedFileRes: SanityAssetDocument) {
    if (
      !isPosting.asset &&
      !isPosting.post &&
      onSuccess.asset &&
      !onSuccess.post
    ) {
      setIsPosting({ asset: false, post: true });
      setStage({ stageOne: "completed", stageTwo: "start" });
      try {
        const postedData = await fetch("/api/upload/post", {
          method: "POST",
          body: JSON.stringify({ uploadedFileRes, user: admin, form }),
        });
        const jsonData = await postedData.json();
        if (jsonData) {
          const { res, createdPost } = jsonData;
          console.log(jsonData);
          dispatch(set_media_items([{ ...createdPost }, ...meadia_items]));
          setOnSuccess((pre) => {
            return { asset: pre.asset, post: true };
          });
          setStage({ stageOne: "completed", stageTwo: "completed" });
        }
      } catch (error) {
        setOnSuccess((pre) => {
          return { asset: pre.asset, post: false };
        });
        setStage({ stageOne: "completed", stageTwo: "failed" });
        console.error(error);
      } finally {
        setIsPosting({ asset: false, post: false });
      }
    }
  }

  function saveAsDraft() {
    const isConfirmed = confirm(
      "Only asset will be saved (title and description will be deleted)"
    );
    if (isConfirmed) {
      setVisibility(false);
    }
  }

  return (
    <div
      style={{ display: visibility ? "inline-block" : "none" }}
      className={`${style.uploadModalMain}`}
    >
      <div className={style.uploadModalMainSecondDiv}>
        {isPosting.asset ? (
          <span>
            <h4 className={style.secondDivSpanH4}>Uploading</h4>
          </span>
        ) : (
          <span>
            {onSuccess.asset == null ? (
              ""
            ) : (
              <h3
                className={style.secondDivSpan2H3}
                style={{
                  color: onSuccess.asset ? "#008000be" : "#ff000094",
                }}
              >
                {onSuccess.asset
                  ? "File uploaded Successfully"
                  : "failed something went wrong"}
              </h3>
            )}
          </span>
        )}
        {isPosting.post ? (
          <span>
            <h4 className={style.secondDivSpanH4}>Publishing</h4>
          </span>
        ) : (
          <span>
            {onSuccess.post == null ? (
              ""
            ) : (
              <h3
                className={style.secondDivSpan2H3}
                style={{
                  color: onSuccess.post ? "#008000be" : "#ff000094",
                }}
              >
                {onSuccess.post
                  ? "Post published Successfully"
                  : "failed something went wrong"}
              </h3>
            )}
          </span>
        )}

        {stage.stageOne && stage.stageTwo == null && (
          <>
            {stage.stageOne == "start" && (
              <button
                onClick={() => setVisibility(false)}
                className={style.secondDivButton}
              >
                CANCEL
              </button>
            )}

            {stage.stageOne == "failed" && (
              <button
                onClick={() => {
                  console.log("try Again");
                }}
              >
                Try again
              </button>
            )}
            {stage.stageOne == "completed" && (
              <>
                <button
                  onClick={() => saveAsDraft()}
                  className={style.secondDivButton}
                >
                  Save as draft
                </button>
                <button
                  onClick={() =>
                    uploadedFileRes
                      ? publish(uploadedFileRes)
                      : alert("something went wrong")
                  }
                  className={style.secondDivButton}
                >
                  Publish
                </button>
              </>
            )}
          </>
        )}

        {stage.stageOne == "completed" && stage.stageTwo && (
          <>
            {stage.stageTwo == "start" && (
              <button onClick={() => {}} className={style.secondDivButton}>
                CANCEL
              </button>
            )}

            {stage.stageTwo == "failed" && (
              <button
                onClick={() => {
                  uploadedFileRes
                    ? publish(uploadedFileRes)
                    : alert("something went wrong");
                }}
              >
                Try again
              </button>
            )}

            {stage.stageTwo == "completed" && (
              <>
                <button onClick={() => {}} className={style.secondDivButton}>
                  Publish new post
                </button>
                <button
                  onClick={() => {
                    alert("got to home");
                  }}
                  className={style.secondDivButton}
                >
                  Go to home
                </button>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Upload;

interface propType {
  form: uploadForm;
  uploadedFileRes?: SanityAssetDocument;
  visibility: Boolean;
  setVisibility: React.Dispatch<React.SetStateAction<Boolean>>;
  setIsPosting: React.Dispatch<
    React.SetStateAction<{
      asset: boolean;
      post: boolean;
    }>
  >;
  setOnSuccess: React.Dispatch<
    React.SetStateAction<{
      asset: boolean | null;
      post: boolean | null;
    }>
  >;
  isPosting: { asset: boolean; post: boolean };
  onSuccess: { asset: boolean | null; post: boolean | null };
  stage: stageType;
  setStage: React.Dispatch<React.SetStateAction<stageType>>;
}
