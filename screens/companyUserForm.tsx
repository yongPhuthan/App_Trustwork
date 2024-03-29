import React, {useState, useEffect} from 'react';

import {
  View,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Image,
  Button,
  Modal,
  Text,
  SafeAreaView,
  FlatList,
  TextInput,
} from 'react-native';
import {List} from 'react-native-paper';
import {
  MultipleSelectList,
  SelectList,
} from 'react-native-dropdown-select-list';

import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {firebase as firebaseFunction} from '@react-native-firebase/functions';
import firebase from '../firebase';
import {useMutation} from 'react-query';
import {CheckBox} from '@rneui/themed';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';

import {faUpload, faCloudUpload} from '@fortawesome/free-solid-svg-icons';
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
  RootTab: undefined;
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

const createCompanySeller = async (data: any) => {
  const user = auth().currentUser;
  if (!user) {
    throw new Error('User is not logged in');
  }
  try {
    console.log('user', user);
    const response = await fetch(
      'https://asia-southeast1-workerfirebase-f1005.cloudfunctions.net/createCompanySeller',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.uid}`,
        },
        body: JSON.stringify({data}),
      },
    );
    console.log('Response:', response.status);

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return;
  } catch (error) {
    console.error(error);
    throw new Error('There was an error processing the request');
  }
};

const CompanyUserFormScreen = ({navigation}: CompanyUserFormScreenProps) => {
  const [bizName, setBizName] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [userPosition, setUserPosition] = useState<string>('');

  const [userLastName, setUserLastName] = useState<string>('');
  const [taxID, setTaxID] = useState<string>('');
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
  const [selectedCategories, setSelectedCategories] = useState<object[]>([]);
  const [visible, setVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isImageUpload, setIsImageUpload] = useState(false);
  const [isModalVisible, setModalVisible] = useState<boolean>(false);

  const categories: object[] = [
    {key: '1', value: 'Mobiles', disabled: true},
    {key: '2', value: 'อลูมิเนียม'},
    {key: '3', value: 'ฝ้าซีลาย'},
    {key: '4', value: 'Computers', disabled: true},
    {key: '5', value: 'งานเหล็กลังคา'},
    {key: '6', value: 'งานกระเบื้อง'},
    {key: '7', value: 'งานปูน'},
  ];

  const {mutate, isLoading, isError} = useMutation(createCompanySeller, {
    onSuccess: () => {
      navigation.navigate('RootTab');
      console.log();
    },
    onError: (error: MyError) => {
      console.error('There was a problem calling the function:', error);
      console.log(error.response);
    },
  });
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const handleFunction = async () => {
    const data = {
      id: uuidv4(),
      bizName,
      userName,
      userLastName,
      userPosition: userPosition === '' ? 'individual' : userPosition,
      rules: [selectedCategories],
      address,
      officeTel,
      mobileTel,
      bizType,
      logo: logo || 'logo',

      companyNumber,
    };
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

  const uploadImageToFirebase = async (imagePath: string) => {
    setIsImageUpload(true);
    if (!imagePath) {
      console.log('No image path provided');
      return;
    }

    const filename = imagePath.substring(imagePath.lastIndexOf('/') + 1);
    const storageRef = storage().ref(`images/${filename}`);
    await storageRef.putFile(imagePath);

    const downloadUrl = await storageRef.getDownloadURL();
    setIsImageUpload(false);

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
  const handleCategorySelect = category => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(
        selectedCategories.filter(item => item !== category),
      );
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };
  useEffect(() => {
    if (
      bizName &&
      userName &&
      userLastName &&
      bizType &&
      address &&
      officeTel &&
      mobileTel &&
      (bizType !== 'business' || userPosition) &&
      taxID
    ) {
      setCurrentStep(2);
    }
  }, [
    bizName,
    userName,
    userLastName,
    bizType,
    address,
    officeTel,
    mobileTel,
    userPosition,
    taxID,
  ]);
  const handleLogout = async () => {
    try {
      await auth().signOut();
    } catch (error) {
      console.error('Failed to sign out: ', error);
    }
  };
  console.log('USER',user)

  const renderPage = () => {
    return (
      <View style={{marginTop: 40}}>
        <Text style={styles.title}>ตั้งค่า หัวเอกสาร</Text>
        <TouchableOpacity
          style={{
            alignItems: 'center',
            marginBottom: 10,

            borderColor: 'gray',
            borderWidth: 1,
            borderRadius: 5,
            borderStyle: 'dotted',
            padding: 10,
          }}
          onPress={handleLogoUpload}>
          {isImageUpload ? (
            <ActivityIndicator size="small" color="gray" />
          ) : logo ? (
            <Image
              source={{uri: logo}}
              style={{width: 100, aspectRatio: 2, resizeMode: 'contain'}}
            />
          ) : (
            <View>
              <FontAwesomeIcon
                icon={faCloudUpload}
                style={{marginVertical: 5, marginHorizontal: 50}}
                size={32}
                color="gray"
              />
              <Text style={{textAlign: 'center', color: 'gray'}}>
                อัพโหลดโลโก้ธุรกิจ
              </Text>
            </View>
          )}
        </TouchableOpacity>
        <TextInput
          placeholder="ชื่อธุรกิจ - ชื่อบริษัท"
          style={styles.input}
          value={bizName}
          onChangeText={setBizName}
        />
        {/* <Text style={styles.label}>ประเภทธุรกิจ</Text> */}
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <CheckBox
            title="บุคคลธรรมดา"
            checkedIcon="dot-circle-o"
            uncheckedIcon="circle-o"
            checked={bizType === 'individual'}
            onPress={() => setBizType('individual')}
          />

          <CheckBox
            title="บริษัท-หจก"
            checkedIcon="dot-circle-o"
            uncheckedIcon="circle-o"
            checked={bizType === 'business'}
            onPress={() => setBizType('business')}
          />
        </View>

        {/* <MultipleSelectList 
        setSelected={(val) => setSelectedCategories(val)} 
        data={categories} 
        save="value"
        onSelect={() => alert(selectedCategories)} 
        label="เลือกหมวดหมู่ธุรกิจ"
    /> */}

        <SelectList
          setSelected={val => setSelectedCategories(val)}
          data={categories}
          save="value"
          placeholder={'เลือกหมวดหมู่ธุรกิจ'}
        />
                <TouchableOpacity onPress={handleLogout}><Text>LOG OUT</Text></TouchableOpacity>


        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 10,
          }}>
          <View style={{flex: 0.45}}>
            <TextInput
              placeholder="ชื่อจริง"
              style={styles.input}
              value={userName}
              onChangeText={setUserName}
            />
          </View>
          <View style={{flex: 0.45}}>
            <TextInput
              placeholder="นามสกุล"
              style={styles.input}
              value={userLastName}
              onChangeText={setUserLastName}
            />
          </View>
        </View>
        {bizType === 'business' && (
          <TextInput
            placeholder="ตำแหน่งในบริษัท"
            style={styles.input}
            value={userPosition}
            onChangeText={setUserPosition}
          />
        )}
        <TextInput
          placeholder="ที่อยู่ร้าน"
          style={[styles.input, {height: 100}]} // Set height as needed
          value={address}
          onChangeText={setAddress}
          multiline
          numberOfLines={3}
        />



        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <View style={{flex: 0.45}}>
            <TextInput
              placeholder="เบอร์โทรบริษัท"
              style={styles.input}
              value={officeTel}
              onChangeText={setOfficeTel}
            />
          </View>
          <View style={{flex: 0.45}}>
            <TextInput
              placeholder="เบอร์มือถือ"
              style={styles.input}
              value={mobileTel}
              onChangeText={setMobileTel}
            />
          </View>
        </View>
        <TextInput
          placeholder="เลขภาษี(ถ้ามี)"
          style={styles.input}
          value={taxID}
          onChangeText={setTaxID}
        />
        <View style={{       marginBottom: 50,}}></View>


      </View>
    );
  };
  const isButtonDisabled =
    !bizName ||
    !userName ||
    !userLastName ||
    !bizType ||
    !address ||
    !officeTel ||
    !mobileTel ||
    (bizType === 'business' && !userPosition) ||
    !taxID;
  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView style={styles.container}>{renderPage()}</ScrollView>
      <TouchableOpacity
        disabled={isButtonDisabled}
        style={[
          styles.button,
          isButtonDisabled ? styles.disabledButton : styles.enabledButton,
          {justifyContent: 'center', alignItems: 'center'},
        ]}
        onPress={handleFunction}>
        {isLoading ? (
          <ActivityIndicator size="small" color="#ffffff" />
        ) : (
          <Text style={styles.buttonText}>บันทึก</Text>
        )}
      </TouchableOpacity>
    </SafeAreaView>
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
    borderRadius: 5,
    marginVertical: 5,
    borderWidth: 0.5,
    borderColor: 'black',
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#0066C0',
    color: '#FFFFFF',
    borderRadius: 5,
    marginTop: 20,
    width: 100,
    height: 50, // Adjust as necessary
    padding: 10, // Adjust as necessary
  },
  buttonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
  enabledButton: {
    backgroundColor: '#0066C0',
    borderRadius: 5,
    marginTop: 10,
    width: '70%',
    alignSelf: 'center',
    height: 40,
    padding: 10,
    marginBottom: 10,
  },
  disabledButton: {
    backgroundColor: '#CCCCCC',
    borderRadius: 5,
    marginTop: 10,
    width: '70%',
    alignSelf: 'center',
    height: 40,
    padding: 10,
    marginBottom: 10,
  },
  title: {
    textAlign: 'center',
    color: '#333',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  modal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 20,
  },
});
