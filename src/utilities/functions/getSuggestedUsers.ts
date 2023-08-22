import { suggestedDataPayloadType } from "@/redux_toolkit/features/indexSlice";
import { client } from "../sanityClient";
import {
  admin,
  session,
  suggestedData,
  users,
  usersMinData,
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
      const resArr:Array<resType> = await client.fetch(
        `*[(_type=="user") || (_type=="connections" && email=="${session.user.email}") ]{_type,_id,name,image,email,userId,connected}`
      );
      const connections:Array<conType> = resArr.filter((con) => con._type == "connecctions");
      let usersArr:Array<userType> = resArr.filter((usr) => usr._type == "user");
      usersArr = usersArr.map((usr) => {
        const con = connections.find((con) => con.userId == usr._id);
        return {
          ...usr,
          connections: { connected: con?.connected ? con.connected : undefined },
        };
      });
      dispatch(set_suggestedData({ _type: "users", data: usersArr }));

      return usersArr;
    } catch (error) {
      console.error(error);
      message.error("something went wrong");
    }
  }
}

export { getSuggestedUsers };

export interface conType {
  _id?: string;
  userId?: string;
  email?: string;
  connected?: Array<usersMinData>;
}


export interface userType {
    _id: string;
    name: string;
    email: string;
    image?: string;
    connected?: Array<usersMinData>;
  }

  interface resType{
    _type:string;
    _id: string;
  userId?: string;
  email: string;
  name:string;
  image?: string;
  connected?: Array<usersMinData>;
  }