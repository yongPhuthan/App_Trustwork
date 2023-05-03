import React, {useState, useContext, useEffect, useRef} from 'react';
import {
  Text,
  TouchableOpacity,
  Image,
  View,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {useQuery, useMutation} from 'react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {HOST_URL} from '@env';
import {
  launchCamera,
  launchImageLibrary,
  MediaType,
} from 'react-native-image-picker';
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

type FormValues = {
  name: string;
  address: string;
  id: string;
  phone: string;
  logo: string;
  taxId: string;
  lastName: string;
  bizName: string;
};
interface MyError {
  response: object;
  // add other properties if necessary
}
type UpdateCompanySellerArgs = {
  email: string;
  isEmulator: boolean;

  dataInputForm: FormValues;
};
type Company = {
  id: string;
};
interface Props {
  navigation: StackNavigationProp<ParamListBase, 'EditCompanyForm'>;
  route: RouteProp<ParamListBase, 'EditCompanyForm'>;
}
const fetchCompanyUser = async (email: string, isEmulator: boolean) => {
  const user = auth().currentUser;
  if (!user) {
    throw new Error('User not authenticated');
  }
  const idToken = await user.getIdToken();
  let url;
  if (isEmulator) {
    url = `http://${HOST_URL}:5001/workerfirebase-f1005/asia-southeast1/queryCompanySeller2`;
  } else {
    console.log('isEmulator Fetch', isEmulator);
    url = `https://asia-southeast1-workerfirebase-f1005.cloudfunctions.net/queryCompanySeller2`;
  }
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify({email}),
    credentials: 'include',
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  return data;
};
const saveDataToAsyncStorage = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.log('Error saving data to AsyncStorage:', error);
  }
};
const getDataFromAsyncStorage = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      return JSON.parse(value);
    }
  } catch (error) {
    console.log('Error getting data from AsyncStorage:', error);
  }
  return null;
};
const updateCompanySellerAPI = async ({
  dataInputForm,
  isEmulator,
}: UpdateCompanySellerArgs): Promise<void> => {
  const user = auth().currentUser;
  if (!user) {
    throw new Error('User not authenticated');
  }
  console.log('email', JSON.stringify(dataInputForm));
  let url;
  if (isEmulator) {
    url = `http://${HOST_URL}:5001/workerfirebase-f1005/asia-southeast1/updateCompanySeller`;
  } else {
    url = `https://asia-southeast1-workerfirebase-f1005.cloudfunctions.net/appUpdateCompanySeller`;
  }
  const dataApi = dataInputForm;
  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${user?.uid}`,
    },
    body: JSON.stringify({data: dataApi}),
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
};

const EditCompanyForm = ({navigation, route}: Props) => {
  const userEmail = auth().currentUser?.email;
  const [company, setCompany] = useState<Company>();
  const [logo, setLogo] = useState<string | null>(null);

  // Set to true if using an emulator
  const {
    state: {client_name, isEmulator, client_tel, client_tax},
    dispatch,
  }: any = useContext(Store);
  const handleLogoUpload = () => {
    const options = {
      mediaType: 'photo' as MediaType,
      maxWidth: 300,
      maxHeight: 300,
    };
    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorMessage) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else {
        if (response.uri) {
          setLogo({uri: response.uri});
        } else {
          console.log('No URI in response');
        }
      }
    });
  };
  const {data: companyData, isLoading} = useQuery(
    'fetchCompanyUser',
    () => fetchCompanyUser(userEmail as string, isEmulator),
    {
      onSuccess: data => {
        setCompany(data);
        console.log('COMPANY', JSON.stringify(data));
      },
    },
  );
  const {mutate} = useMutation(updateCompanySellerAPI, {
    onSuccess: data => {
      navigation.goBack();
    },
    onError: (error: MyError) => {
      console.error('There was a problem calling the function:', error);
      console.log(error.response);
    },
  });

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
    const fetchData = async () => {
      const savedData = await getDataFromAsyncStorage('companyData');
      if (savedData) {
        setCompany(savedData);
        setFormValues(savedData);
      } else {
        const fetchedData = await fetchCompanyUser(userEmail as string, isEmulator);
        setCompany(fetchedData);
        saveDataToAsyncStorage('companyData', fetchedData);
        setFormValues(fetchedData);
      }
    };
    fetchData();
  }, []);
  const setFormValues = (data:any) => {
    setValue('logo', data.logo);
    setValue('id', company?.id);
    setValue('name', data.userName);
    setValue('lastName', data.userLastName);
    setValue('bizName', data.bizName);
    setValue('address', data.address);
    setValue('phone', data.mobileTel);
    setValue('taxId', data.companyNumber);
    setLogo(data.logo)
  };
  const onSubmit = async (data: FormValues) => {
    await saveDataToAsyncStorage('companyData', data);
    await mutate({dataInputForm: data, isEmulator} as any);
  };
  
  // useEffect(() => {
  //   if (companyData) {
  //     setValue('logo', companyData.logo);
  //     setValue('id', company?.id);
  //     setValue('name', companyData.userName);
  //     setValue('lastName', companyData.userLastName);
  //     setValue('bizName', companyData.bizName);
  //     setValue('address', companyData.address);
  //     setValue('phone', companyData.mobileTel);
  //     setValue('taxId', companyData.companyNumber);
  //     setLogo(companyData.logo)
  //   }
    
  // }, [companyData, setValue]);

  // const onSubmit = async (data: FormValues) => {
  //   await mutate({dataInputForm: data, isEmulator} as any);
  // };

  if (isLoading) {
    return <Text>Loading...</Text>;
  }
  return (
    <ScrollView style={styles.container}>
      <View style={styles.subContainer}>
        {/* Logo */}
        <TouchableOpacity
          style={{alignItems: 'center', marginBottom: 24}}
          onPress={handleLogoUpload}>
          {logo ? (
            <Image
                
            source={{
              uri: logo,
            }}
              style={{ width: 100,aspectRatio: 2, resizeMode: 'contain' }}
              />
          ) : (
            <View
              style={{
                width: 80,
                height: 80,
                backgroundColor: '#ddd',
                borderRadius: 40,
                alignItems: 'center',
              }}
            />
          )}
        </TouchableOpacity>
        <Controller
          control={control}
          name="bizName"
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
        {errors.bizName && <Text>This is required.</Text>}
        <Controller
          control={control}
          name="name"
          rules={{required: true}}
          render={({field: {onChange, onBlur, value}}) => (
            <TextInput
              placeholder="ชื่อจริง"
              multiline
              textAlignVertical="top"
              numberOfLines={1}
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
          name="lastName"
          rules={{required: true}}
          render={({field: {onChange, onBlur, value}}) => (
            <TextInput
              placeholder="นามสกุล"
              multiline
              textAlignVertical="top"
              numberOfLines={1}
              style={styles.inputName}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        {errors.address && <Text>This is required.</Text>}

        <Controller
          control={control}
          name="address"
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
        />
        {errors.address && <Text>This is required.</Text>}

        <Controller
          control={control}
          name="phone"
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
        />
        <Controller
          control={control}
          name="taxId"
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
