import { suggestedDataPayloadType } from "@/redux_toolkit/features/indexSlice";
import { client } from "../sanityClient";
import {
  admin,
  session,
  suggestedData,
  users
} from "@/typeScript/basics";
import { MessageInstance } from "antd/es/message/interface";

type argType = {
  admin: admin;
  session: session;
  suggestedData: suggestedData;
  dispatch: Function;
  set_suggestedData: (payload: suggestedDataPayloadType) => void;
  message: MessageInstance;
};

async function getSuggestedUsers({
  session,
  admin,
  suggestedData,
  dispatch,
  set_suggestedData,
  message,
}: argType) {
  if (!suggestedData.users.length && session?.user && admin) {
    try {
      const resArr: Array<resType> = await client.fetch(
        `*[(_type=="user" && email != "${session.user.email}")  ]{_type,_id,name,image,email}`
      );
      dispatch(set_suggestedData({ _type: "users", data: resArr }));

      return resArr;
    } catch (error) {
      console.error(error);
      message.error("something went wrong");
    }
  }
}

export { getSuggestedUsers };


interface resType {
  _type: string;
  _id: string;
  email: string;
  name: string;
  image?: string;
}
