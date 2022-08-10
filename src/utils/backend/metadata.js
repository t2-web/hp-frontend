import { env } from '@/constants';
import http from '@/utils/http';
import axios from 'axios';

const URL = env.app.apiUrl;
const URLs = {
  createMetadata: `${URL}/api/v1/metadata`,
};

const createMetadata = async data => {
  try {
    return await http.post(URLs.createMetadata, data);
  } catch (error) {
    console.log('network error: ', error);
    return null;
  }
};

const loadMetadata = async url => {
  const res = await axios.get(url);
  return res.data;
};

export default {
  createMetadata,
  loadMetadata,
};
