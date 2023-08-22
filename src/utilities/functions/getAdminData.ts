import { client } from "../sanityClient";
import { MessageInstance } from "antd/es/message/interface";
import {
  connections,
  session,
  sessionUser,
  admin,
  usersMinData,
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
          `*[(_type=="user" && email=="${session.user.email}")||(_type=="connections" && email=="${session.user.email}")]{_type,userId,_id,bio,desc,link,requests_got,requests_sent,connected}`
        );
        const connections: conType = res.find(
          (item) => item._type == "connections"
        );
        const user: usrType = res.find((item) => item._type == "user");
        if (user) {
          const { _id, bio, desc, link } = user;
          dispatch(
            set_Admin({
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
                  ? [...connections?.requests_sent]
                  : [],
              },
              image: session.user.image,
              bio: bio ? bio : undefined,
              desc: desc ? desc : undefined,
              link: link ? link : undefined,
            })
          );
          return {
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
                ? [...connections?.requests_sent]
                : [],
            },
            image: session.user.image,
            bio: bio ? bio : undefined,
            desc: desc ? desc : undefined,
            link: link ? link : undefined,
          };
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
  userId?: string;
  connected?: Array<usersMinData>;
  requests_got?: Array<usersMinData>;
  requests_sent?: Array<usersMinData>;
  _type: string;
};

type conType =
  | {
      _id: string;
      connected?: Array<usersMinData>;
      requests_got?: Array<usersMinData>;
      requests_sent?: Array<usersMinData>;
    }
  | undefined;

type usrType =
  | {
      _id: string;
      bio?: string;
      desc?: string;
      link?: string;
    }
  | undefined;
