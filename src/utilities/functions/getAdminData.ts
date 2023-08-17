import { client } from "../sanityClient";
import { MessageInstance } from "antd/es/message/interface";
import { connections, session, sessionUser, admin } from "@/typeScript/basics";
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
          `*[_type=="user" && email=="${session.user.email}"]{_id,bio,desc,link,connections}`
        );
        const {connections,bio,desc,link,_id} = res[0];
        dispatch(
          set_Admin({
            _id: _id,
            name: session.user.name,
            email: session.user.email,
            connections: {
              connected: connections?.connected ? [...connections.connected] : [],
              requests_got: connections?.requests_got ? [...connections.requests_got] : [],
              requests_sent: connections?.requests_sent ? [...connections.requests_sent] : [],
            },
            image: session.user.image,
            bio: bio?bio:undefined,
            desc: desc?desc:undefined,
            link: link?link:undefined,
          })
        );
        return {
          _id: res[0]._id,
          name: session?.user?.name,
          email: session?.user?.email,
          connections: {
            connected: connections?.connected ? [...connections.connected] : [],
            requests_got: connections?.requests_got ? [...connections.requests_got] : [],
            requests_sent: connections?.requests_sent ? [...connections.requests_sent] : [],
          },
          image: session?.user?.image,
          bio: bio?bio:null,
          desc: desc?desc:null,
          link: link?link:null,
        };
      } catch (error) {
        console.error(error);
        messageApi?.error(`internal server error `);
      }
    } else {
      return admin;
    }
  }else{
    console.log('can not find user on sessions')
  }
};

type resType = {
  _id: string;
  bio: string | null;
  desc: string | null;
  link: string | null;
  connections: connections | null;
};
