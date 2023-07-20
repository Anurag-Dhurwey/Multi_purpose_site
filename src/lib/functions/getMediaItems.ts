import { client } from "../sanityClient";
interface states {
  dispatch: Function;
  set_media_items: Function;
}
export const getMediaItems = async ({ dispatch, set_media_items }: states) => {
  const media = await client.fetch(
    `*[_type == "post"]{_id,caption,desc,meadiaFile,postedBy->,tag,comments[]{comment,postedBy->},likes[]{_key,postedBy->}}`
  );
  dispatch(set_media_items(media));
  console.log(media);
  return media;
};
