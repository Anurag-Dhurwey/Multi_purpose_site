import { media_Item } from "@/typeScript/basics";
import { client } from "../sanityClient";
interface states {
  dispatch: Function;
  set_media_items: Function;
}
export const getMediaItems = async ({ dispatch, set_media_items }: states) => {
  const media:Array<media_Item> = await client.fetch(
    `*[_type == "post"]{_id,_createdAt,_updatedAt,caption,desc,meadiaFile,postedBy->,tag,comments[]{comment,postedBy->},likes[]{_key,postedBy->}}`
  );
  dispatch(set_media_items(media));
  console.log(media);
  return media;
};
