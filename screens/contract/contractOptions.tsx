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
import SmallDivider from '../../components/styles/SmallDivider';
import ContractFooter from '../../components/styles/ContractFooter';
import CreateContractScreen from './createContractScreen';
import Installment from '../../components/installment';
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
// const ContractOption = ({navigation}: Props) => {
const ContractOption = ({navigation}: Props) => {
  const route = useRoute();
  const data: any = route?.params;

  const [projectName, setProjectName] = useState('');
  const [signDate, setDateSign] = useState('');
  const [servayDate, setDateServay] = useState('');
  const [warantyTimeWork, setWarantyTimeWork] = useState(0);
  const [workingDays, setWorkingDays] = useState(0);
  const [workCheckEnd, setWorkCheckEnd] = useState(0);
  const [workCheckDay, setWorkCheckDay] = useState(0);
  const [installingDay, setInstallingDay] = useState(0);
  const [fcnToken, setFtmToken] = useState('');
  const [isLoadingMutation, setIsLoadingMutation] = useState(false);
  const [step, setStep] = useState(1);
  const [stepData, setStepData] = useState({});

  const [workAfterGetDeposit, setWorkAfterGetDeposit] = useState(0);
  const [prepareDay, setPrepareDay] = useState(0);
  const [finishedDay, setFinishedDay] = useState(0);
  const [adjustPerDay, setAdjustPerDay] = useState(0);
  const [showSecondPage, setShowSecondPage] = useState(false);
  // const {updatedData, contract}: any = route.params;
  const [address, setAddress] = useState('');

  const handleAddressChange = (newAddress: string) => {
    setAddress(newAddress);
  };
  const updateInstallmentData = (
    percentage: number,
    details: string,
    index: number,
  ) => {
    setStepData(prevState => ({
      ...prevState,
      [`percentage_${index}`]: percentage,
      [`details_${index}`]: details,
    }));
  };

  const {
    state: {selectedContract, isEmulator},
    dispatch,
  }: any = useContext(Store);
  const handleSubmit = async () => {
    const apiData = {
      id: uuidv4(),
      quotationId: data.data.id,
      projectName,
      signAddress: data.data.signAddress,
      warantyYear: warantyTimeWork,
      workingDays,
      workAfterGetDeposit,
      prepareDay,
      finishedDay,
      signDate: data.data.signDate,
      adjustPerDay,
      servayDate: data.data.servayDate,
      workCheckDay,
      workCheckEnd,
      installingDay,
    };
    console.log({
      projectName,
      warantyYear: warantyTimeWork,
      workingDays,
      workAfterGetDeposit,
      servayDate,
      prepareDay,
      finishedDay,
      adjustPerDay,
    });
    console.log('api data', JSON.stringify(data.data));

    // await mutate({data: apiData, isEmulator});
  };
  const handleStartDateSelected = (date: Date) => {
    const formattedDate = thaiDateFormatter.format(date);
    // setServayDate(formattedDate);
    console.log(servayDate);
  };
  // const {mutate} = useMutation(createContract, {
  //   onSuccess: data => {
  //     navigation.navigate('WebViewScreen', {id: data?.data.id});
  //   },
  //   onError: (error: MyError) => {
  //     console.error('There was a problem calling the function:', error);
  //     console.log(error.response);
  //   },
  // });

  const handleShowSecondPage = () => {
    setShowSecondPage(true);
  };

  const handleDateSigne = (date: Date) => {
    const formattedDate = thaiDateFormatter.format(date);
    setDateSign(formattedDate);
  };

  const handleDateServay = (date: Date) => {
    const formattedDate = thaiDateFormatter.format(date);
    setDateServay(formattedDate);
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

      console.log('api data', JSON.stringify(apiData));
      // await mutate({data: apiData, isEmulator});

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

  useEffect(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    setDateServay(`${day}-${month}-${year}`);
    setDateSign(`${day}-${month}-${year}`);
  }, []);

  const handleNextPress = () => {
    if (step < 3) {
      setStep(step + 1);
    }
    // Validate the inputs for step 2 and step 3 here in a similar way.
  };

  const handleBackPress = () => {
    // If it's not the first step, decrement the step.
    if (step > 1) {
      setStep(step - 1);
    }
  };
  console.log('data', JSON.stringify(route.params));

  const fieldsAreEmpty = () => {
    if (step === 1) {
      return (
        projectName === '' ||
        warantyTimeWork === '' ||
        workingDays === '' ||
        installingDay === '' ||
        workAfterGetDeposit === '' ||
        prepareDay === '' ||
        finishedDay === '' ||
        workCheckDay === '' ||
        workCheckEnd === '' ||
        adjustPerDay === ''
      );
    } else if (step === 2) {
      return address === '';
    }
  };

  console.log('signDATE', signDate);

  return (
    <>
      <SafeAreaView style={{flex: 1}}>
        {step === 1 && (
          <ScrollView style={styles.containerForm}>
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
              <SmallDivider />

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: 10,
                }}>
                <Text style={styles.label}>รับประกันงานติดตั้งกี่ปี</Text>
                <View style={styles.inputContainerForm}>
                  <TextInput
                    style={{width: 30}}
                    value={warantyTimeWork}
                    onChangeText={setWarantyTimeWork}
                    // placeholder="จำนวนปี"
                    placeholderTextColor="#A6A6A6"
                    keyboardType="numeric"
                  />
                  <Text style={styles.inputSuffix}>ปี</Text>
                </View>
              </View>
              <SmallDivider />
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: 10,
                }}>
                <Text style={styles.label}>Working Days</Text>
                <View style={styles.inputContainerForm}>
                  <TextInput
                    style={{width: 30}}
                    value={Number(workingDays)}
                    onChangeText={text => setWorkingDays(Number(text))}

                    // placeholder="Working Days"
                    placeholderTextColor="#A6A6A6"
                    keyboardType="numeric"
                  />
                  <Text style={styles.inputSuffix}>วัน</Text>
                </View>
              </View>
              <SmallDivider />
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: 10,
                }}>
                <Text style={styles.label}>Installing Day</Text>

                <View style={styles.inputContainerForm}>
                  <TextInput
                    style={{width: 30}}
                    value={installingDay}
                    onChangeText={text => setInstallingDay(Number(text))}
                    placeholderTextColor="#A6A6A6"
                    keyboardType="numeric"
                  />
                  <Text style={styles.inputSuffix}>วัน</Text>
                </View>
              </View>
              <SmallDivider />
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: 10,
                }}>
                <Text style={styles.label}>Work After Get Deposit</Text>

                <View style={styles.inputContainerForm}>
                  <TextInput
                    style={{width: 30}}
                    value={workAfterGetDeposit}
                    onChangeText={text => setWorkAfterGetDeposit(Number(text))}

                    keyboardType="numeric"
                  />
                  <Text style={styles.inputSuffix}>วัน</Text>
                </View>
              </View>
              <SmallDivider />
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: 10,
                }}>
                <Text style={styles.label}>Prepare Days</Text>

                <View style={styles.inputContainerForm}>
                  <TextInput
                    style={{width: 30}}
                    value={prepareDay}
                    onChangeText={text => setPrepareDay(Number(text))}

                    keyboardType="numeric"
                  />
                  <Text style={styles.inputSuffix}>วัน</Text>
                </View>
              </View>
              <SmallDivider />
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: 10,
                }}>
                <Text style={styles.label}>Finished Days</Text>

                <View style={styles.inputContainerForm}>
                  <TextInput
                    style={{width: 30}}
                    value={finishedDay}
                    onChangeText={text => setFinishedDay(Number(text))}

                    keyboardType="numeric"
                  />
                  <Text style={styles.inputSuffix}>วัน</Text>
                </View>
              </View>
              <SmallDivider />
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: 10,
                }}>
                <Text style={styles.label}>Work Check Day</Text>

                <View style={styles.inputContainerForm}>
                  <TextInput
                    style={{width: 30}}
                    value={workCheckDay}
                    onChangeText={text => setWorkCheckDay(Number(text))}

                  
                    keyboardType="numeric"
                  />
                  <Text style={styles.inputSuffix}>วัน</Text>
                </View>
              </View>
              <SmallDivider />
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: 10,
                }}>
                <Text style={styles.label}>Work Check End</Text>

                <View style={styles.inputContainerForm}>
                  <TextInput
                    style={{width: 30}}
                    value={workCheckEnd}
                    onChangeText={text => setWorkCheckEnd(Number(text))}

                  
                    keyboardType="numeric"
                  />
                  <Text style={styles.inputSuffix}>วัน</Text>
                </View>
              </View>
              <SmallDivider />
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: 10,
                  marginBottom: 30,
                }}>
                <Text style={styles.label}>Adjust Per Days</Text>

                <View style={styles.inputContainerForm}>
                  <TextInput
                    style={{width: 30}}
                    value={adjustPerDay}
               
                    onChangeText={text => setAdjustPerDay(Number(text))}

                    keyboardType="numeric"
                  />
                  <Text style={styles.inputSuffix}>วัน</Text>
                </View>
              </View>
              <SmallDivider />

              {/* <TouchableOpacity
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
          </TouchableOpacity> */}
            </View>
          </ScrollView>
        )}

        {step === 2 && (
          <>
            <CreateContractScreen
              handleAddressChange={handleAddressChange} // make sure to pass the function as a prop
              handleDateServay={handleDateServay}
              handleDateSigne={handleDateSigne}
              signDate={servayDate}
              servayDate={servayDate}
              projectName={projectName}
              customerName={data.customerName}
              allTotal={data.allTotal}
            />
          </>
        )}
        {step === 3 && (
          <>
            <Installment
              handleBackPress={handleBackPress}
              data={{
                projectName,
                warantyYear: Number(warantyTimeWork),
                warantyTimeWork: Number(warantyTimeWork),
                workingDays,
                installingDay: Number(installingDay),
                adjustPerDay: Number(adjustPerDay),
                workAfterGetDeposit: Number(workAfterGetDeposit),
                signDate,
                servayDate,
                prepareDay: Number(prepareDay),
                finishedDay: Number(finishedDay),
                workCheckDay: Number(workCheckDay),
                workCheckEnd: Number(workCheckEnd),
                total: Number(data.allTotal),
                signAddress: address,
                quotationId: data.id,
                sellerId: data.sellerId,
              }}
            />
          </>
        )}
        {step !== 3 && (
          <ContractFooter
            finalStep={false}
            // finalStep={step === 3}
            onBack={handleBackPress}
            onNext={handleNextPress}
            isLoading={false}
            disabled={fieldsAreEmpty()}
          />
        )}
      </SafeAreaView>
    </>
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
    marginTop: 30,
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
  inputContainerForm: {
    marginBottom: 10,
    borderWidth: 0.5,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 15,
    width: 80,
  },
  label: {
    // fontFamily: 'sukhumvit set',
    fontSize: 16,
    fontWeight: '400',
    marginTop: 15,
    marginBottom: 10,
  },
  inputForm: {
    // backgroundColor: '#F5F5F5',
    borderRadius: 8,
    borderWidth: 0.5,

    height: 50,

    paddingHorizontal: 10,
  },
  inputPrefix: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inputSuffix: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
  },
  inputFormRight: {
    flex: 1,
    // backgroundColor: '#F5F5F5',
    borderRadius: 5,
    borderWidth: 1,
    minHeight: 50,
    minWidth: 200,
    height: 500,

    width: 50,
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
