import {StyleSheet, View, Text, Button} from 'react-native';
import React, {useState, useContext, useEffect, useMemo} from 'react';
import CardDashBoard from '../components/CardDashBoard';
import {FlatList, TouchableOpacity} from 'react-native-gesture-handler';
import FooterBtn from '../components/styles/FooterBtn';
import NewCustomerBtn from '../components/styles/NewCustomerBtn';
import auth from '@react-native-firebase/auth';
import {HOST_URL} from '@env';
import {StackNavigationProp} from '@react-navigation/stack';
import {Store} from '../redux/Store';
import {FAB} from 'react-native-paper';
import * as stateAction from '../redux/Actions';
import Modal from 'react-native-modal';
import CardApprovedDashBoard from '../components/CardApprovedDashBoard';
import messaging from '@react-native-firebase/messaging';
import CreateContractScreen from './contract/createContractScreen';
import { allTotal } from '../redux/Actions';

type Props = {};
interface Quotation {
  id: string;
  allTotal: number;
  dateOffer: string;
  status: string;
  docNumber: string;
  customer: {
    name: string;
  };
}

interface DashboardState {
  isExtended: boolean;
  companyData: any;
  quotationData: Quotation[] | null; // annotation for quotationData
}
interface DashboardScreenProps {
  navigation: StackNavigationProp<RootStackParamList, 'Dashboard'>;
}
type RootStackParamList = {
  Quotation: undefined;
  EditQuotationScreen: {id: string};
  QuotationScreen: undefined;
  WebViewScreen: {id: string};
  EditQuotation: {id: string};
  CreateContractScreen: {id: string};
  Dashboard: undefined;
  ContractSteps:undefined
  ContractOptions:{id: string, customerName:string, allTotal :number,sellerId:string,};
};

const ContractDashBoard = ({navigation}: DashboardScreenProps) => {
  const [isExtended, setIsExtended] = React.useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedQuotation, setSelectedQuotation] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);

  const handleModalClose = () => {
    setShowModal(false); // Step 4
  };
  const {
    state: {isEmulator},
    dispatch,
  }: any = useContext(Store);
  const [companyData, setCompanyData] = useState(null);
  const [quotationData, setQuotationData] = useState<Quotation[] | null>(null);
  const fabStyle = {width: 50};
  const handleFABPress = () => {
    // Do something when FAB is pressed
  };
  const handleSelectScreen = (id: string) => {
    setSelectedItemId(id);
    setModalVisible(true);
  };

  const fetchDashboardData = async (email: string, authToken: string) => {
    let url;
    if (isEmulator) {
      url = `http://${HOST_URL}:5001/workerfirebase-f1005/asia-southeast1/queryContractDashBoard`;
    } else {
      url = `https://asia-southeast1-workerfirebase-f1005.cloudfunctions.net/queryContractDashBoard`;
    }
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
      }),
    });
    const data = await response.json();

    return data;
  };
  const getTokenAndEmail = async () => {
    const currentUser = auth().currentUser;
    if (currentUser) {
      const token = await currentUser.getIdToken();
      const email = currentUser.email;
      return {token, email};
    } else {
      // User is not logged in
      return null;
    }
  };
  useEffect(() => {
    // messaging().onNotificationOpenedApp(remoteMessage => {
    //   console.log(
    //     'Notification caused app to open from background state:',
    //     remoteMessage.notification,
    //   );
    // })
    // messaging()
    // .getInitialNotification()
    // .then(remoteMessage => {
    //   if (remoteMessage) {
    //     console.log(
    //       'Notification caused app to open from quit state:',
    //       remoteMessage.notification,
    //     );
    //   }
    // }
    // )
    // async function requestUserPermission() {
    //   const authStatus = await messaging().requestPermission();
    //   const enabled =
    //     authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    //     authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    //   if (enabled) {
    //     console.log('Authorization status:', authStatus);
    //     getFCMToken();
    //   }
    // }

    // async function getFCMToken() {
    //   const fcmToken = await messaging().getToken();
    //   if (fcmToken) {
    //     console.log('Your Firebase Token is 5555:', fcmToken);
    //   } else {
    //     console.log('Failed to get Firebase Token');
    //   }
    // }

    const fetchData = async () => {
      const user = await getTokenAndEmail();
      if (user) {
        const {token, email} = user;
        if (email && token) {
          const data = await fetchDashboardData(email, token);
          setCompanyData(data[0]);
          setQuotationData(data[1]);
        }
      }
    };
    fetchData();
    // requestUserPermission();
  }, []);

  const handleYesResponse = () => {
    // navigation.navigate('CreateContractScreen', {
    //   id: selectedItemId,
    // });
    console.log('data navigate',quotationData[0]?.id,quotationData[0]?.customer?.name)
        navigation.navigate('ContractOptions',{
          id: quotationData[0]?.id,
          sellerId: companyData.id,
          allTotal:quotationData[0]?.allTotal,
          customerName:quotationData[0]?.customer?.name
        });
    setModalVisible(false);
  };

  // const handleSelectScreen = (id: string) => {
  //   navigation.navigate('CreateContractScreen', {
  //     id,
  //   });
  // };
  const handleCloseResponse = () => {
    setModalVisible(false);
  };
  const handleNoResponse = () => {
    setModalVisible(false);
  };

 

  // const requestUserPermission = async () => {
  //   const authStatus = await messaging().requestPermission();
  //   const enabled =
  //     authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
  //     authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  //   if (enabled) {
  //     console.log('Authorization status:', authStatus);
  //   }
  // };
  console.log('ID SELLER', companyData?.id)

  const renderItem = ({item}: {item: Quotation}) => (
    <>
      <View>
        <View>
          <CardApprovedDashBoard
            onPress={() => handleSelectScreen(item.id)}
            status={item.status}
            date={item.dateOffer}
            price={item.allTotal}
            customerName={item.customer?.name}
            description={'quotation.'}
            unit={'quotation.'}
          />
        </View>
      </View>
      <Modal style={styles.modalContainer} onBackdropPress={handleCloseResponse} isVisible={isModalVisible}>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text style={styles.modalText}>ท่านได้นัดลูกค้าเข้าดูพื้นที่หน้างานโครงการนี้แล้วหรือยัง ?
          </Text>
          <TouchableOpacity style={styles.button}  onPress={handleYesResponse} >
           <Text style={styles.whiteText}> ดูหน้างานแล้ว</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}  onPress={handleNoResponse} >
           <Text style={styles.whiteText}>ยังไม่ได้ดูหน้างาน</Text>
          </TouchableOpacity>

                    <Text style={styles.RedText}> *จำเป็นต้องดูหน้างานก่อนเริ่มทำสัญญา</Text>

        </View>

      </Modal>

    </>
  );

  return (
    <View style={{flex: 1}}>
      <FlatList
        data={quotationData}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
      {/* <NewCustomerBtn
    handlePress={()=>handleNewQuotationPress()}
    /> */}
    </View>
  );
};

export default ContractDashBoard;

const styles = StyleSheet.create({
  container: {
    padding: 30,
  },
  fabStyle: {
    bottom: 20,
    right: 20,
    position: 'absolute',
    color: 'white',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 10,
    backgroundColor: '#0050f0',
    borderRadius: 28,
    height: 56,
    width: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabIcon: {
    color: 'white',
  },
  modalContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center'
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%'
  },
  selectedQuotationText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  closeButtonText: {
    fontSize: 20,
    borderBottomWidth: 1,
    borderColor: 'white',
    paddingBottom: 10,
    paddingTop: 10,
    fontWeight: 'bold',
    fontFamily: 'Sukhumvit set',
  },
  deleteButtonText: {
    fontSize: 18,
    borderBottomWidth: 1,
    fontWeight: 'bold',
    textDecorationColor: 'red',
    color: 'red',
    borderColor: 'white',
    paddingBottom: 10,
    fontFamily: 'Sukhumvit set',
    paddingTop: 10,
  },
  button: {
    backgroundColor: '#0073BA',
    paddingVertical: 12,
    paddingHorizontal: 32,
    height: 50,
    width:250,
    borderRadius: 5,
    marginTop: 20,
  },
  whiteText: {
    color: '#FFFFFF',
    fontSize:16,
    fontWeight:'500',
    alignSelf:'center'
  },
  RedText: {
  marginTop:10,
    fontSize:14,
    alignSelf:'center'
  },

});
