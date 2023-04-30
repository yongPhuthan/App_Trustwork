import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Input, Button } from 'react-native-elements';
import {StackNavigationProp} from '@react-navigation/stack';

import { useNavigation, useRoute } from '@react-navigation/native';
type RootStackParamList = {
    Quotation: undefined;
    ContactInfoScreen: {
      bizName: string;
      userName: string;
      userLastName: string;
      address: string;
      bizType: string;
      logo: string | null;
      signature: string | null;
      companyNumber: string;
      bankaccount: object;
      conditions: string;
      officeTel:string
    };
    AddProductForm: undefined;
    EditProductForm: undefined;
    CompanyUserFormScreen:undefined;
    // Profile: { userId: string };
  };
  interface props {
    navigation: StackNavigationProp<RootStackParamList, 'ContactInfoScreen'>;
  
  }

const ContactInfoScreen = ({navigation}: props) => {
  const route = useRoute();
  
  const [mobileTel, setMobileTel] = useState('');
  const [bizType, setBizType] = useState('');
  const [companyNumber, setCompanyNumber] = useState('');
  const [bankaccount, setBankaccount] = useState();
  const [conditions, setConditions] = useState('');

  const handleSave = () => {
    const { bizName, userName, userLastName, address, officeTel, logo, signature } = route.params as RootStackParamList['ContactInfoScreen'];

    const newCompanyUser = {
      bizName,
      userName,
      userLastName,
      address,
      officeTel,
      mobileTel,
      bizType,
      logo,
      signature,
      companyNumber,
      bankaccount,
      conditions,
    };

    // Save the new company user to the database or API using a fetch or axios request

    // Navigate to the next screen or go back to the previous screen
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Contact Information</Text>
      <Input
        label="Mobile Phone"
        value={mobileTel}
        onChangeText={setMobileTel}
      />
      <Input
        label="Business Type"
        value={bizType}
        onChangeText={setBizType}
      />
      <Input
        label="Company Number"
        value={companyNumber}
        onChangeText={setCompanyNumber}
      />
      <Input
        label="Bank Account"
        value={JSON.stringify(bankaccount)}
        onChangeText={text => setBankaccount(JSON.parse(text))}
      />
      <Input
        label="Conditions"
        value={conditions}
        onChangeText={text => setConditions(JSON.parse(text))}
      />
      <Button title="Save" onPress={handleSave} />
    </View>
  );
};

export default ContactInfoScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});
