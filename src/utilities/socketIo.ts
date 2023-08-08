import io from "socket.io-client";
import { getAdminData } from "./functions/getAdminData";
import { socketIoConnectionType } from "@/typeScript/basics";


export async function socketIoConnection({
  session,
  dispatch,
  admin,
  set_Admin,
  set_onLineUsers,
}: socketIoConnectionType) {

    const admin_with_id = await getAdminData({ dispatch, admin, set_Admin, session });

    const socket = io(`${process.env.NEXT_PUBLIC_SOCKET_IO_SERVER_URL}`);
    socket.emit("onHnadshake", { user: admin_with_id });

    socket.on("allOnlineUsers", (onLineUsers) => {
      dispatch(set_onLineUsers(onLineUsers));
      console.log("allOnlineUsertest");
    });

    socket.on("disconnect", () => {
      console.log("connection lost");
    });

}
