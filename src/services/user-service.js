import axios from 'axios';
import clientStorage, { STORAGE_KEY } from './client-storage';
import { env } from '../env';

let loggedIn = false;

if (typeof window !== 'undefined') {
  loggedIn = !!clientStorage.get(STORAGE_KEY.AUTH_TOKEN);
}

function login (name, password) {
  console.info('process.env.API_HOST', env.API_HOST);

  return axios
    .post(`${env.API_HOST}/api/v1/user/login`, { name, password })
    .then(response => {
      if (response.status === 200 && response.data.token) {
        clientStorage.save(STORAGE_KEY.AUTH_TOKEN, response.data.token);

        loggedIn = true;
      }

      return response;
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
  return axios
    .post(`${env.API_HOST}/api/v1/user/validate`, { token })
    .then(response => {
      return response.status === 200;
    })
    .catch(() => {
      return false;
    });
}

export default {
  login,
  logout,
  isLoggedIn,
  validateToken,
};