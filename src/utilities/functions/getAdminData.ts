import { client } from "../sanityClient";
import { MessageInstance } from "antd/es/message/interface";
import {
  session,
  admin,
  _ref,
  usr_and_key_in_array,
} from "@/typeScript/basics";
interface states {
  dispatch: Function;
  set_Admin: (action: admin) => void;
  admin: admin;
  session: session;
  messageApi?: MessageInstance;
}

export const getAdminData = async ({
  dispatch,
  set_Admin,
  admin,
  session,
  messageApi,
}: states) => {
  if (session?.user?.email && session?.user?.name && session?.user?.image) {
    if (!admin?._id) {
      try {
        const res: Array<resType> = await client.fetch(
          `*[(_type=="user" && email=="${session.user.email}")]{_type,_id,bio,desc,link,image}`
        );
        const user = res[0];
        const conRes: conType[] = await client.fetch(
          `*[(_type=="connections" && user._ref=="${user._id}")]{user,_id,requests_got[]{_key,user->{_id,name,email,image}},requests_sent[]{_key,user->{_id,name,email,image}},connected[]{_key,user->{_id,name,email,image}}}`
        );
        const connections = conRes[0];
        console.log({ user, connections });
        if (user) {
          const { _id, bio, desc, link } = user;
          const obj={
            _id: _id,
            name: session.user.name,
            email: session.user.email,
            connections: {
              _id: connections?._id,
              connected: connections?.connected
                ? [...connections?.connected]
                : [],
              requests_got: connections?.requests_got
                ? [...connections?.requests_got]
                : [],
              requests_sent: connections?.requests_sent
                ? [...connections.requests_sent]
                : [],
            },
            image: user.image ? user.image : session.user.image,
            bio: bio ? bio : undefined,
            desc: desc ? desc : undefined,
            link: link ? link : undefined,
          }
          dispatch(
            set_Admin(obj)
          );
          return obj
        }
      } catch (error) {
        console.error(error);
        messageApi?.error(`internal server error `);
      }
    } else {
      return admin;
    }
  } else {
    console.log("can not find user on sessions");
  }
};

type resType = {
  _id: string;
  bio?: string;
  desc?: string;
  link?: string;
  image?: string;
  _type: string;
};

type conType = {
  _id: string;
  connected?: usr_and_key_in_array[];
  requests_got?: usr_and_key_in_array[];
  requests_sent?: usr_and_key_in_array[];
};
