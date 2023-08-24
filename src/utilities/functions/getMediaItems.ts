import { media_Item } from "@/typeScript/basics";
import { client } from "../sanityClient";
import { MessageInstance } from "antd/es/message/interface";
interface states {
  dispatch: Function;
  set_media_items: (payload:Array<media_Item>)=>void;
  messageApi:MessageInstance;
}

export const getMediaItems = async ({ dispatch, set_media_items,messageApi }: states) => {
  try {
    const media:Array<media_Item> = await client.fetch(
      `*[_type == "post"]{_id,_createdAt,_updatedAt,caption,desc,meadiaFile,postedBy->,tag,comments[]{comment,name,email,userId},likes[]{_key,name,email,userId}}`
    );
    dispatch(set_media_items(media));
    console.log(media);
    return media;
  } catch (error) {
    messageApi.error('internal server error')
  }
};
