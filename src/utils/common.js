import { find, each, extend } from 'lodash';
import BigNumber from 'bignumber.js';
import Jazzicon from '@metamask/jazzicon';

export function deepClone(variable) {
  try {
    return JSON.parse(JSON.stringify(variable)); //deep copy
  } catch (error) {
    return null;
  }
}

export function merge() {
  const target = {};
  let recursiver = obj => {
    for (const prop in obj) {
      if ({}.hasOwnProperty.call(obj, prop)) {
        target[prop] =
          Object.prototype.toString.call(obj[prop]) === '[object Object]'
            ? merge(target[prop], obj[prop])
            : obj[prop];
      }
    }
  };
  for (const arg of arguments) {
    recursiver(arg);
  }
  return target;
}

// merge 2 array by prop
export function mergeByProperty(arr1, arr2, prop) {
  each(arr2, function(arr2obj) {
    var arr1obj = find(arr1, function(arr1obj) {
      return arr1obj[prop] === arr2obj[prop];
    });

    arr1obj ? extend(arr1obj, arr2obj) : arr1.push(arr2obj);
  });
}

export function truncate(str, n, frontChars, backChars, separator) {
  /**
   * str: Input string
   * n: Number of character want to display
   * frontChars: Number of characters in front of separator
   * backChars: Number of characters in back of separator
   * seperator: Symbol want to display, default "..."
   */
  const sep = separator || '...';
  const sepLen = sep.length;
  if (str.length < n - sepLen) {
    return str;
  }
  return str.substr(0, frontChars) + sep + str.substr(str.length - backChars);
}

export function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

export function getFilename(url) {
  if (url) {
    let m = url
      .split('/')
      .pop()
      .replace(/\?(.*?)$/, '');

    if (m && m.length > 1) {
      return m;
    }
  }
  return '';
}
export function get_url_extension(url) {
  return new Promise(resolve => {
    fetch(url, { method: 'HEAD' })
      .then(response => response.headers.get('Content-Type'))
      .then(type => resolve(type.replace(/.+\/|;.+/g, '')));
  });
}

export function hexToDec(hexString) {
  return parseInt(hexString, 16);
}

export function dectoHex(number) {
  return Number(number).toString(16);
}

export function bnum(val) {
  const number = typeof val === 'string' ? val : val ? val.toString() : '0';
  return new BigNumber(number);
}

export function scale(input, decimalPlaces) {
  const scalePow = new BigNumber(decimalPlaces.toString());
  const scaleMul = new BigNumber(10).pow(scalePow);
  return input.times(scaleMul);
}

export function guidGenerator() {
  var S4 = function() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  };
  return (
    S4() +
    S4() +
    '-' +
    S4() +
    '-' +
    S4() +
    '-' +
    S4() +
    '-' +
    S4() +
    S4() +
    S4()
  );
}

export function getMetamaskAvatar(diameter, address) {
  if (!diameter || !address) return '';
  const avatar = Jazzicon(diameter, parseInt(address.slice(2, 10), 16));
  // console.log(avatar, "avatar");
  return avatar.outerHTML;
}

export const convertType = data => {
  const tmp = data;
  return Object.keys(data).map(item => {
    return {
      value: tmp[item],
      key: item,
      label: `PRAMS_TYPE_${item.toLocaleUpperCase()}`,
    };
  });
};

export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function isNumber(v) {
  if (/^-?\d+$/.test(`${v}`)) {
    return true;
  }
  return false;
}

export function formatNumber(num) {
  if (num === 0) return '0';
  //  return num.toFixed(6).replace(/\d(?=(\d{3})+\.)/g, '$&,'); // 12,345.67

  var parts = num.toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
}
