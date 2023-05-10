import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {firebase as firebaseFunction} from '@react-native-firebase/functions';
import firebase from '../firebase';
import { useMutation } from 'react-query';
import { RadioButton } from 'react-native-paper';
import {
  launchImageLibrary,
  MediaType,
  ImageLibraryOptions,
  ImagePickerResponse,
} from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {v4 as uuidv4} from 'uuid';

import {ScrollView} from 'react-native-gesture-handler';
interface CompanyUserFormScreenProps {
  navigation: StackNavigationProp<RootStackParamList, 'CompanyUserFormScreen'>;
}
type RootStackParamList = {
  Quotation: undefined;
  ContactInfoScreen: {
    bizName: string;
    userName: string;
    userLastName: string;
    address: string;
    officeTel: string;
    mobileTel: string;
    bizType: string;
    logo: string | null;
    signature: string | null;
    companyNumber: string;
    bankaccount: object;
    conditions: string;
  };
  AddProductForm: undefined;
  SignUpScreen: undefined;
  EditProductForm: undefined;
  CompanyUserFormScreen: undefined;
  // Profile: { userId: string };
};
interface MyError {
  response: object;
  // add other properties if necessary
}

// const createCompanySeller = async (data:any) => {
//   const user = auth().currentUser;
//   const response = await fetch('https://asia-southeast1-workerfirebase-f1005.cloudfunctions.net/createCompanySeller', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       'Authorization': `Bearer ${user?.uid}`,
//     },
//     body: JSON.stringify({ data }),
//   });
//   if (!response.ok) {
//     throw new Error('Network response was not ok');
//   }
//   return ;
// };

const createCompanySeller = async (data:any) => {
  const user = auth().currentUser;
  if (!user) {
    throw new Error('User is not logged in');
  }
  try {
    console.log('user',user)
    const response = await fetch('https://asia-southeast1-workerfirebase-f1005.cloudfunctions.net/createCompanySeller', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user?.uid}`,
      },
      body: JSON.stringify({ data }),
    });
    console.log('Response:', response.status);

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return ;
  } catch (error) {
    console.error(error);
    throw new Error('There was an error processing the request');
  }
};




const CompanyUserFormScreen = ({navigation}: CompanyUserFormScreenProps) => {
  const [bizName, setBizName] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [userLastName, setUserLastName] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [officeTel, setOfficeTel] = useState<string>('');
  const [mobileTel, setMobileTel] = useState<string>('');
  // const [bizType, setBizType] = useState<string>('');
  const [logo, setLogo] = useState<string | null>(null);
  const [signature, setSignature] = useState<string | null>(null);
  const [companyNumber, setCompanyNumber] = useState<string>('');
  const [bankaccount, setBankaccount] = useState<object>({});
  const [conditions, setConditions] = useState<string>('');
  const [userEmail, setUserEmail] = useState('');
  const [page, setPage] = useState(1);
  const [bizType, setBizType] = useState('individual');

  const { mutate, isLoading, isError } = useMutation(createCompanySeller, {
    onSuccess: () => {
      navigation.navigate('Quotation');
      console.log();
    },
    onError: (error: MyError) => {
      console.error('There was a problem calling the function:', error);
      console.log(error.response);
    },
  });
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const handleFunction = async () => {
    const data = {
      id: uuidv4(),
      bizName,
      userName,
      userLastName,
      address,
      officeTel,
      mobileTel,
      bizType,
      logo,
      companyNumber,
    };
    // call the mutation function instead of the fetch function
    mutate(data);
  };

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
          } catch (error) {
            console.error('Error uploading image to Firebase:', error);
          }
        }
      }
    });
  };

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
  
  const handleNextPage = () => {
    setPage(page + 1);
  };

  const handlePrevPage = () => {
    setPage(page - 1);
  };
  const signOutPage = () => {
    auth()
      .signOut()
      .then(() => console.log('User signed out!'));
  };

  // const handleFunction = async () => {
  //   const user = auth().currentUser;
  //   const data = {
  //     id: uuidv4(), // assuming the user's UID will be used as the companyUser's ID
  //     bizName,
  //     userName,
  //     userLastName,
  //     address,
  //     officeTel,
  //     mobileTel,
  //     bizType,
  //     logo,
  //     companyNumber,
  //   };
  //   await fetch('http://localhost:5001/workerfirebase-f1005/asia-southeast1/createCompanySeller', {
      
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       'Authorization': `Bearer ${user?.uid}`,
  //     },
  //     body: JSON.stringify({ data }),
  //   })
  //   .then((response) => {
  //     if (!response.ok) {
  //       throw new Error('Network response was not ok');
  //     }
  //     navigation.navigate('Quotation');

  //     // return response.text();
  //   })
  //   .then((data) => {
  //     console.log(data);
  //   })
  //   .catch((error) => {
  //     console.error('There was a problem calling the function:', error);
  //     console.log(error.response);
  //   });
    
      
  // };

  const renderPage1 = () => {
    return (
      <>
        <Text style={styles.label}>Biz Name</Text>
        <TextInput
          style={styles.input}
          value={bizName}
          onChangeText={setBizName}
        />
        <Text style={styles.label}>User Name</Text>
        <TextInput
          style={styles.input}
          value={userName}
          onChangeText={setUserName}
        />
        <Text style={styles.label}>User Last Name</Text>
        <TextInput
          style={styles.input}
          value={userLastName}
          onChangeText={setUserLastName}
        />
  
        <Text style={styles.label}>Account Type</Text>
        <View>
          <Text>Individual</Text>
          <RadioButton
            value="individual"
            status={bizType === 'individual' ? 'checked' : 'unchecked'}
            onPress={() => setBizType('individual')}
          />
        </View>
        <View>
          <Text>Business</Text>
          <RadioButton
            value="business"
            status={bizType === 'business' ? 'checked' : 'unchecked'}
            onPress={() => setBizType('business')}
          />
        </View>
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
          <Image
            source={{
              uri: 'gs://workerfirebase-f1005.appspot.com/static/image.png',
            }}
            style={{width: 100, aspectRatio: 2, resizeMode: 'contain'}}
          />
        )}
            </TouchableOpacity>
  
        <TouchableOpacity style={styles.button} onPress={handleNextPage}>
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </>
    );
  };
  
  const renderPage2 = () => {
    return (
      <>
        <Text style={styles.label}>Address</Text>
        <TextInput
          style={styles.input}
          value={address}
          onChangeText={setAddress}
        />
        <Text style={styles.label}>Office Tel</Text>
        <TextInput
          style={styles.input}
          value={officeTel}
          onChangeText={setOfficeTel}
        />
        <Text style={styles.label}>Mobile Tel</Text>
        <TextInput
          style={styles.input}
          value={mobileTel}
          onChangeText={setMobileTel}
        />
        <TouchableOpacity style={styles.button} onPress={handlePrevPage}>
          <Text style={styles.buttonText}>Previous</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} disabled={isLoading} onPress={handleFunction}>
          <Text style={styles.buttonText}>{isLoading ? 'Submitting...' : 'Submit'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={signOutPage}>
          <Text style={styles.buttonText}>sign out page</Text>
        </TouchableOpacity>
      </>
    );
  };
  


  return (
    <View style={styles.container}>
      {page === 1 ? renderPage1() : renderPage2()}
    </View>
  );
};

export default CompanyUserFormScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  label: {
    color: '#444444',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#0066C0',
    color: '#FFFFFF',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
