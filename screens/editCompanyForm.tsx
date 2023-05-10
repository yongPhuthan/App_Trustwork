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
  Platform,
  PermissionsAndroid,
} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {useQuery, useMutation} from 'react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {HOST_URL} from '@env';
import firebase from '../firebase';
import storage from '@react-native-firebase/storage';

import {
  launchImageLibrary,
  MediaType,
  ImageLibraryOptions,
  ImagePickerResponse,
} from 'react-native-image-picker';

import {Store} from '../redux/Store';
import * as stateAction from '../redux/Actions';
import {StackNavigationProp} from '@react-navigation/stack';

import {RouteProp, ParamListBase} from '@react-navigation/native';

type FormValues = {
  name: string;
  address: string;
  companyNumber: string;
  id: string;
  phone: string;
  userName: string;
  logo: string;
  taxId: string;
  userLastName: string;
  lastName: string;
  mobileTel: string;
  bizName: string;
  company: {
    id: string;
  };
};
interface MyError {
  response: object;
  // add other properties if necessary
}
type UpdateCompanySellerArgs = {
  email: string;
  isEmulator: boolean;
  logo: any;

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
const saveDataToAsyncStorage = async (key: string, value: any) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.log('Error saving data to AsyncStorage:', error);
  }
};

const updateCompanySellerAPI = async ({
  dataInputForm,
  isEmulator,
  logo,
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
const removeDataFromAsyncStorage = async (key: string) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.log('Error removing data from AsyncStorage:', error);
  }
};
const EditCompanyForm = ({navigation, route}: Props) => {
  const userEmail = auth().currentUser?.email ?? '';
  const [company, setCompany] = useState<Company>();
  const [logo, setLogo] = useState<string | null>(null);
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Set to true if using an emulator
  const {
    state: {client_name, isEmulator, client_tel, client_tax},
    dispatch,
  }: any = useContext(Store);

  const handleLogoUpload = () => {
    const options: ImageLibraryOptions = {
      mediaType: 'photo' as MediaType,
      maxWidth: 300,
      maxHeight: 300,
      quality: 0.7,
    };

    launchImageLibrary(options, async (response: ImagePickerResponse) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorMessage) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        const source = {uri: response.assets[0].uri ?? null};
        console.log('Image source:', source);

        if (source.uri) {
          try {
            const firebaseUrl: string | undefined = await uploadImageToFirebase(
              source.uri,
            );
            if (firebaseUrl) {
              setLogo(firebaseUrl as string);
            } else {
              setLogo(null);
            }
            setLogo(firebaseUrl || null);
            setValue('logo', firebaseUrl as string);
          } catch (error) {
            console.error('Error uploading image to Firebase:', error);
          }
        }
      }
    });
  };

  const loadCompanyData = async () => {
    try {
      const companyData = await AsyncStorage.getItem('companyData');
      return companyData ? JSON.parse(companyData) : null;
    } catch (error) {
      console.log('Error loading company data:', error);
      return null;
    }
  };
  const saveCompanyData = async (companyData: object) => {
    try {
      await AsyncStorage.setItem('companyData', JSON.stringify(companyData));
    } catch (error) {
      console.log('Error saving company data:', error);
    }
  };

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
      name: '',
      address: '',
      phone: '',
      taxId: '',
    },
  });
  const uploadImageToFirebase = async (imagePath:string) => {
    if (!imagePath) {
      console.log('No image path provided');
      return;
    }
  
    const filename = imagePath.substring(imagePath.lastIndexOf('/') + 1);
    const storageRef = storage().ref(`images/${filename}`);
    await storageRef.putFile(imagePath);
  
    const downloadUrl = await storageRef.getDownloadURL();
    return downloadUrl;
  };
  
  

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(async user => {
      if (user) {
        setUser(user);

        let fetchedCompanyUser = await loadCompanyData();

        if (!fetchedCompanyUser) {
          fetchedCompanyUser = await fetchCompanyUser(
            user?.email || '',
            isEmulator,
          );
          await saveCompanyData(fetchedCompanyUser);
        }

        setCompany(fetchedCompanyUser);
        setLogo(fetchedCompanyUser.logo);
        setValue('userName', fetchedCompanyUser.userName);
        setValue('logo', fetchedCompanyUser.logo);
        setValue('id', fetchedCompanyUser.id);
        setValue('userLastName', fetchedCompanyUser.userLastName);
        setValue('bizName', fetchedCompanyUser.bizName);
        setValue('address', fetchedCompanyUser.address);
        setValue('mobileTel', fetchedCompanyUser.mobileTel);
        setValue('companyNumber', fetchedCompanyUser.companyNumber);

        setIsLoading(false); // Add this line
      } else {
        setUser(null);
      }
    });
    return unsubscribe;
  }, []);

  const onSubmit = async (data: FormValues) => {
    await mutate({dataInputForm: data, isEmulator} as any, {
      onSuccess: async () => {
        await removeDataFromAsyncStorage('companyData'); // Add this line to remove data from AsyncStorage

        await saveDataToAsyncStorage('companyData', data);
        navigation.goBack();
        // setFormValues(updatedData);
      },
    });
  };
  console.log("Current user:", auth().currentUser);

  return (
    <>
      {!isLoading ? (
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
                  style={{width: 100, aspectRatio: 2, resizeMode: 'contain'}}
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
              name="userName"
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
              name="userLastName"
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
              name="mobileTel"
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
              name="companyNumber"
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
      ) : (
        <Text>Loading Company...</Text>
      )}
    </>
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
