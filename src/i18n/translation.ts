import RyuChanConfig from "../../ryuchan.config";
import key from "./keys";

export type Translation = {
  [key: string]: string;
};

import { languageMappings } from './config';

export function getTranslation(lang: string): Translation {
  return languageMappings[lang] || languageMappings['en'];
}

export function i18n(key: string, ...interpolations: string[]): string {
  const lang = RyuChanConfig.locale;
  let translation = getTranslation(lang)[key];
  interpolations.forEach((interpolation) => {
    translation = translation.replace("{{}}", interpolation);
  });
  return translation;
}
