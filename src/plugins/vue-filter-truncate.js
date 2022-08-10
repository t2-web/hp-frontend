import Vue from "vue";
Vue.filter("truncate", function(str, n, frontChars, backChars, separator) {
  /**
   * str: Input string
   * n: Number of character want to display
   * frontChars: Number of characters in front of separator
   * backChars: Number of characters in back of separator
   * seperator: Symbol want to display, default "..."
   */
  if (!str) {
    return "";
  }
  const sep = separator || "...";
  const sepLen = sep.length;
  if (str.length < n - sepLen) {
    return str;
  }
  return str.substr(0, frontChars) + sep + str.substr(str.length - backChars);
});
