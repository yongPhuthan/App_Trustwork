import {
  StyleSheet,
  Dimensions,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faFile, faDrawPolygon, faCog, faBell,faChevronRight, faCashRegister, faCoins} from '@fortawesome/free-solid-svg-icons';
type Props = {
  customerName: string;
  price: number;
  unit: string;
  onPress: Function;
  description: string;
  date: string;
  status: any;
};

const windowWidth = Dimensions.get('window').width;

const CardApprovedDashBoard = (props: Props) => {
  return (
    <View style={styles.subContainer}>
      <View style={styles.summary}>
        <Text style={styles.summaryText}>{props.customerName}</Text>
        <Text style={styles.summaryPrice}>{props.price}บาท</Text>

      </View>


      <View style={styles.telAndTax}>
      <View
        style={{
          backgroundColor:
            props.status === 'pending'
              ? '#ccc'
              : props.status === 'approved'
              ? '#43a047'
              : props.status === 'signed'
              ? '#2196f3'
              : '#ccc',
          borderRadius: 4,
          paddingHorizontal: 8,
          paddingVertical: 4,
          marginTop: 8,
          alignSelf: 'flex-start',
        }}>
        <Text
          style={{
            color: props.status === 'pending' ? '#000' : '#fff',
            fontSize: 12,
            fontWeight: 'bold',
            textTransform: 'uppercase',
          }}>
          {props.status === 'pending'
            ? 'รออนุมัติ'
            : props.status === 'approved'
            ? 'อนุมัติแล้ว'
            : props.status === 'signed'
            ? 'เซ็นเอกสารแล้ว'
            : 'รออนุมัติ'}
        </Text>
      </View>
      <View style={{   marginTop: 8,}}>
      <Text>วันที่อนุมัติ {props.date}</Text>

      </View>
      </View>
      <TouchableOpacity style={styles.button} onPress={() => props.onPress()}>
        <View style={styles.header}>
          <Text style={styles.buttonText}>เริ่มทำสัญญา</Text>
          <FontAwesomeIcon style={styles.iconButton} icon={faChevronRight} size={24} color="white" />

      

        </View>
      </TouchableOpacity>
    </View>
  );
};

export default CardApprovedDashBoard;

const styles = StyleSheet.create({
  subContainer: {
    backgroundColor: '#ffffff',
    marginBottom: 10,
    marginTop: 10,
    height: 'auto',
    borderColor: '#ccc',
    marginVertical: 10,
    paddingHorizontal: 10,
    paddingVertical: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 5,
  },
  summary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  description: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  telAndTax: {
    flexDirection: 'row',
    width: '90%',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  unitPrice: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: windowWidth * 0.2,
    marginTop: 10,
  },
  subummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryText: {
    fontSize: 16,
    width: '60%',
  },
  summaryPrice: {
    fontSize: 18,
    width: '30%',
  },
  icon: {
    width: '10%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  status: {
    backgroundColor: '#43a047',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  button: {
    width: '99%',
marginTop:30,
    height: 40,
    // backgroundColor: '#0073BA',
    backgroundColor: '#ec7211',

    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
    marginTop: 1,
  },
  iconButton: {
    color: 'white',
    marginLeft: 10,
  },
});
