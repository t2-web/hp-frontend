import Vue from "vue";
import VueI18n from "vue-i18n";
import en from "@/lang/en.json";
import ja from "@/lang/ja.json";
import { env } from "@/constants";
import { localize } from "vee-validate";
import axios from "axios";

Vue.use(VueI18n);

// Create VueI18n instance with options
const i18n = new VueI18n({
  locale: window.localStorage.getItem("locale") || env.app.locale,
  fallbackLocale: env.app.fallbackLocale,
  silentTranslationWarn: true,
  messages: {
    en,
    ja
  }
});

export const setI18nLanguage = locale => {
  i18n.locale = locale;
  localize(locale);

  axios.defaults.headers.common["Accept-Language"] = locale;
  document.querySelector("html").setAttribute("lang", locale);
};

localize({ en, ja });

export default i18n;
