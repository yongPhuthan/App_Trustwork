import React, {useState, useContext, useEffect, useRef} from 'react';
import {Text, View, TextInput, Button, StyleSheet} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import { useQuery } from 'react-query';

import {
  clientName,
  clientAddress,
  clientTel,
  clientVat,
} from '../redux/Actions';
import {Store} from '../redux/Store';
import * as stateAction from '../redux/Actions';
import {StackNavigationProp} from '@react-navigation/stack';

import {RouteProp, ParamListBase} from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';

type FormValues = {
  name: string;
  address: string;
  phone: string;
  taxId: string;
};

interface Props {
  navigation: StackNavigationProp<ParamListBase, 'EditCompanyForm'>;
  route: RouteProp<ParamListBase, 'EditCompanyForm'>;
}
const fetchCompanyUser = async (email: string, isEmulator:boolean) => {
  const user = auth().currentUser;
  if (!user) {
    throw new Error('User not authenticated');
  }
  const idToken = await user.getIdToken();
  let url;
  if (isEmulator) {
    url = `http://${HOST_URL}:5001/workerfirebase-f1005/asia-southeast1/queryCompanySeller2`;
  } else {
    console.log('isEmulator Fetch',isEmulator)
    url = `https://asia-southeast1-workerfirebase-f1005.cloudfunctions.net/queryCompanySeller2`;
  }
  const response = await fetch(
    url,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify({email}),
      credentials: 'include',
    },
  );
  const data = await response.json();

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  return data;
};

const updateCompanySeller = async (email: string, isEmulator: boolean, data: FormValues) => {
  const user = auth().currentUser;
  if (!user) {
    throw new Error("User not authenticated");
  }
  const idToken = await user.getIdToken();
  let url;
  if (isEmulator) {
    url = `http://${HOST_URL}:5001/workerfirebase-f1005/asia-southeast1/updateCompanySeller`;
  } else {
    console.log("isEmulator Fetch", isEmulator);
    url = `https://asia-southeast1-workerfirebase-f1005.cloudfunctions.net/updateCompanySeller`;
  }
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify({ email, data }),
    credentials: "include",
  });
  const responseData = await response.json();

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return responseData;
};

const EditCompanyForm = ({navigation, route}: Props) => {
  const userEmail = "doorfolding@gmail.com"; // Replace with the user's email
  const isEmulator = false; // Set to true if using an emulator
  const {
    state: {client_name,client_address,client_tel,client_tax},
    dispatch,
  }: any = useContext(Store);

  const { data: companyData, isLoading } = useQuery(
    'fetchCompanyUser',
    () => fetchCompanyUser(userEmail, isEmulator)
  );

   const {
    control,
    handleSubmit,
    setValue,
    formState: {errors},
  } = useForm<FormValues>({
    defaultValues: {
      name: companyData ? companyData.userName : '',
      address: companyData ? companyData.address : '',
      phone: companyData ? companyData.mobileTel : '',
      taxId: companyData ? companyData.companyNumber : '',
    },
  });

  useEffect(() => {
    if (companyData) {
      setValue('name', companyData.userName);
      setValue('address', companyData.address);
      setValue('phone', companyData.mobileTel);
      setValue('taxId', companyData.companyNumber);
    }
  }, [companyData, setValue]);
  const onSubmit = async (data: FormValues) => {
    try {
      await updateCompanySeller(userEmail, isEmulator, data);
      navigation.goBack();
    } catch (error) {
      console.error('Error updating company information:', error);
    }
  };
  if (isLoading) {
    return <Text>Loading...</Text>;
  }
  return (
    <ScrollView style={styles.container}>
      <View style={styles.subContainer}>
      <Controller
          control={control}
          name="name"
          rules={{required: true}}
          render={({field: {onChange, onBlur, value}}) => (
            <TextInput
              style={styles.inputName}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        {errors.name && <Text>This is required.</Text>}

        <Controller
          control={control}
          rules={{required: true}}
          render={({field: {onChange, onBlur, value}}) => (
            <TextInput
              placeholder="ที่อยู่"
              keyboardType="name-phone-pad"
              multiline
              textAlignVertical="top"
              numberOfLines={4}
              style={styles.inputAddress}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
          name="address"
        />
        {errors.address && <Text>This is required.</Text>}

        <Controller
          control={control}
          render={({field: {onChange, onBlur, value}}) => (
            <TextInput
              placeholder="เบอร์โทรศัพท์"
              keyboardType="phone-pad"
              style={styles.inputName}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
          name="phone"
        />
 

        <Controller
          control={control}
          render={({field: {onChange, onBlur, value}}) => (
            <TextInput
              placeholder="เลขทะเบียนภาษี(ถ้ามี)"
              keyboardType="number-pad"
              style={styles.inputName}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
          name="taxId"
        />

        <Button title="บันทึก" onPress={handleSubmit(onSubmit)} />
      </View>
    </ScrollView>
  );
};

export default EditCompanyForm;

const styles = StyleSheet.create({
  container: {},
  subContainer: {
    backgroundColor: '#ffffff',
    padding: 30,
    marginBottom: 10,
    height: 'auto',
  },
  form: {
    border: '1px solid #0073BA',
    borderRadius: 10,
  },
  date: {
    textAlign: 'right',
  },

  inputName: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginVertical: 10,
    fontSize: 16,
    height: 40,
  },
  inputAddress: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginVertical: 10,
    fontSize: 16,
    height: 100,
  },
  label: {
    fontSize: 16,
    color: 'white',
  },
});
