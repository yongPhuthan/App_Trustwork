import React, {useState, useContext, useEffect, useRef} from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import CardAudit from '../components/CardAudit';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp, ParamListBase} from '@react-navigation/native';
import {ScrollView} from 'react-native-gesture-handler';
import {useRoute} from '@react-navigation/native';
import {Store} from '../redux/Store';
import * as stateAction from '../redux/Actions';
import {useMutation} from 'react-query';
import axios, {AxiosResponse, AxiosError} from 'axios';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {HOST_URL} from '@env';
import {v4 as uuidv4} from 'uuid';

type Props = {
  navigation: StackNavigationProp<ParamListBase, 'EditContract'>;
  route: RouteProp<ParamListBase, 'EditContract'>;
  // onGoBack: (data: string) => void;
};
type Contract = {
  title: string;
  description: string;
  price: number;
  imageUri: string;
  id: number;
  number: number;
};

interface MyError {
  response: object;
  // add other properties if necessary
}
const contracts: Contract[] = [
  {
    id: 1,
    number:101,
    title: 'Con 1',
    description: 'This is the description of Audit 1',
    price: 300,
    imageUri: 'https://images.unsplash.com/photo-1542057222-14988252f3fa',
  },
  {
    id: 2,
    number:102,
    title: 'Audit 2',
    description: 'This is the description of Audit 2',
    price: 250,
    imageUri: 'https://images.unsplash.com/photo-1556228724-4da03d9f6bf4',
  },
  {
    id: 3,
    number:103,
    title: 'Audit 3',
    description: 'This is the description of Audit 3',
    price: 350,
    imageUri: 'https://images.unsplash.com/photo-1573497497889-573cf1d9041a',
  },
];

const createContract = async (data: any) => {
  const user = auth().currentUser;

  const response = await fetch(
    `http://${HOST_URL}:5001/workerfirebase-f1005/asia-southeast1/createContract`,
    {
      method: 'POST',
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

const EditContract = ({navigation}: Props) => {
  const [selectedContracts, setSelectedContracts] = useState<Contract[]>([]);
  const {
    state: {selectedContract},
    dispatch,
  }: any = useContext(Store);
  const route = useRoute();

  const {id, totalPrice, sellerId}: any = route.params;
  const [isLoadingMutation, setIsLoadingMutation] = useState(false);

  const handleSelectContract = (contract: Contract) => {
    const existingIndex = selectedContracts.findIndex(
      a => a.title === contract.title,
    );
    if (existingIndex !== -1) {
      // if the audit is already selected, remove it
      setSelectedContracts(
        selectedContracts.filter(a => a.title !== contract.title),
      );
      dispatch(stateAction.remove_selected_contract(contract));
    } else {
      // if the audit is not selected, add it
      setSelectedContracts([...selectedContracts, contract]);
      dispatch(stateAction.selected_contract(contract));
    }

  };

  const {mutate} = useMutation(createContract, {
    onSuccess: data => {
      const newId = id.slice(0, 8);
      navigation.navigate('WebViewScreen', {newId});
    },
    onError: (error: MyError) => {
      console.error('There was a problem calling the function:', error);
      console.log(error.response);
    },
  });

  const handleDonePress = async () => {
    if (selectedContracts.length > 0) {
      setIsLoadingMutation(true);
      try {
        const apiData = {
          data: {
            id: uuidv4(),
            quotationId: id,
            signDate: 'preview',
            signDateStamp: 11,
            deposit: 2,
            signAddress: 'preview',
            adjustPerDay: 1,
            installingDay: 2,
            warantyYear: 1,
            prepareDay: 21,
            servayDate: 'preview',
            servayDateStamp: 11,
            quotationPageQty: 1,
            workCheckDay: 1,
            workCheckEnd: 1,
            warantyTimeWork: 1,
            workAfterGetDeposit: 15,
            sellerId,
            finishedDay: 15,
            offerContract: 'preview',
            selectedContract: selectedContracts,
            offerCheck: 'preview',
            projectName: 'ประตูบานเฟี้ยมอลูมิเนียม',
          },
        };

        // console.log('api data',JSON.stringify(apiData));
        await mutate(apiData);

        setIsLoadingMutation(false);
      } catch (error: Error | AxiosError | any) {
        console.error('There was a problem calling the function:', error);
        console.log(error.response);
      }
    }
  };

  useEffect(() => {
    if (selectedContract.length > 0) {
      setSelectedContracts(selectedContract);
    }
  }, [selectedContract]);

  // Create a new array of audits with the `defaultChecked` prop set
  const contractsWithChecked = contracts.map(contract => ({
    ...contract,
    defaultChecked: selectedContracts.some(a => a.id === contract.id),
  }));

  return (
    <View style={{flex: 1}}>
      <ScrollView style={styles.container}>
        <View style={styles.contentContainer}>
          <View style={styles.headerContainer}>
            <Text style={styles.headerTitle}>Select Contracts</Text>
          </View>

          <View style={styles.contractListContainer}>
            {contractsWithChecked.map((contract, index) => (
              <CardAudit
                key={index}
                title={contract.title}
                description={contract.description}
                price={contract.price}
                defaultChecked={contract.defaultChecked}
                imageUri={contract.imageUri}
                onPress={() => handleSelectContract(contract)}
              />
            ))}
          </View>
          {/* problem here */}
        </View>
      </ScrollView>
      {/* Done button */}
      {selectedContracts.length > 0 && (
        <View style={styles.containerBtn}>
          <TouchableOpacity onPress={handleDonePress} style={styles.button}>
            <Text
              style={
                styles.buttonText
              }>{`สร้างเอกสาร + (${selectedContracts.length})สัญญา`}</Text>
          </TouchableOpacity>
        </View>
      )}
      {/* Done button */}
    </View>
  );
};

export default EditContract;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  contentContainer: {
    flex: 1,
    padding: 20,
  },
  headerContainer: {
    backgroundColor: '#EDEDED',
    padding: 10,
    marginBottom: 30,
    borderRadius: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#323232',
    marginBottom: 10,
  },
  titleContainer: {
    flexDirection: 'column',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#323232',
  },
  description: {
    fontSize: 16,
    color: '#323232',
    marginTop: 5,
  },
  contractListContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  cardAudit: {
    height: 200, // Set a fixed height for the CardAudit component
    marginBottom: 20,
  },
  buttonContainer: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    alignSelf: 'flex-start',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
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
  button: {
    width: '90%',
    top: '30%',
    height: 50,
    backgroundColor: '#0073BA',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
