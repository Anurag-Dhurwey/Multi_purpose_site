import io from "socket.io-client";
import { getAdminData } from "./functions/getAdminData";
import { socketIoConnectionType } from "@/typeScript/basics";
import { set_Admins_Connections } from "@/redux_toolkit/features/indexSlice";

export const socket = io(`${process.env.NEXT_PUBLIC_SOCKET_IO_SERVER_URL}`);
export async function socketIoConnection({
  session,
  dispatch,
  admin,
  set_Admin,
  set_onLineUsers,
  message,
}: socketIoConnectionType) {
  console.log("admin");
  console.log(admin);

  const admin_with_id = await getAdminData({
    dispatch,
    admin,
    set_Admin,
    session,
  });
  console.log(admin_with_id);
  // if (socket.disconnected) {
  socket.emit("onHnadshake", { user: admin_with_id });
  // } else if (socket.connected) {
  //   console.log("already connected");
  // }

  socket.on("allOnlineUsers", (onLineUsers) => {
    dispatch(set_onLineUsers(onLineUsers));
    console.log("allOnlineUsertest");
    console.log(onLineUsers);
  });

  socket.on("ConnectionRequestToUser", (msg) => {
    console.log(msg);
    console.log("msg");

    // setTimeout(() => {
      if (admin_with_id?.connections && msg.user ) {
        set_Admins_Connections({
          command: "request",
          data: msg.user,
          current: admin_with_id.connections,
        });
        message.info(`${msg.user.name} wants to connect with you.`);
        console.log(`${msg.user.name} wants to connect with you.`);
      } else {
        console.log("something went wrong");
      }
    // }, 1000);
    console.log("connection request");
  });
  socket.on("disconnect", () => {
    console.log("connection lost");
  });
}
