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