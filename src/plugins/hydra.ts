import axios from 'axios';

export const hydraApi = axios.create({
  baseURL: 'https://identity.hydra.africa',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
});
