"use client";
import React, { useState } from "react";
import { user, uploadForm } from "@/typeScript/basics";
import style from "./upload.module.css";
import { Upload } from "@/components";
import { useAppDispatch, useAppSelector } from "@/redux_toolkit/hooks";
import { setUser } from "@/redux_toolkit/features/counterSlice";
import { client } from "@/lib/sanityClient";
import { useSession } from "next-auth/react";

const page = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.hooks.user);
  const { data: session } = useSession();

  const [modal, setModal] = useState<Boolean>(false);
  const [isPosting, setIsPosting] = useState<boolean>(false);
  const [isFileValid, setIsFileValid] = useState<
    Array<{ name: string; message: string }>
  >([]);
  const [form, setForm] = useState<uploadForm>({
    caption: "",
    desc: "",
    filePath: "",
  });
  const [file, setFile] = useState<File>();
  const getUserId = async () => {
    if (!user._id) {
      try {
        const id = await client.fetch(
          `*[_type=="user" && email=="${session?.user?.email}"]{_id}`
        );
        dispatch(setUser({ ...user, _id: id[0]._id }));
      } catch (error) {
        console.error(error);
      }
    }
  };

  const onChageHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    const file = e.target.files;

    if (file) {
      setFile(file[0]);
      setForm({ ...form, filePath: e.target.value });
      checkFileSize(file[0], setIsFileValid);
    }
  };

  const onSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isFileValid.length) {
      setModal(true);
      getUserId();
      uploadingData(file, form, user, setIsPosting);
    } else if (isFileValid.length) {
      alert(isFileValid[0].message);
    }
  };

  return (
    <div className="flex justify-center items-start w-full min-h-screen bg-slate-200">
      <Upload
        visibility={modal}
        setVisibility={setModal}
        isPosting={isPosting}
      />
      <div className="py-6 max-w-[800px] w-full h-full rounded-xl bg-red-200 flex justify-evenly items-center">
        <form
          onSubmit={(e) => onSubmitHandler(e)}
          className={`${style.form} flex flex-col justify-evenly items-center`}
        >
          <div>
            <label htmlFor="caption">Caption</label>
            <input
              required
              minLength={2}
              id="caption"
              name="caption"
              type="text"
              onChange={(e) => onChageHandler(e)}
              value={form.caption}
            />
          </div>

          <div>
            <label htmlFor="desc">Description</label>
            <input
              minLength={10}
              id="desc"
              name="desc"
              type="text"
              onChange={(e) => onChageHandler(e)}
              value={form.desc}
            />
          </div>

          <div>
            <label htmlFor="file">Upload File</label>
            <input
              required
              id="file"
              name="filePath"
              type="file"
              onChange={(e) => onChageHandler(e)}
              value={form.filePath}
            />

            {isFileValid.length > 0 &&
              isFileValid.map((error, i) => {
                return (
                  <p className="text-red-700 text-xs" key={i}>
                    {error.message}
                  </p>
                );
              })}
          </div>

          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 rounded text-white"
          >
            Upload
          </button>
        </form>
      </div>
    </div>
  );
};

export default page;

function checkFileSize(file: File, setIsFileValid: Function) {
  const size: boolean = file.size <= 1000 * 1024*10;
  if (size) {
    setIsFileValid([]);
  } else if (!size) {
    setIsFileValid([
      { name: "size", message: "File size should be less than 10 MB" },
    ]);
  }
}

async function uploadingData(
  file: File,
  form: uploadForm,
  user: user,
  setIsPosting: Function
) {
  try {
    setIsPosting(true);

    const jsonRes = await client.assets.upload("file", file, {
      contentType: file.type,
      filename: file.name,
    });

    if (jsonRes) {
      setIsPosting(false);
      console.log(file);
      console.log(form);
      console.log(jsonRes);
    }
  } catch (error) {
    setIsPosting(false);
    console.error(error);
  }
}
