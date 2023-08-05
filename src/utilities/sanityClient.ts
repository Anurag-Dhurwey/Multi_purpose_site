import { SanityImageSource } from "@sanity/asset-utils";
import { createClient } from "next-sanity";
import createImageUrlBuilder from "@sanity/image-url";
export const client = createClient({
    projectId:process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: "production",
    apiVersion: "2023-06-25",
    useCdn: false,
    token:process.env.NEXT_PUBLIC_SANITY_CLIENT,
    ignoreBrowserTokenWarning: true
  });


  export const urlFor = (source:SanityImageSource) =>createImageUrlBuilder(client).image(source);
