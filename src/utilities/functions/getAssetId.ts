import { set_AssetId } from "@/redux_toolkit/features/indexSlice";
import { client } from "../sanityClient";

interface argType {
  email: string;
  userId: string;
  dispatch: Function;
}

export async function getAssetId({ email, userId, dispatch }: argType) {
  try {
    const id: { _id: string }[] = await client.fetch(
      `*[_type=="asset" && email=="${email}"]{_id}`
    );
    if (id[0]) {
      dispatch(set_AssetId(id[0]._id));
      return id[0]._id;
    }
  } catch (error) {
    console.error(error)
  }
}
