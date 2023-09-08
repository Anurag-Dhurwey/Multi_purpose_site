import { createSlice } from "@reduxjs/toolkit";
import {
  media_Item,
  suggestedData,
  admin,
  users,
  usersMinData,
  connections,
} from "@/typeScript/basics";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface CounterState {
  darkmode: boolean;
  admin: admin;
  media_Items: Array<media_Item>;
  my_uploads: Array<media_Item>;
  onLineUsers: Array<onlineUsers>;
  suggestedData: suggestedData;
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
            return user.userId !== data.userId;
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
            return user.userId !== data.userId;
          });
          state.admin.connections = {
            connected: current.connected ? [...current.connected] : [],
            requests_got: [...updatedRequests],
            requests_sent: [],
          };
        } else if (command == "request") {
          console.log("entered in Request hook");
          // const isAlreadyExist = state.admin?.connections?.requests_got?.find(
          //   (usr) => usr.userId == data.userId
          // );

          // if (!isAlreadyExist) {
            state.admin.connections = {
              connected: current.connected,
              requests_got: current.requests_got
                ? [data, ...current.requests_got]
                : [data],
              requests_sent: [],
            };
          // } else {
          //   console.log("already exist in request array");
          //   console.log(isAlreadyExist);
          // }
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
} = counterSlice.actions;

export default counterSlice.reducer;

export interface suggestedDataPayloadType {
  _type: string;
  data: Array<users>;
}

export interface onlineUsers extends users {
  socketId: String;
}

type setAdminConnectionsPayloadType = {
  command: string;
  data: usersMinData;
  current: connections;
};
