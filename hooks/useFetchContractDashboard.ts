import { useQuery, UseQueryOptions } from 'react-query';
import auth from '@react-native-firebase/auth';
import {HOST_URL} from '@env';
import React, {useState, useContext, useEffect, useMemo} from 'react';
import {Store} from '../redux/Store';
import {Contract} from '../types/docType'

const getTokenAndEmail = async () => {
  const currentUser = auth().currentUser;
  if (currentUser) {
    const token = await currentUser.getIdToken();
    const email = currentUser.email;
    return { token, email };
  } else {
    // User is not logged in
    return null;
  }
};


const fetchContractDashboardData = async () => {
    const {
        state: {isEmulator},
        dispatch,
      }: any = useContext(Store);
  let url;
  if (isEmulator) {
    url = `http://${HOST_URL}:5001/workerfirebase-f1005/asia-southeast1/queryContractDashBoard`;
  } else {
    url = `https://asia-southeast1-workerfirebase-f1005.cloudfunctions.net/queryContractDashBoard`;
  }

  const user = await getTokenAndEmail();
  if (user) {
    console.log('user', user);
    const { token, email } = user;

    if (email) {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
        }),
      });
      const data = await response.json();
      if (data && data[1]) {
        data[1].sort((a, b) => {
          const dateA = new Date(a.dateOffer);
          const dateB = new Date(b.dateOffer);
          return dateB.getTime() - dateA.getTime();
        });
      }
      return data;
    }
  }
};

const useFetchContractDashboard = (options:any) => {
  return useQuery("contractDashboardData", fetchContractDashboardData, options);
};

export { useFetchContractDashboard  };
