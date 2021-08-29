import clientStorage, { STORAGE_KEY } from './client-storage';
import { env } from '../env';

let loggedIn = false;

if (typeof window !== 'undefined') {
  loggedIn = !!clientStorage.get(STORAGE_KEY.AUTH_TOKEN);
}

function login (name, password) {
  return fetch(`${env.API_HOST}/v1/user/login`, {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name,
      password,
    }),
  })
    .then(res => {
      if (res.ok) return res.json();
      throw new Error('Login attempt failed. Please check your email and password, and try again.');
    })
    .then((responseData) => {
      if (responseData.token) {
        clientStorage.save(STORAGE_KEY.AUTH_TOKEN, responseData.token);
        loggedIn = true;
      }

      return responseData;
    });
}

function logout () {
  clientStorage.remove(STORAGE_KEY.AUTH_TOKEN);

  loggedIn = false;
}

function isLoggedIn () {
  return loggedIn;
}

function validateToken (token) {
  return fetch(`${env.API_HOST}/v1/user/validate`, {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token }),
  })
    .then(res => res.ok)
    .catch(() => false);
}

export default {
  login,
  logout,
  isLoggedIn,
  validateToken,
};