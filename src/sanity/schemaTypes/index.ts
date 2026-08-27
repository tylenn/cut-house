import type { SchemaTypeDefinition } from "sanity";

import { category } from "./documents/category";
import { infoPage } from "./documents/infoPage";
import { project } from "./documents/project";
import { siteSettings } from "./documents/siteSettings";
import { credit } from "./objects/credit";
import { richText } from "./objects/richText";
import { seo } from "./objects/seo";
import { socialLink } from "./objects/socialLink";

export const schemaTypes: SchemaTypeDefinition[] = [
  // Documents
  project,
  category,
  siteSettings,
  infoPage,
  // Objects
  richText,
  credit,
  socialLink,
  seo,
];
