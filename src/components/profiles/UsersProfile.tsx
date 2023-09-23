import { profileSlugObjType } from '@/typeScript/basics'
import style from './userProfile.module.css'
import React from 'react'
import Image from 'next/image'
const UsersProfile = ({user}:{user:profileSlugObjType}) => {
  const {_id,name,email,image,_key}=user
  return (
    <div className={style.userProfileParentDiv}>
      <div className={style.userProfile_firstChildDiv}>
        {image && (
          <Image
            src={image}
            width={1000}
            height={1000}
            alt="profile"
            className={style.userProfile_firstChildDiv_Image}
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
      {/* <div className="w-full flex flex-wrap justify-center items-center gap-x-4 gap-y-2">
        {my_uploads.map((my_post, i) => {
          const { meadiaFile } = my_post;
          return (
            <div
              key={i}
              className={`h-40 w-40 overflow-hidden flex justify-center items-center`}
            >
              <Media meadiaFile={meadiaFile} profileView={true} key={i} />
            </div>
          );
        })}
      </div> */}
    </div>
  )
}

export default UsersProfile
