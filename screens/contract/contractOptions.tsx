import React, {useState, useContext, useEffect, useRef} from 'react';
import {
  Button,
  SafeAreaView,
  StyleSheet,
  TextInput,
  Text,
  View,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import DatePickerButton from '../../components/styles/DatePicker';
import messaging from '@react-native-firebase/messaging';
import {useMutation} from 'react-query';
import axios, {AxiosResponse, AxiosError} from 'axios';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {HOST_URL} from '@env';
import {v4 as uuidv4} from 'uuid';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp, ParamListBase} from '@react-navigation/native';
import {useRoute} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Store} from '../../redux/Store';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faChevronRight,
  faCashRegister,
  faCoins,
} from '@fortawesome/free-solid-svg-icons';
type Props = {
  navigation: StackNavigationProp<ParamListBase, 'ContractOption'>;
  route: RouteProp<ParamListBase, 'ContractOption'>;
};

const thaiDateFormatter = new Intl.DateTimeFormat('th-TH', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

interface MyError {
  response: object;
  // add other properties if necessary
}
const createContract = async ({
  data,
  isEmulator,
}: {
  data: any;
  isEmulator: boolean;
}) => {
  const user = auth().currentUser;
  let url;
  if (isEmulator) {
    url = `http://${HOST_URL}:5001/workerfirebase-f1005/asia-southeast1/createContract`;
  } else {
    url = `https://asia-southeast1-workerfirebase-f1005.cloudfunctions.net/createContract`;
  }
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${user?.uid}`,
    },
    body: JSON.stringify({data}),
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
};
const ContractOption = ({navigation}: Props) => {
  const route = useRoute();
  const {data}: any = route?.params;

  const [projectName, setProjectName] = useState('');
  const [signAddress, setSignAddress] = useState(data.data.signAddress);

  const [warantyTimeWork, setWarantyTimeWork] = useState('');
  const [workingDays, setWorkingDays] = useState('');
  const [workCheckEnd, setWorkCheckEnd] = useState('');
  const [workCheckDay, setWorkCheckDay] = useState('');
  const [installingDay, setInstallingDay] = useState('');
  const [fcnToken, setFtmToken] = useState('');
  const [isLoadingMutation, setIsLoadingMutation] = useState(false);

  const [workAfterGetDeposit, setWorkAfterGetDeposit] = useState('');
  const [prepareDay, setPrepareDay] = useState('');
  const [finishedDay, setFinishedDay] = useState('');
  const [adjustPerDay, setAdjustPerDay] = useState('');
  const [showSecondPage, setShowSecondPage] = useState(false);
  const [servayDate, setServayDate] = useState<String>('preview');
  const {updatedData, contract}: any = route.params;
  
  const {
    state: {selectedContract, isEmulator},
    dispatch,
  }: any = useContext(Store);
  const handleSubmit = async() => {
    const apiData = {
      id: uuidv4(),
      quotationId: data.data.id,
      projectName,
      signAddress:data.data.signAddress,
      warantyYear: warantyTimeWork,
      workingDays,
      workAfterGetDeposit,
      prepareDay,
      finishedDay,
      signDate:data.data.signDate,
      adjustPerDay,
      servayDate:data.data.servayDate,
      workCheckDay,
      workCheckEnd,
      installingDay,
    };
    console.log({
      projectName,
      signAddress,
      warantyYear: warantyTimeWork,
      workingDays,
      workAfterGetDeposit,
      servayDate,
      prepareDay,
      finishedDay,
      adjustPerDay,
    });
          console.log('api data',JSON.stringify(data.data));

    await mutate({data: apiData, isEmulator});
    // navigation.navigate('SelectContract', {
    //   updatedData: data,
    //   contract: apiData,
    // });
  };
  const handleStartDateSelected = (date: Date) => {
    const formattedDate = thaiDateFormatter.format(date);
    setServayDate(formattedDate);
    console.log(servayDate);
  };
  const {mutate} = useMutation(createContract, {
    onSuccess: data => {
      navigation.navigate('WebViewScreen', {id:data?.data.id});
    },
    onError: (error: MyError) => {
      console.error('There was a problem calling the function:', error);
      console.log(error.response);
    },
  });
  const handleShowSecondPage = () => {
    setShowSecondPage(true);
  };

  const handleDonePress = async () => {
    setIsLoadingMutation(true);
    try {
      const apiData = {
        data: {
          id: uuidv4(),
          quotationId: data.data.id,
          signDate: 'preview',
          signDateStamp: 11,
          deposit: 2,
          signAddress: signAddress,
          adjustPerDay: Number(adjustPerDay),
          installingDay: Number(installingDay),
          warantyYear: Number(warantyTimeWork),
          prepareDay: Number(prepareDay),
          servayDate: servayDate,
          FCMToken: fcnToken,
          // servayDateStamp: new Date().getTime(),
          quotationPageQty: 1,
          workCheckDay: Number(workCheckDay),
          workCheckEnd: workCheckEnd,
          warantyTimeWork: warantyTimeWork,
          workAfterGetDeposit: workAfterGetDeposit,
          sellerId: data.data.userId,
          finishedDay: Number(finishedDay),
          offerContract: 'preview',
          selectedContract: '',
          offerCheck: 'preview',
          projectName: projectName,
        },
        quotation: data.data,
      };

      // console.log('api data',JSON.stringify(apiData));
      await mutate({data: apiData, isEmulator});

      setIsLoadingMutation(false);
    } catch (error: Error | AxiosError | any) {
      console.error('There was a problem calling the function:', error);
      console.log(error.response);
    }
  };

  const handleHideSecondPage = () => {
    setShowSecondPage(false);
  };
  useEffect(() => {
    async function requestUserPermission() {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        console.log('Authorization status:', authStatus);
        getFCMToken();
      }
    }

    async function getFCMToken() {
      const fcmToken = await messaging().getToken();
      if (fcmToken) {
        console.log('Your Firebase Token  document:', fcmToken);
        setFtmToken(fcmToken);
      } else {
        console.log('Failed to get Firebase Token');
      }
    }
    requestUserPermission();
  }, [selectedContract]);

  console.log('route', JSON.stringify(data.data.userId));

  return (
    <SafeAreaView style={styles.containerForm}>
      {/* <View style={styles.header}>
        <Text style={styles.headerText}>สร้างข้อเสนอสัญญา</Text>
      </View> */}
      {!showSecondPage ? (
        <View style={styles.formInput}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>ชื่อโครงการ</Text>
            <TextInput
              style={styles.inputForm}
              value={projectName}
              onChangeText={setProjectName}
              placeholder="โครงการติดตั้ง..."
              placeholderTextColor="#A6A6A6"
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>รับประกันงานติดตั้งกี่ปี</Text>
            <TextInput
              style={styles.inputForm}
              value={warantyTimeWork}
              onChangeText={setWarantyTimeWork}
              placeholder="จำนวนปี"
              placeholderTextColor="#A6A6A6"
              keyboardType="numeric"
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Working Days</Text>
            <TextInput
              style={styles.inputForm}
              value={workingDays}
              onChangeText={setWorkingDays}
              placeholder="Working Days"
              placeholderTextColor="#A6A6A6"
              keyboardType="numeric"
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Installing Day</Text>
            <TextInput
              style={styles.inputForm}
              value={installingDay}
              onChangeText={setInstallingDay}
              placeholder="Installing Day"
              placeholderTextColor="#A6A6A6"
              keyboardType="numeric"
            />
          </View>
          <TouchableOpacity
            style={styles.buttonForm}
            onPress={handleShowSecondPage}>
            <View style={styles.headerForm}>
              <Text style={styles.buttonTextForm}>ต่อไป</Text>

              <FontAwesomeIcon
              style={styles.iconForm}
              icon={faChevronRight}
              size={18}
              color="white"
            />
            </View>
          </TouchableOpacity>
          {/* <Button title="Next" onPress={handleShowSecondPage} color="#007AFF" /> */}
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollViewForm}>
          <View style={styles.formInput}>
            <View style={styles.inputContainer}>
              <View style={[styles.rowForm, styles.center]}>
                <Text style={styles.label}>Work After Get Deposit</Text>
                <TextInput
                  style={[styles.inputForm, styles.smallInput]}
                  value={workAfterGetDeposit}
                  onChangeText={setWorkAfterGetDeposit}
                  placeholder="Work After Get Deposit"
                  placeholderTextColor="#A6A6A6"
                  keyboardType="numeric"
                />
                <Text style={styles.labelSuffix}>days</Text>
              </View>
            </View>

            <View style={styles.inputContainer}>
              <View style={[styles.rowForm, styles.center]}>
                <Text style={styles.label}>Prepare Days</Text>
                <TextInput
                  style={[styles.inputForm, styles.smallInput]}
                  value={prepareDay}
                  onChangeText={setPrepareDay}
                  placeholder="Prepare Days"
                  placeholderTextColor="#A6A6A6"
                  keyboardType="numeric"
                />
                <Text style={styles.labelSuffix}>days</Text>
              </View>
            </View>
            <View style={styles.inputContainer}>
              <View style={[styles.rowForm, styles.center]}>
                <Text style={styles.label}>Finished Days</Text>
                <TextInput
                  style={[styles.inputForm, styles.smallInput]}
                  value={finishedDay}
                  onChangeText={setFinishedDay}
                  placeholder="Finished Days"
                  placeholderTextColor="#A6A6A6"
                  keyboardType="numeric"
                />
                <Text style={styles.labelSuffix}>days</Text>
              </View>
            </View>
            <View style={styles.inputContainer}>
              <View style={[styles.rowForm, styles.center]}>
                <Text style={styles.label}>Work Check Day</Text>
                <TextInput
                  style={[styles.inputForm, styles.smallInput]}
                  value={workCheckDay}
                  onChangeText={setWorkCheckDay}
                  placeholder="Work Check Day"
                  placeholderTextColor="#A6A6A6"
                  keyboardType="numeric"
                />
                <Text style={styles.labelSuffix}>days</Text>
              </View>
            </View>
            <View style={styles.inputContainer}>
              <View style={[styles.rowForm, styles.center]}>
                <Text style={styles.label}>Work Check End</Text>
                <TextInput
                  style={[styles.inputForm, styles.smallInput]}
                  value={workCheckEnd}
                  onChangeText={setWorkCheckEnd}
                  placeholder="Work Check End"
                  placeholderTextColor="#A6A6A6"
                  keyboardType="numeric"
                />
                <Text style={styles.labelSuffix}>days</Text>
              </View>
            </View>
            <View style={styles.inputContainer}>
              <View style={[styles.rowForm, styles.center]}>
                <Text style={styles.label}>Adjust Per Days</Text>
                <TextInput
                  style={[styles.inputForm, styles.smallInput]}
                  value={adjustPerDay}
                  onChangeText={setAdjustPerDay}
                  placeholder="Adjust Per Days"
                  placeholderTextColor="#A6A6A6"
                  keyboardType="numeric"
                />
                <Text style={styles.labelSuffix}>days</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.submitedButtonForm}
              onPress={handleSubmit}
              disabled={isLoadingMutation}>
              <View style={styles.headerForm}>
                {isLoadingMutation ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.buttonTextForm}>สร้างเอกสาร</Text>
                )}
              </View>
            </TouchableOpacity>

            <View style={styles.buttonPrevContainerForm}>
              <TouchableOpacity
                onPress={handleHideSecondPage}
                style={[styles.previousButtonForm, styles.outlinedButtonForm]}>
                <View style={styles.headerForm}>
                  <Icon
                    style={styles.iconPrevForm}
                    name="arrow-left-thin"
                    size={28}
                    color="#19232e"
                  />

                  <Text style={[styles.buttonTextForm, styles.outlinedButtonTextForm]}>
                    ย้อนกลับ
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  containerForm: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  headerForm: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -1,
  },
  headerTextForm: {
    fontFamily: 'sukhumvit set',
    fontSize: 20,
    fontWeight: 'bold',
  },
  formInput: {
    flex: 1,
    marginTop:30
  },
  rowForm: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  labelSuffix: {
    fontFamily: 'sukhumvit set',
    fontSize: 16,
    marginLeft: 5,
  },
  outlinedButtonForm: {
    backgroundColor: 'transparent',
  },
  outlinedButtonTextForm: {
    color: '#0073BA',
  },
  roundedButton: {
    marginTop: 40,
  },
  whiteText: {
    color: '#FFFFFF',
  },
  submitButton: {
    backgroundColor: '#0073BA',
    borderRadius: 5,
    height: 50,
    justifyContent: 'center',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollViewForm: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    // fontFamily: 'sukhumvit set',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  inputForm: {
    backgroundColor: '#F5F5F5',
    borderRadius: 5,
    height: 50,
    marginLeft: 10,
    paddingHorizontal: 10,
  },
  buttonContainerForm: {
    marginTop: 20,
    // backgroundColor: '#007AFF',
    borderRadius: 5,
    height: 40,
    justifyContent: 'center',
  },
  submitedButtonForm: {
    backgroundColor: '#0073BA',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonPrevContainerForm: {
    marginTop: 20,
    borderColor: '#0073BA',
    borderWidth: 1,
    backgroundColor: 'white',
    borderRadius: 5,
    height: 40,
    justifyContent: 'center',
  },
  buttonTextForm: {
    color: '#FFFFFF',
    // fontFamily: 'sukhumvit set',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  containerBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    shadowColor: 'black',
    shadowOffset: {width: 1, height: 2},
    shadowOpacity: 0.5,
    shadowRadius: 4,
    bottom: 0,

    width: '100%',

    paddingBottom: 30,
  },
  divider: {
    borderBottomWidth: 1,
    borderColor: '#A6A6A6',
    marginTop: 1,
  },

  buttonForm: {
    backgroundColor: '#0073BA',
    paddingVertical: 12,
    paddingHorizontal: 32,
    height: 40,
    borderRadius: 5,
    marginTop: 20,
  },
  previousButtonForm: {
    borderColor: '#0073BA',
    backgroundColor: 'white',
  },
  smallInput: {
    width: '30%',
  },
  iconForm: {
    color: 'white',
    marginLeft: 10,
    marginTop: 2,
 
  },
  iconPrevForm: {
    // color: '#007AFF',
    color: '#0073BA',

    marginLeft: 10,
  },
});

export default ContractOption;
