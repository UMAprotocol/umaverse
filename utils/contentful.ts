import { createClient, Entry, EntryCollection } from "contentful";
import { DateTime } from "luxon";
import { CATEGORIES, Category } from "./constants";
import { errorFilter } from "./errors";
import { ContractType, fetchCompleteSynth, Synth } from "./umaApi";

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
  mintmanage: string;
  externalApi?: string;
  name?: string;
  externalUrl?: string;
};

export function formatContentfulUrl(url: string): string {
  return `https:${url}`;
}

function flattenCollection<T = ContentfulSynth>(
  collection: EntryCollection<T>
): T[] {
  return collection.items.map((item) => item.fields);
}

function getSynthsByField(): () => Promise<ContentfulSynth[]>;
function getSynthsByField<T>(
  field: string
): (value: T) => Promise<ContentfulSynth[]>;
function getSynthsByField<T>(field?: string) {
  return async function (value?: T) {
    const client = getContenfulClient();
    const collection = await client.getEntries<ContentfulSynth>({
      content_type: "synth",
      [`${field}`]: value,
    });
    return flattenCollection(collection);
  };
}

const getSynthsByCategory = getSynthsByField<Category>("fields.category");
const getAllSynths = getSynthsByField();

async function getSynth(address: string): Promise<ContentfulSynth> {
  const [synth] = await getSynthsByField<string>("fields.address")(address);
  return synth;
}

async function getRelatedSynths(
  synth: ContentfulSynth
): Promise<ContentfulSynth[]> {
  // Fetch synth in the same category
  const relatedCmsSynths = await getSynthsByCategory(synth.category);
  // Get the synths state to see if they're expired or not
  const allRelatedSynths = (
    await Promise.all(relatedCmsSynths.map(fetchCompleteSynth))
  ).filter(errorFilter) as Synth<{ type: ContractType }>[];
  const relevantRelatedSynths = allRelatedSynths.filter((relatedSynth) => {
    const isExpired =
      DateTime.now().toSeconds() > Number(relatedSynth.expirationTimestamp);
    return relatedSynth.address !== synth.address && !isExpired;
  });

  if (relevantRelatedSynths.length > 0) {
    return relevantRelatedSynths;
  }
  const nextCategoryIdx =
    (CATEGORIES.findIndex((category) => category === synth.category) + 1) %
    CATEGORIES.length;
  const closestRelatedSynths = await getSynthsByCategory(
    CATEGORIES[nextCategoryIdx]
  );
  return closestRelatedSynths;
}

export const contentfulClient = {
  getAllSynths,
  getSynth,
  getRelatedSynths,
  getSynthsByField,
};
