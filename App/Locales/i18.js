import en from './en.json'

import * as RNLocalize from "react-native-localize";
import i18n from 'i18n-js';

console.log(RNLocalize.getLocales());
console.log(RNLocalize.getCurrencies());

i18n.locale='en'
i18n.fallbacks = true;

i18n.translations = {
  en
};

export function strings(name, params = {}) {
    return i18n.t(name, params);
  }
  
export default i18n;

