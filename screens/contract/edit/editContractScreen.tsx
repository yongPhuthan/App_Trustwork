import DatePickerButton from '../../../components/styles/DatePicker';
import {useRoute} from '@react-navigation/native';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {useQuery, useMutation} from 'react-query';
import React, {useState, useContext, useEffect, useMemo} from 'react';
import {Store} from '../../../redux/Store';
import {
  faFile,
  faDrawPolygon,
  faCog,
  faBell,
  faChevronRight,
  faCashRegister,
  faCoins,
  faSign,
  faFileCirclePlus,
  faSignature,
} from '@fortawesome/free-solid-svg-icons';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp, ParamListBase} from '@react-navigation/native';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  FlatList,
  StyleSheet,
  TextInput,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useForm, Controller} from 'react-hook-form';
import {HOST_URL} from '@env';
import * as stateAction from '../../../redux/Actions';
import ContractOption from 'screens/contract/contractOptions';
import ContractFooter from '../../../components/styles/ContractFooter';
import SmallDivider from '../../../components/styles/SmallDivider';
import DatePickerContract from '../../../components/styles/DatePickerContract';
import{Contract, Quotation, Customer} from '../../../types/docType'
import Lottie from 'lottie-react-native';

type FormData = {
  // address: string;
};
const thaiDateFormatter = new Intl.DateTimeFormat('th-TH', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});


type Props = {
  handleDateServay: (date: Date) => void;
  handleDateSigne: (date: Date) => void;
  signDate: string;
  servayDate: string;
  projectName: string;
  customerName: string;
  allTotal: number;
  handleAddressChange:(address:string) => void;
};
const fetchContract = async ({
  id,
  isEmulator,
}: {
  id: string;
  isEmulator: boolean;
}) => {
  const user = auth().currentUser;
  if (!user) {
    throw new Error('User not authenticated');
  }
  const idToken = await user.getIdToken();

  let url;
  if (isEmulator) {
    url = `http://${HOST_URL}:5001/workerfirebase-f1005/asia-southeast1/appQueryDocAndContract`;
  } else {
    url = `https://asia-southeast1-workerfirebase-f1005.cloudfunctions.net/appQueryDocAndContract`;
  }
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify({id}),
    credentials: 'include',
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  return data;
};


const EditContractScreen = (props: Props) => {
  const [step1, setStep1] = useState(true);
  const [isLoadingMutation, setIsLoadingMutation] = useState(false);
  const [customer, setCustomer] = useState<Customer>({} as Customer);
  const [quotation, setQuotation] = useState<Quotation>({} as Quotation);
  const [company, setCompany] = useState('');
  const [contract, setContract] = useState<Contract>({}as Contract);
  // const [signDate, setDateSign] = useState('');
  // const [servayDate, setDateServay] = useState('');
  const route = useRoute();
  const {
    state: {isEmulator},
    dispatch,
  }: any = useContext(Store);
  const [step3, setStep3] = useState(false);
  const {id}: any = 'route.params';
  const [step2, setStep2] = useState(false);
  const [hasPhoneNumber, setHasPhoneNumber] = useState(false);
  const [date, setDate] = useState(new Date());
  const [signAddress, setAddress] = useState('');
  const {data, isLoading, isError} = useQuery(
    ['Contract', id],
    () => fetchContract({id, isEmulator}).then(res => res),
    {
      onSuccess: data => {
        setQuotation(data[0]);
        setCustomer(data[1]);
        setCompany(data[2]);
        setContract(data[3]);
      },
    },
  );

  const {
    handleSubmit,
    control,
    formState: {errors},
    watch,
  } = useForm();
  const address = watch('address');

  const handleStep1Press = (hasAccount: boolean) => {
    setStep1(false);
    setHasPhoneNumber(hasAccount);
    setStep2(true);
  };


  const handleStep2Press = () => {
    const apiData = {
      data: {
        id: quotation.id,
        summary: quotation.summary,
        services: quotation.services,
        customer: customer,
        vat7: quotation.vat7,
        taxValue: quotation.taxValue,
        taxName: 'vat3',
        dateEnd: quotation.dateEnd,
        discountValue: quotation.discountValue,
        discountName: 'percent',
        dateOffer: quotation.dateOffer,
        FCMToken: quotation.FCMToken,
        docNumber: quotation.docNumber,
        summaryAfterDiscount: quotation.summaryAfterDiscount,
        allTotal: quotation.allTotal,
        sellerSignature: quotation.sellerSignature,
        offerContract: '',
        signDate,
        servayDate,
        signAddress,

        userId: company.id,
      },
    };

    // navigation.navigate('InstallmentScreen', {data: apiData});
  };

  const handleStep3Press = async () => {
    // setStep3(false);
    // setStep2(true);
    // navigation.navigate('InstallmentScreen');
    // await mutate({data: { signDate, signAddress, servayDate, id:contract.id, quotationId:quotation.id}, isEmulator});
  };

  const handlePrevPress = () => {
    if (step2) {
      setStep1(true);
      setStep2(false);
    } else if (step3) {
      handleStep3Press();
    }
  };

  const handleNextPress = () => {
    if (step2) {
      handleStep2Press();
    }
  };


  const onSubmit = (data: FormData) => {
    console.log('address', data.address);
    const apiData = {
      data: {
        id: quotation.id,
        summary: quotation.summary,
        services: quotation.services,
        customer: customer,
        vat7: quotation.vat7,
        taxValue: quotation.taxValue,
        taxName: 'vat3',
        dateEnd: quotation.dateEnd,
        discountValue: quotation.discountValue,
        discountName: 'percent',
        dateOffer: quotation.dateOffer,
        FCMToken: quotation.FCMToken,
        docNumber: quotation.docNumber,
        summaryAfterDiscount: quotation.summaryAfterDiscount,
        allTotal: quotation.allTotal,
        sellerSignature: quotation.sellerSignature,
        offerContract: '',
        signDate,
        servayDate,
        signAddress: data.address, // change here

        userId: company.id,
      },
    };

    navigation.navigate('InstallmentScreen', {data: apiData});
  };

  const renderItem = ({item}: any) => (
    <View style={[styles.summaryItem, {backgroundColor: item.bgColor}]}>
      <Text style={styles.summaryKey}>{item.key}</Text>
      <Text style={styles.summaryValue}>{item.value}</Text>
    </View>
  );
  const summaryData = [
    {key: '1', value: contract.signDate, bgColor: '#f0f0f0'},
    {key: '2', value: contract.servayDate, bgColor: 'white'},
    {key: '3', value: contract.servayDateStamp, bgColor: '#f0f0f0'},
    {key: '4', value: contract.workCheckDay, bgColor: 'white'},
    {key: '5', value: contract.workCheckEnd, bgColor: '#f0f0f0'},
    {key: '6', value: contract.warantyTimeWork, bgColor: 'white'},
    {key: '7', value: contract.workAfterGetDeposit, bgColor: '#f0f0f0'},
    {key: '8', value: contract.prepareDay, bgColor: 'white'},
    {key: '9', value: contract.installingDay, bgColor: '#f0f0f0'},
    {key: '10', value: contract.finishedDay, bgColor: 'white'},
    {key: '11', value: contract.adjustPerDay, bgColor: '#f0f0f0'},
    {key: '12', value: contract.warantyYear, bgColor: 'white'},
    {key: '13', value: contract.deposit, bgColor: '#f0f0f0'},
    {key: '14', value: contract.offerCheck, bgColor: 'white'},
    {key: '15', value: contract.projectName, bgColor: '#f0f0f0'},
    {key: '16', value: contract.sellerId, bgColor: 'white'},
  ] as {key: string; value: any; bgColor: string}[];

useEffect(() => {
  if(address){
    props.handleAddressChange(address);

  }
}, [address]);
console.log('CONTRACT', JSON.stringify(contract))
  return (
    <>
    {contract && customer && quotation? (
    <View style={styles.container}>
    <ScrollView>
      {step1 && (
        <>
          <View style={styles.card}>
            <View style={{flexDirection: 'row'}}>
              <Text style={{fontSize: 16, fontWeight: 'bold', marginTop: 10}}>
                โครงการ:
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '400',
                  marginTop: 10,
                  marginLeft: 20,
                }}>
                {contract.projectName}
              </Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              <Text style={{fontSize: 16, fontWeight: 'bold', marginTop: 10}}>
                ลูกค้า:
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '400',
                  marginTop: 10,
                  marginLeft: 40,
                }}>
                {customer.name}
              </Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              <Text style={{fontSize: 16, fontWeight: 'bold', marginTop: 10}}>
                ยอดรวม:
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '400',
                  marginTop: 10,
                  marginLeft: 22,
                }}>
                {Number(quotation.allTotal)
                  .toFixed(2)
                  .replace(/\d(?=(\d{3})+\.)/g, '$&,')}{' '}
                บาท
              </Text>
            </View>
          </View>

          <View style={styles.stepContainer}>
            <SmallDivider />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '70%',
              }}>
              <Text style={styles.title}>วันที่ทำสัญญา:</Text>
              <View style={{marginTop: 10}}>
                <DatePickerContract
                  label=""
                  date="today"
                  onDateSelected={props.handleDateSigne}
                />
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '70%',
              }}>
              <Text style={styles.title}>วันที่วัดหน้างาน:</Text>

              <View style={{marginTop: 10}}>
                <DatePickerContract
                  label=""
                  date="today"
                  onDateSelected={props.handleDateServay}
                />
              </View>
            </View>
            <View style={{marginTop: 10}}></View>
            <SmallDivider />
            <View style={{marginTop: 10, alignSelf: 'flex-start'}}>
              <Text style={styles.title}>สถาณที่ติดตั้งงาน:</Text>
              <Controller
                control={control}
                render={({field}) => (
                  <TextInput
                    multiline
                    style={styles.input}
                    placeholder="Address"
                    defaultValue={contract.signAddress}
                    value={field.value}
                    onChangeText={field.onChange}
                  />
                )}
                name="address"
                rules={{required: true}}
              />
              {errors.address && (
                <Text style={styles.error}>This field is required.</Text>
              )}
            </View>
          </View>
        </>
      )}
    </ScrollView>

  </View>
    ):""}

    </>
  );
};
export default EditContractScreen;

const {width} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width,
    // justifyContent: 'center',
    backgroundColor: 'white',
  },
  stepContainer: {
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 20,
  },
  input: {
    borderWidth: 0.5,
    borderRadius: 8,
    padding: 10,
    backgroundColor: 'white',
    width: width * 0.8,
    marginBottom: 20,
    height: 100,
  },

  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    minWidth: 100,
  },
  prevButton: {
    backgroundColor: '#aaa',
  },
  nextButton: {
    backgroundColor: '#4CD964',
  },
  buttonPrevContainer: {
    marginTop: 20,
    borderColor: '#0073BA',
    borderWidth: 1,
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 5,
    marginBottom: 10,
    height: 40,
    justifyContent: 'center',
  },
  buttonGoContainer: {
    marginTop: 20,
    borderWidth: 1,
    width: '90%',
    backgroundColor: '#007AFF',
    borderRadius: 5,
    height: 40,
    justifyContent: 'center',
  },
  previousButton: {
    borderColor: '#0073BA',
    backgroundColor: 'white',
  },
  outlinedButton: {
    backgroundColor: 'transparent',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: -1,
  },
  headerStep1Button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  submitedButton: {
    backgroundColor: '#0073BA',
    paddingVertical: 12,
    paddingHorizontal: 5,
    borderRadius: 5,
    height: 40,
  },
  yesButton: {
    backgroundColor: '#0073BA',
    paddingVertical: 12,
    paddingHorizontal: 5,
    borderRadius: 5,
    height: 50,
    width: '80%',
    marginTop: 30,
  },
  step3Button: {
    backgroundColor: '#0073BA',
    paddingVertical: 12,
    paddingHorizontal: 5,
    borderRadius: 5,
    marginTop: 20,
    height: 40,
    width: '80%',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
  error: {
    color: 'red',
    fontSize: 12,
    marginVertical: 5,
  },
  summaryList: {
    width: '80%',
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
  summaryKey: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  summaryValue: {
    fontSize: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 5,
    // elevation: 3,
    // shadowColor: '#000',
    // shadowOffset: {width: 0, height: 2},
    // shadowOpacity: 0.3,
    // shadowRadius: 3,
    padding: 20,
    marginVertical: 10,
    width: '80%',
    alignSelf: 'baseline',
  },
  card3: {
    backgroundColor: '#ffffff',
    borderRadius: 5,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 3,
    padding: 20,
    marginVertical: 15,
    width: '95%',
    alignSelf: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  alternateRow: {
    backgroundColor: '#f5f5f5',
  },
  key: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  value: {
    fontSize: 16,
  },
  valueAddres: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  keyAddress: {
    paddingHorizontal: 10,
    fontWeight: 'bold',
    paddingVertical: 15,
    fontSize: 16,
  },
  scrollView: {
    width: '95%',
  },
});
