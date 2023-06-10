import DatePickerButton from '../../components/styles/DatePicker';
import {useRoute} from '@react-navigation/native';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {useQuery,useMutation} from 'react-query';
import React, {useState, useContext, useEffect, useMemo} from 'react';
import {Store} from '../../redux/Store';
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
import * as stateAction from '../../redux/Actions';
import ContractOption from 'screens/contract/contractOptions';

type FormData = {
  address: string;
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
type UpdateContractInput = {
  data: any;
  isEmulator: boolean;
};


interface ContractData {
  id: string;
  signAddress: string;
  signDate: string;
  signDateStamp: number;
  servayDate: string;
  servayDateStamp: number;
  quotationPageQty: number;
  workCheckDay: number;
  workCheckEnd: number;
  warantyTimeWork: number;
  workAfterGetDeposit: number;
  prepareDay: number;
  installingDay: number;
  finishedDay: number;
  adjustPerDay: string;
  warantyYear: number;
  deposit: number;
  offerCheck: string[];
  projectName: string;
  sellerId: string;
}
interface Customer {
  id: string;
  name: string;
}
interface Quotation {
  id: string;
  allTotal: string;
}
type Props = {
  navigation: StackNavigationProp<ParamListBase, 'CreateContractScreen'>;
  route: RouteProp<ParamListBase, 'CreateContractScreen'>;
  // onGoBack: (data: string) => void;
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

const updateContract =async (input: UpdateContractInput): Promise<void> => {
  const { data, isEmulator } = input;
  const user = auth().currentUser;
  console.log('data PUT', JSON.stringify(data))

  let url;
  if (isEmulator) {
    url = `http://${HOST_URL}:5001/workerfirebase-f1005/asia-southeast1/appUpdateContract`;
  } else {
    url = `https://asia-southeast1-workerfirebase-f1005.cloudfunctions.net/appUpdateContract`;
  }
  const response = await fetch(
    url,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user?.uid}`,
      },
      body: JSON.stringify({data}),
    },
  );
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
};
const CreateContractScreen = ({navigation}: Props) => {
  const [step1, setStep1] = useState(true);
  const [isLoadingMutation, setIsLoadingMutation] = useState(false);
  const [customer, setCustomer] = useState<Customer>({} as Customer);
  const [quotation, setQuotation] = useState<Quotation>({} as Quotation);
  const [company, setCompany] = useState('');
  const [contract, setContract] = useState<ContractData>({} as ContractData);
  const [signDate, setDateSign] = useState('');
  const [servayDate, setDateServay] = useState('');
  const route = useRoute();
  const {
    state: {
      isEmulator,
    },
    dispatch,
  }: any = useContext(Store);
  const [step3, setStep3] = useState(false);
  const {id}: any = route.params;
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
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<FormData>();

  const handleStep1Press = (hasAccount: boolean) => {
    setStep1(false);
    setHasPhoneNumber(hasAccount);
    setStep2(true);
  };
  const {mutate} = useMutation(updateContract, {
    onSuccess: data => {
      const newId = quotation.id.slice(0, 8);
      navigation.navigate('DocViewScreen', {id:newId});
    },
    onError: (error: MyError) => {
      console.error('There was a problem calling the function:', error);
      console.log(error.response);
    },
  });
  
  const handleDateSigne = (date: Date) => {
    const formattedDate = thaiDateFormatter.format(date);
    setDateSign(formattedDate);
  };

  const handleDateServay = (date: Date) => {
    const formattedDate = thaiDateFormatter.format(date);
    setDateServay(formattedDate);
  };
  const truncateText = (text: string, maxLength: number) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength - 3) + '...';
    }
    return text;
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
        dateEnd:quotation.dateEnd,
        discountValue:quotation.discountValue,
        discountName: 'percent',
        dateOffer:quotation.dateOffer,
        FCMToken: quotation.FCMToken,
        docNumber:quotation.docNumber,
        summaryAfterDiscount:quotation.summaryAfterDiscount,
        allTotal: quotation.allTotal,
        sellerSignature: quotation.sellerSignature,
        offerContract: '',
        signDate,
        servayDate,
        signAddress,

        userId: company.id,
      },
    };

    navigation.navigate('InstallmentScreen',{data: apiData})

  };

  const handleStep3Press = async() => {
    // setStep3(false);
    // setStep2(true);
    navigation.navigate('InstallmentScreen')
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
  const splitText = (text: string, maxLength: number) => {
    let splitText = '';
    let currentIndex = 0;
    let nextIndex = maxLength;

    while (currentIndex < text.length) {
      splitText += text.slice(currentIndex, nextIndex) + '\n';
      currentIndex += maxLength;
      nextIndex += maxLength;
    }

    return splitText;
  };

  const onSubmit = (data: FormData) => {

    console.log('address',(data.address))
    const apiData = {
      data: {
        id: quotation.id,
        summary: quotation.summary,
        services: quotation.services,
        customer: customer,
        vat7: quotation.vat7,
        taxValue: quotation.taxValue,
        taxName: 'vat3',
        dateEnd:quotation.dateEnd,
        discountValue:quotation.discountValue,
        discountName: 'percent',
        dateOffer:quotation.dateOffer,
        FCMToken: quotation.FCMToken,
        docNumber:quotation.docNumber,
        summaryAfterDiscount:quotation.summaryAfterDiscount,
        allTotal: quotation.allTotal,
        sellerSignature: quotation.sellerSignature,
        offerContract: '',
        signDate,
        servayDate,
        signAddress:data.address,

        userId: company.id,
      },
    };

    navigation.navigate('InstallmentScreen',{data: apiData})
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
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
 setDateServay(`${day}-${month}-${year}`)
 setDateSign(`${day}-${month}-${year}`)
 
}, [])

  return (
    <View style={styles.container}>
      {step1 && (
        <>
          <View style={styles.card}>
            <Text style={{fontSize: 16, fontWeight: 'bold', marginTop: 10}}>
              โครงการ: {contract.projectName}
            </Text>
            <Text style={{fontSize: 16, fontWeight: 'bold', marginTop: 10}}>
              ลูกค้า: {customer?.name}
            </Text>
            <Text style={{fontSize: 16, fontWeight: 'bold', marginTop: 10}}>
              ยอดรวม: {quotation?.allTotal} บาท
            </Text>
          </View>
          <View style={styles.stepContainer}>
            <Text style={styles.title}>Do you have already account?</Text>
          </View>
          <TouchableOpacity
            style={[
              styles.yesButton,
              {
                backgroundColor: errors.address ? '#ccc' : '#0073BA',
                opacity: errors.address ? 0.5 : 1,
              },
            ]}
            onPress={() => handleStep1Press(true)}
            disabled={!!errors.address}>
            <View style={styles.headerStep1Button}>
              <Text style={styles.buttonText}></Text>
              <Icon
                style={styles.icon}
                name="check"
                size={28}
                color="#19232e"
              />
              <Text style={styles.buttonText}>สำรวจหน้างานแล้ว</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.yesButton,
              {
                backgroundColor: errors.address ? '#ccc' : '#0073BA',
                opacity: errors.address ? 0.5 : 1,
              },
            ]}
            onPress={() => handleStep1Press(true)}
            disabled={!!errors.address}>
            <View style={styles.headerStep1Button}>
              <Icon
                style={styles.icon}
                name="check"
                size={28}
                color="#19232e"
              />
              <Text style={styles.buttonText}></Text>

              <Text style={styles.buttonText}>ยังไม่ได้สำรวจหน้างาน</Text>
            </View>
          </TouchableOpacity>
        </>
      )}

      {step2 && (
        <ScrollView>
          <View style={styles.card}>
            <Text style={{fontSize: 16, fontWeight: 'bold', marginTop: 10}}>
              โครงการ: {contract.projectName}
            </Text>
            <Text style={{fontSize: 16, fontWeight: 'bold', marginTop: 10}}>
              ลูกค้า: {customer.name}
            </Text>
            <Text style={{fontSize: 16, fontWeight: 'bold', marginTop: 10}}>
              ยอดรวม: {quotation.allTotal} บาท
            </Text>
          </View>
          <View style={styles.stepContainer}>
            <Text style={styles.title}>วันที่ทำสัญญา:</Text>
            <DatePickerButton
              label=""
              date="today"
              onDateSelected={handleDateSigne}
            />
            <Text style={styles.title}>สถาณที่ติดตั้งงาน:</Text>
            <Controller
              control={control}
              render={({field}) => (
                <TextInput
                  multiline
                  style={styles.input}
                  placeholder="Address"
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
            <Text style={styles.title}>วันที่วัดหน้างาน:</Text>
            <DatePickerButton
              label=""
              date="today"
              onDateSelected={handleDateServay}
            />
          </View>

          <TouchableOpacity
            style={[
              styles.submitedButton,
              {
                backgroundColor: errors.address ? '#ccc' : '#0073BA',
                opacity: errors.address ? 0.5 : 1,
              },
            ]}
            onPress={handleSubmit(onSubmit)}
            disabled={!!errors.address}>
            <View style={styles.header}>
              <Text style={styles.buttonText}></Text>

              <Text style={styles.buttonText}>ดำเนินการต่อ</Text>
              <Icon
                style={styles.icon}
                name="chevron-right"
                size={28}
                color="#19232e"
              />
            </View>
          </TouchableOpacity>

          <View style={styles.buttonPrevContainer}>
            <TouchableOpacity
              style={[styles.previousButton, styles.outlinedButton]}
              onPress={handlePrevPress}>
              <View style={styles.header}>
                <Icon
                  style={styles.iconPrev}
                  name="chevron-left"
                  size={28}
                  color="#19232e"
                />
                <Text style={[styles.buttonText, styles.outlinedButtonText]}>
                  ย้อนกลับ
                </Text>
                <Text style={styles.buttonText}></Text>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
      {step3 && (
        ''
//         <ScrollView style={styles.scrollView}>
//           <Text style={styles.title}>สรุปสัญญา:</Text>

//           <View style={styles.card3}>
//             <Text style={styles.keyAddress}>ชื่อโครงการ</Text>
//             <Text style={styles.valueAddres}>
//               {' '}
//               โครงการ{splitText(contract.projectName, 50)}
//             </Text>

//             <View style={[styles.row, styles.alternateRow]}>
//               <Text style={styles.key}>ลูกค้า:</Text>
//               <Text style={styles.value}>{customer.name}</Text>
//             </View>
//             <View style={styles.row}>
//               <Text style={styles.key}>ยอดรวม:</Text>
//               <Text style={styles.value}>{quotation.allTotal} บาท</Text>
//             </View>
//             <View style={[styles.row, styles.alternateRow]}>
//               <Text style={styles.key}>วันที่ทำสัญญา:</Text>
//               <Text style={styles.value}>{signDate}</Text>
//             </View>
//             <Text style={styles.keyAddress}>สถาณที่ติดตั้งงาน:</Text>
//             <Text style={styles.valueAddres}>{signAddress}</Text>
//             <View style={[styles.row, styles.alternateRow]}>
//               <Text style={styles.key}>วันที่วัดหน้างาน:</Text>
//               <Text style={styles.value}>{signDate}</Text>
//             </View>
//             <View style={styles.row}>
//               <Text style={styles.key}>เริ่มงานภายใน:</Text>
//               <Text style={styles.value}>{contract.workAfterGetDeposit} วัน หลังอนุมัติสัญญา </Text>
//             </View>
//             <View style={[styles.row, styles.alternateRow]}>
//               <Text style={styles.key}>ใช้เวลาเตรียมงาน:</Text>
//               <Text style={styles.value}>{contract.prepareDay} วัน</Text>
//             </View>
//             <View style={styles.row}>
//               <Text style={styles.key}>ใช้เวลาติดตั้งงาน:</Text>
//               <Text style={styles.value}>{contract.installingDay} วัน </Text>
//             </View>
//             <View style={[styles.row, styles.alternateRow]}>
//               <Text style={styles.key}>ใช้เวลาทำงานทั้งหมด:</Text>
//               <Text style={styles.value}>{contract.finishedDay} วัน</Text>
//             </View>
//             <View style={styles.row}>
//               <Text style={styles.key}>รับประกันงานติดตั้ง:</Text>
//               <Text style={styles.value}>{contract.warantyYear} เดือน </Text>
//             </View>
//             <View style={[styles.row, styles.alternateRow]}>
//               <Text style={styles.key}>ลูกค้าตรวจงานภายใน:</Text>
//               <Text style={styles.value}>{contract.offerCheck} วัน</Text>
//             </View>
//           </View>


// <View style={{justifyContent: 'center', alignItems: 'center'}}>

//           <TouchableOpacity
//             style={[
//               styles.step3Button,
//               {
//                 backgroundColor: errors.address ? '#ccc' : '#0073BA',
//                 opacity: errors.address ? 0.5 : 1,
//               },
//             ]}
//             onPress={() => handleStep3Press()}
//             disabled={!!errors.address}>
//             <View style={styles.header}>
//               <Text style={styles.buttonText}></Text>

//               <Text style={styles.buttonText}>ดำเนินการต่อ</Text>
//               <Icon
//                 style={styles.icon}
//                 name="chevron-right"
//                 size={28}
//                 color="#19232e"
//               />
//             </View>
//           </TouchableOpacity>

//           <View style={styles.buttonPrevContainer}>
//             <TouchableOpacity
//               style={[styles.previousButton, styles.outlinedButton]}
//               onPress={handlePrevPress}>
//               <View style={styles.header}>
//                 <Icon
//                   style={styles.iconPrev}
//                   name="chevron-left"
//                   size={28}
//                   color="#19232e"
//                 />

//                 <Text style={[styles.buttonText, styles.outlinedButtonText]}>
//                   ย้อนกลับ
//                 </Text>
//                 <Text style={styles.buttonText}></Text>
//               </View>
//             </TouchableOpacity>
//           </View>
//           </View>
//         </ScrollView>
      )}
    </View>
  );
};
export default CreateContractScreen;

const {width} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 30,
    // justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  stepContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
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
    paddingHorizontal: 50,
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
  outlinedButtonText: {
    color: '#0073BA',
  },
  icon: {
    color: 'white',
    marginTop: -2.5,
  },
  iconPrev: {
    color: '#0073BA',
  },
  submitedButton: {
    backgroundColor: '#0073BA',
    paddingVertical: 12,
    paddingHorizontal: 5,
    borderRadius: 5,
    height: 40,
    width: '90%',
    marginTop: 50,
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
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 3,
    padding: 20,
    marginVertical: 20,
    width: '90%',
    alignSelf: 'center',
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
    width: '95%'
  },
});