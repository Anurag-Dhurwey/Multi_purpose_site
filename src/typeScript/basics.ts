import { onlineUsers } from "@/redux_toolkit/features/indexSlice";
import { MessageInstance } from "antd/es/message/interface";
import { type } from "os";
export type session = {
  user?: sessionUser;
} | null;

export type sessionUser = {
  image?: string | null;
  name?: string | null;
  email?: string | null;
};

export interface users extends min_id_of_usr {
  bio?: string;
  desc?: string;
  link?: string;
  connections?: { _id?: string; connected?: usr_and_key_in_array };
}

export interface min_id_of_usr {
  _id: string;
  email: string;
  image?: string;
  name: string;
}

export interface profileSlugObjType {
  _id?: string;
  email?: string;
  image?: string;
  name?: string;
  _key?: string;
}

export type admin = {
  _id?: string;
  name?: string;
  email?: string;
  image?: string;
  bio?: string;
  desc?: string;
  link?: string;
  connections?: connections;
  assetId?: string;
};

export type me = admin;

export interface connections {
  _id?: string;
  connected?: usr_and_key_in_array[];
  requests_got?: usr_and_key_in_array[];
  requests_sent?: usr_and_key_in_array[];
}
export type usr_and_key_in_array = {
  _key: string;
  user: { _id: string; name: string; email: string; image: string };
};

export interface uploadForm {
  caption: string;
  desc: string;
  filePath: string;
}

export interface media_Item {
  _id: string;
  meadiaFile: meadiaFile;
  postedBy: postedBy;
  caption?: string;
  desc?: string;
  tag?: string;
  likes?: like[];
  comments?: comment[];
  _updatedAt?: string;
  _createdAt?: string;
}

export interface like {
  _key: string;
  postedBy: {
    _id: string;
    name: string;
    email: string;
  };
}

export interface _ref {
  _type: string;
  _ref: string;
}

export interface like_ref {
  _key: string;
  postedBy: _ref;
}

interface comment extends like {
  comment: string;
}

export interface comment_ref {
  _key: string;
  comment: string;
  postedBy: _ref;
}

export interface meadiaFile {
  _type: string;
  asset: _ref;
}

export type postedBy = min_id_of_usr;

export interface socketIoConnectionType {
  session: session;
  dispatch: Function;
  admin: admin;
  message: MessageInstance;
}

export interface suggestedData {
  users: min_id_of_usr[];
}

export interface users_with_old_chats {
  _id: string;
  userOne: min_id_of_usr;
  userTwo: min_id_of_usr;
}
export interface loadedChatMessages {
  _id: string;
  friend: min_id_of_usr;
  messages: chat_messages[];
};

export interface chat_messages {
  _key: string;
  sender: _ref;
  receiver: _ref;
  message: string;
  date_time: Date|string;
}

export interface currentUser_On_Chat {
  chat_id?: string;
  user: min_id_of_usr;
}
