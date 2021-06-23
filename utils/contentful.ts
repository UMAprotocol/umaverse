import { createClient, Entry } from "contentful";
import type { Category } from "./constants";

const contentfulSpaceId = process.env.CONTENTFUL_SPACE_ID;
const contentfulAccessToken = process.env.CONTENTFUL_ACCESS_TOKEN;

type ContentfulClient = ReturnType<typeof createClient>;
let _contentfulClient: ContentfulClient;
type GetContenfulClient = () => ContentfulClient;
export const getContenfulClient: GetContenfulClient = () => {
  if (!_contentfulClient) {
    if (!contentfulSpaceId || !contentfulAccessToken) {
      throw new Error(
        `Both an access token and a space ID are required to use Contenful. You provided:
        SpaceID ${contentfulSpaceId} and AccessToken ${contentfulAccessToken}`
      );
    }
    _contentfulClient = createClient({
      space: contentfulSpaceId,
      accessToken: contentfulAccessToken,
    });
  }
  return _contentfulClient;
};

type ContentfulLogo = {
  title: string;
  file: {
    url: string;
    details: {
      size: string;
      image: {
        width: string;
        height: string;
      };
    };
  };
};
export type ContentfulSynth = {
  shortDescription: string;
  category: Category;
  address: string;
  description: string;
  logo?: Entry<ContentfulLogo>;
};

export function formatContentfulUrl(url: string): string {
  return `https://${url.substring(2)}`;
}
