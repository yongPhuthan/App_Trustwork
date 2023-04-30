import {
  StyleSheet,
  Dimensions,
  Text,
  View,
  Touchable,
  TouchableOpacity,
} from 'react-native';
import React, {useState, useContext, useEffect, useRef} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import AddServices from './AddServices';
import {Store} from '../redux/Store';

type Props = {
  serviceList: {
    title: string;
    description: string;
    unitPrice: number;
    qty: number;
    total: number;
  };
  handleEditService: Function;

};
const windowWidth = Dimensions.get('window').width;

const CardProject = (props: Props) => {
  const {serviceList} = props;

  return (
    <View>
      <TouchableOpacity
        style={styles.subContainer}
        onPress={()=>props.handleEditService()}>
        <View style={styles.summary}>
          <Text style={styles.summaryText}>{serviceList.title}</Text>
          <Text style={styles.summaryPrice}>{serviceList.total}</Text>
        </View>
        <View style={styles.description}>
          <Text>{serviceList.description}</Text>
          <Text></Text>
        </View>
        <View style={styles.unitPrice}>
          <Text>{serviceList.unitPrice}</Text>
          <Text> x</Text>
          <Text> {serviceList.qty}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default CardProject;

const styles = StyleSheet.create({
  subContainer: {
    backgroundColor: '#ffffff',
    padding: 50,
    marginBottom: 20,

    height: 'auto',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginVertical: 10,
    paddingHorizontal: 30,
    paddingVertical: 30,
  },
  summary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  description: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  },
  summaryPrice: {
    fontSize: 18,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    marginTop: 30,
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  label: {
    fontSize: 16,
    color: '#19232e',
  },
});
