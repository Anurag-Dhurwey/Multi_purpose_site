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
  if (
    !admin._id &&
    session.user?.name &&
    session.user?.email &&
    session.user?.image
  ) {
    try {
      const res: Array<{ _id: string; connections: connections }> =
        await client.fetch(
          `*[_type=="user" && email=="${session?.user?.email}"]{_id,connections}`
        );
      dispatch(
        set_Admin({
          ...admin,
          _id: res[0]._id,
          name: session?.user?.name,
          email: session?.user?.email,
          connections: res[0].connections,
          image: session?.user?.image,
        })
      );
      return {
        ...admin,
        _id: res[0]._id,
        name: session?.user?.name,
        email: session?.user?.email,
        connections: res[0].connections,
        image: session?.user?.image,
      };
    } catch (error) {
      console.error(error);
      messageApi?.error(`internal server error `);
    }
  } else {
    return admin;
  }
};
