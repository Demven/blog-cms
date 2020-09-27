export const STORAGE_KEY = {
  ARTICLE_DATA: 'ARTICLE_DATA',
  HOMEPAGE_DATA: 'HOMEPAGE_DATA',
  AUTH_TOKEN: 'AUTH_TOKEN',
};

function save(key, value) {
  let sanitizedValue = value;

  if (typeof value === 'object') {
    sanitizedValue = JSON.stringify(value);
  }

  window.localStorage.setItem(key, sanitizedValue);
}

function get(key) {
  let valueToReturn;
  const stringValue = window.localStorage.getItem(key);

  try {
    valueToReturn = JSON.parse(stringValue);
  } catch (error) {
    valueToReturn = stringValue;
  }

  return valueToReturn;
}

function remove(key) {
  window.localStorage.removeItem(key);
}

export default {
  save,
  get,
  remove,
};
