import { CounterState, onlineUsers } from "@/redux_toolkit/features/indexSlice";
import { MessageInstance } from "antd/es/message/interface";
import { TypedUseSelectorHook } from "react-redux";
export type session ={
  user?: sessionUser;
}|null

// below properties should not be null
// null is assined because of typescript error
export type sessionUser= {
  image?: string|null ;
  name?: string|null ;
  email?: string|null;
}

export interface users {
  _id: string;
  name: string;
  email: string;
  image: string;
  bio?: string;
  desc?: string;
  link?: string;
  connections?: { connected?: usersMinData };
}

export type admin ={
  _id?: string;
  name?: string;
  email?: string;
  image?: string;
  bio?: string ;
  desc?: string ;
  link?: string ;
  connections?: connections;
}

export type me = admin;

export interface connections {
  connected: Array<usersMinData>;
  requests_got: Array<usersMinData>;
  requests_sent:Array<usersMinData>;
}
export type usersMinData = {
  _key: string;
  userId: string;
  name: string;
  mail: string;
  img: string;
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
  caption: string;
  desc: string;
  tag: string;
  likes: Array<like>;
  comments: comments;
  _updatedAt?: string;
  _createdAt?: string;
}

type comments = Array<{
  _key: string;
  comment: string;
  name: string;
  email: string;
  userId: string;
}>;

export interface meadiaFile {
  _type: string;
  asset: {
    _ref: string;
    _type: string;
  };
}

export interface postedBy {
  _id: string;
  _updatedAt: string;
  email: string;
  image: string;
  _createdAt: string;
  _rev: string;
  _type: string;
  name: string;
}

export interface like {
  _key: string;
  name: string;
  email: string;
  userId: string;
}

export interface socketIoConnectionType {
  session: session;
  dispatch: Function;
  admin: admin;
  set_Admin: (action: admin) => void;
  set_onLineUsers: (action: Array<onlineUsers>) => void;
  message: MessageInstance;
}

export interface suggestedData {
  users: Array<users>;
}
