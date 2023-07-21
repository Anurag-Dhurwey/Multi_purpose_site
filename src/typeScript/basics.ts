export interface session {
  user?: sessionUser;
}

// below properties should not be null
// null is assined because of typescript error
export interface sessionUser {
  image?: string | null;
  name?: string | null;
  email?: string | null;
}
export interface user {
  _id?: string;
  name?: string;
  email?: string;
  image?: string;
  desc?: string;
  link?: string;
}

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
  likes: Array<{
    _key: string;
    postedBy: postedBy;
  }>;
  comments: Array<{
    comment: string;
    postedBy: postedBy;
  }>;
  _updatedAt?: string;
  _createdAt?: string;
}

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
