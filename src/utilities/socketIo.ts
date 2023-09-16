import io from "socket.io-client";
import { getAdminData } from "./functions/getAdminData";
import {
  admin,
  chat_messages,
  session,
  socketIoConnectionType,
} from "@/typeScript/basics";
import {
  onlineUsers,
  set_Admins_Connections,
} from "@/redux_toolkit/features/indexSlice";
import { Socket } from "socket.io-client";

let socket: Socket | undefined;

export const getSocket = async ({
  session,
  admin,
  set_Admin,
  dispatch,
}: getSocketArgType) => {
  const admin_with_id = await getAdminData({
    dispatch,
    admin,
    set_Admin,
    session,
  });
  if (!session) {
    return { socket: undefined, admin_with_id: undefined };
  }
  if (!socket) {
    socket = io(`${process.env.NEXT_PUBLIC_SOCKET_IO_SERVER_URL}`);
    socket.emit("onHnadshake", {
      user: {
        ...admin_with_id,
        connections: { connected: admin_with_id?.connections?.connected },
      },
    });
    return { socket, admin_with_id };
  } else {
    return { socket, admin_with_id };
  }
};
// these below variables are to prevent socket_io events to running multiple times
let stop_to_run_OCRTU: string | undefined;
let stop_to_run_chat_message: Date | undefined;

export async function socketIoConnection({
  session,
  dispatch,
  admin,
  set_Admin,
  set_onLineUsers,
  message,
}: socketIoConnectionType) {
  if (session) {
    const { socket, admin_with_id } = await getSocket({
      session,
      dispatch,
      set_Admin,
      admin,
    });
    if (socket) {
      socket.on("allOnlineUsers", (onLineUsers: onlineUsers[]) => {
        dispatch(set_onLineUsers(onLineUsers));
        console.log({ str: "allOnlineUsertest", onLineUsers });
      });

      socket.on("ConnectionRequestToUser", (msg: CRTU) => {
        if (
          stop_to_run_OCRTU != msg.user._id &&
          admin_with_id?.connections &&
          msg.user
        ) {
          console.log(stop_to_run_OCRTU, msg.user._id);

          const { user, _key } = msg;
          dispatch(
            set_Admins_Connections({
              command: "request",
              data: {
                user: {
                  _id: user._id,
                  name: user.name,
                  email: user.email,
                  image: user.image,
                },
                _key,
              },
              current: admin_with_id.connections,
            })
          );
          message.info(`${msg.user.name} wants to connect with you.`);
          stop_to_run_OCRTU = msg.user._id;
        } else if (!admin_with_id?.connections && msg.user) {
          console.log("something went wrong");
        } else {
          console.log("same");
        }
      });

      socket.on("chat_message", (msg: importedChat_msg) => {
        if (msg.date_time != stop_to_run_chat_message) {
          message.info(`${msg.message}`);
          stop_to_run_chat_message = msg.date_time;
        } else {
          console.log("same");
        }
      });

      socket.on("disconnect", () => {
        console.log("connection lost");
      });
    }
  }
}

interface ConnectionRequestToUserType {
  socketId: string;
  _id: string;
  name: string;
  email: string;
  image: string;
}

type CRTU = {
  user: ConnectionRequestToUserType;
  _key: string;
};

export interface importedChat_msg extends chat_messages {
  receiver_socketId: string;
}

interface getSocketArgType {
  session: session;
  admin: admin;
  set_Admin: (action: admin) => void;
  dispatch: Function;
}
