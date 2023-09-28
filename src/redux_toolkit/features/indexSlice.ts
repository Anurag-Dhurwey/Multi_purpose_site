import { createSlice } from "@reduxjs/toolkit";
import {
  media_Item,
  suggestedData,
  admin,
  users,
  connections,
  usr_and_key_in_array,
  min_id_of_usr,
  users_with_old_chats,
  loadedChatMessages,
  chat_messages,
} from "@/typeScript/basics";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface CounterState {
  darkmode: boolean;
  admin: admin;
  media_Items: Array<media_Item>;
  my_uploads: Array<media_Item>;
  onLineUsers: Array<onlineUsers>;
  suggestedData: suggestedData;
  users_with_old_chats: users_with_old_chats[] | undefined;
  loadedChatMessages: loadedChatMessages[];
}
const initialState: CounterState = {
  darkmode: false,
  admin: {
    name: "",
    _id: "",
    image: "",
    email: "",
    desc: "",
    bio: "",
    link: "",
    connections: {
      _id: "",
      connected: [],
      requests_got: [],
      requests_sent: [],
    },
    assetId: "",
  },
  media_Items: [],
  my_uploads: [],
  onLineUsers: [],
  suggestedData: { users: [] },
  users_with_old_chats: [],
  loadedChatMessages: [],
};

export const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    toggle_dark_mode: (state) => {
      state.darkmode = !state.darkmode;
    },
    set_Admin: (state, action: PayloadAction<admin>) => {
      state.admin = action.payload;
    },
    set_ConnectionsId: (state, action: PayloadAction<string>) => {
      if (state.admin.connections && !state.admin.connections._id) {
        state.admin.connections._id = action.payload;
      }
    },
    set_AssetId: (state, action: PayloadAction<string>) => {
      state.admin.assetId = action.payload;
    },
    set_Admins_Connections: (
      state,
      action: PayloadAction<setAdminConnectionsPayloadType>
    ) => {
      const { command, data, current } = action.payload;
      if (state.admin) {
        if (command == "accept") {
          console.log("entered in Accept hook");
          const updatedRequests = current.requests_got?.filter((user) => {
            return user.user._id !== data.user._id;
          });
          state.admin.connections = {
            connected: current.connected
              ? [data, ...current.connected]
              : [data],
            requests_got: updatedRequests ? [...updatedRequests] : [],
            requests_sent: [],
          };
        } else if (command == "reject" && current.requests_got) {
          console.log("entered in Reject hook");
          const updatedRequests = current.requests_got.filter((user) => {
            return user.user._id !== data.user._id;
          });
          state.admin.connections = {
            connected: current.connected ? [...current.connected] : [],
            requests_got: [...updatedRequests],
            requests_sent: [],
          };
        } else if (command == "request") {
          console.log("entered in Request hook");
          state.admin.connections = {
            connected: current.connected,
            requests_got: current.requests_got
              ? [data, ...current.requests_got]
              : [data],
            requests_sent: [],
          };
        }
      }
    },
    set_media_items: (state, action: PayloadAction<Array<media_Item>>) => {
      state.media_Items = [...action.payload];
    },
    set_my_uploads: (state, action: PayloadAction<Array<media_Item>>) => {
      state.my_uploads = [...action.payload];
    },
    set_onLineUsers: (state, action: PayloadAction<Array<onlineUsers>>) => {
      state.onLineUsers = [...action.payload];
    },
    set_suggestedData: (
      state,
      action: PayloadAction<suggestedDataPayloadType>
    ) => {
      const { _type } = action.payload;
      if (_type == "users") {
        const { data } = action.payload;
        state.suggestedData = { users: [...data] };
      }
    },
    set_users_with_old_chats: (
      state,
      action: PayloadAction<users_with_old_chats[]>
    ) => {
      state.users_with_old_chats = action.payload;
    },
    set_loadedChatMessages: (
      state,
      action: PayloadAction<loadedChatMessagesArgType>
    ) => {
      const { join_chat, delete_chat, userWithChat } = action.payload;
      if (join_chat) {
        const { chat_id, msg } = join_chat;
        const new_loadedChatMessages = state.loadedChatMessages.map((load) => {
          if (load._id == chat_id) {
            return {
              ...load,
              messages: [...load.messages, msg],
            };
          }
          return load;
        });
        state.loadedChatMessages = new_loadedChatMessages;
      }
      if (userWithChat) {
        state.loadedChatMessages = [...state.loadedChatMessages, userWithChat];
      }
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  toggle_dark_mode,
  set_media_items,
  set_my_uploads,
  set_Admin,
  set_Admins_Connections,
  set_ConnectionsId,
  set_AssetId,
  set_onLineUsers,
  set_suggestedData,
  set_users_with_old_chats,
  set_loadedChatMessages,
} = counterSlice.actions;

export default counterSlice.reducer;

interface loadedChatMessagesArgType {
  delete_chat?: null | { chat_id: string; msg: chat_messages };
  join_chat?: null | { chat_id: string; msg: chat_messages };
  userWithChat?: null | loadedChatMessages;
}

export interface suggestedDataPayloadType {
  _type: string;
  data: min_id_of_usr[];
}

export interface onlineUsers extends users {
  socketId: String;
}

type setAdminConnectionsPayloadType = {
  command: string;
  data: usr_and_key_in_array;
  current: connections;
};
