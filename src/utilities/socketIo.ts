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

  const admin_with_id = await getAdminData({
    dispatch,
    admin,
    set_Admin,
    session,
  });
  socket.emit("onHnadshake", { user: admin_with_id });

  socket.on("allOnlineUsers", (onLineUsers) => {
    dispatch(set_onLineUsers(onLineUsers));
    console.log({str:"allOnlineUsertest",onLineUsers});
  });

  // this below variable is to prevent socket_io event "ConnectionRequestToUser" to running multiple time
  let oneTimeRunner: string = "initial";

  socket.on("ConnectionRequestToUser", (msg) => {

    if (oneTimeRunner != msg.user._id) {
      console.log(oneTimeRunner, msg.user._id);
      oneTimeRunner = msg.user._id;
      if (admin_with_id?.connections && msg.user) {
        const {user,_key}=msg
        dispatch(
          set_Admins_Connections({
            command: "request",
            data: {userId:user._id,name:user.name,mail:user.email,img:user.image,_key},
            current: admin_with_id.connections,
          })
        );
        message.info(`${msg.user.name} wants to connect with you.`);
      } else {
        console.log("something went wrong");
      }
    }else{console.log('same')}

  });
  socket.on("disconnect", () => {
    console.log("connection lost");
  });
}
