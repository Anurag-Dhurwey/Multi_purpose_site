import io from "socket.io-client";
import { getUserId } from "./functions/getUserId";
import { socketIoConnectionType } from "@/typeScript/basics";


export async function socketIoConnection({
  session,
  dispatch,
  user,
  setUser,
  set_onLineUsers,
}: socketIoConnectionType) {

    const userWithId = await getUserId({ dispatch, user, setUser, session });

    const socket = io(`${process.env.NEXT_PUBLIC_SOCKET_IO_SERVER_URL}`);
    socket.emit("onHnadshake", { user: userWithId });

    socket.on("allOnlineUsers", (onLineUsers) => {
      dispatch(set_onLineUsers(onLineUsers));
      console.log("allOnlineUsertest");
    });

    socket.on("disconnect", () => {
      console.log("connection lost");
    });

}
