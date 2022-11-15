import Moralis from 'moralis';
import axios from 'axios';

const axe = axios.create({
  baseURL: 'https://mlm.bitbuu.com/api',
  headers: {
    'Access-Control-Allow-Origin': '*',
  },
});

export const commissions = {
  first: '0.06',
  second: '0.04',
  third: '0.03',
}

export const getToken = async () => {
  const login = await Moralis.Cloud.run("referralToken");
  if (login.status === 200) {
    return login.text;
  }

  return null;
}

export const getUserReferrals = async (token, address) => {
  if (!token || !address) {
    return;
  }

  axe.defaults.headers['Authorization'] = `Bearer ${token}`;

  return await axe.post('/referral/get', {
    address
  });
}

export const getUserReferralsDisplay = async (token, address) => {
  if (!token || !address) {
    return;
  }

  axe.defaults.headers['Authorization'] = `Bearer ${token}`;

  return await axe.post('/referral/display', {
    address
  });
}

export const getUserReferralToken = async (token, address) => {
  if (!token || !address) {
    return;
  }

  axe.defaults.headers['Authorization'] = `Bearer ${token}`;

  return await axe.post('/referral/token', {
    address
  });
}

export const setUserReferral = async (token, address, parentAddress) => {
  if (!token || !address || !parentAddress) {
    return;
  }

  axe.defaults.headers['Authorization'] = `Bearer ${token}`;

  return await axe.post('/referral/add', {
    child: address,
    parent: parentAddress,
  });
}

export const getShortenedUrl = async (url) => {
  const short = await axios.post('api/cuttly', { url });

  if (short?.data?.url?.status === 7) {
    return short.data.url.shortLink;
  }

  return url;
}
