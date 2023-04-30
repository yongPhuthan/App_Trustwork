import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, FlatList, Alert,KeyboardAvoidingView,Platform} from 'react-native';
import {TextInput, Button} from 'react-native-paper';
import RNPickerSelect from 'react-native-picker-select';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp, ParamListBase} from '@react-navigation/native';
import {useRoute} from '@react-navigation/native';

interface InstallmentDetail {
  installment: number;
  percentage: number;
  amount: number;
}

type Props = {
  navigation: StackNavigationProp<ParamListBase, 'InstallmentScreen'>;
  route: RouteProp<ParamListBase, 'InstallmentScreen'>;
};

const InstallmentScreen = ({navigation}: Props) => {
  const route = useRoute();
  const {data}: any = route?.params;
  const totalPrice = data.data.allTotal;

  const [installments, setInstallments] = useState<number>(0);
  const [installmentDetails, setInstallmentDetails] = useState<
    InstallmentDetail[]
  >([]);
  const [percentages, setPercentages] = useState<{[key: number]: number}>({});
  const [isPercentagesValid, setIsPercentagesValid] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [installmentDetailsText, setInstallmentDetailsText] = useState<{
    [key: number]: string;
  }>({});

  useEffect(() => {
    const totalPercentage = Object.values(percentages).reduce(
      (acc, percentage) => acc + percentage,
      0,
    );

    if (totalPercentage < 100) {
      setIsPercentagesValid(false);
      setErrorMessage(`ผลรวมคือ${totalPercentage} ควรแบ่งงวดให้ครบ 100%`);
    } else if (totalPercentage > 100) {
      setIsPercentagesValid(false);
      setErrorMessage(`ผลรวมคือ${totalPercentage} ควรแบ่งงวดไม่เกิน 100%`);
    } else {
      setIsPercentagesValid(true);
      setErrorMessage('');
    }
  }, [percentages]);

  const handleSave = () => {
    if (!isPercentagesValid) {
      Alert.alert('Error', errorMessage?.toString() || 'Error');
      return;
    }
    
    const newInstallmentDetails = Object.entries(percentages).map(([key, value]) => ({
      installment: Number(key) + 1,
      percentage: value,
      amount: (totalPrice * value) / 100,
      details: installmentDetailsText[Number(key)],
    }));
  
    // Update periodPercent in data
    data.data.periodPercent = newInstallmentDetails;
  

    // navigation.navigate('SelectContract', {  updatedData:data });
    navigation.navigate('ContractOption', {  data });

  
    console.log('Updated data:', data);
  };
  
  

  const handlePercentageChange = (value: string, index: number) => {
    setPercentages(prevState => ({
      ...prevState,
      [index]: parseFloat(value),
    }));
  };

  const handleInstallmentDetailsTextChange = (value: string, index: number) => {
    setInstallmentDetailsText(prevState => ({
      ...prevState,
      [index]: value,
    }));
  };

  const pickerItems = [3, 5, 7].map(value => ({
    label: `${value} งวด`,
    value,
  }));
console.log('data params', JSON.stringify(data));
  const renderItem = ({item, index}: {item: any; index: number}) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>งวดที่ {index + 1}</Text>
      </View>
      <View style={styles.cardHeader}>
        <TextInput
          label={`% ของงวดนี้`}
          keyboardType="numeric"
          onChangeText={(value) => handlePercentageChange(value, index)}
          style={styles.input}
          theme={{ colors: { primary: '#009EDB' } }}
        />
        <Text style={styles.amountText}>
          จำนวนเงิน:{' '}
          {((totalPrice * percentages[index]) / 100).toFixed(2)} THB
        </Text>
      </View>
      <View style={styles.cardContent}>
        <TextInput
          label={`รายละเอียดงวดที่ ${index + 1}`}
          onChangeText={(value) =>
            handleInstallmentDetailsTextChange(value, index)
          }
          style={styles.detailsInput}
          theme={{ colors: { primary: '#009EDB' } }}
        />
      </View>
    </View>
  );



  return (
    <KeyboardAvoidingView
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    style={styles.container}>
    <View style={styles.innerContainer}>
      <Text style={styles.header}>Total Price: {totalPrice} THB</Text>
      <RNPickerSelect
        onValueChange={value => setInstallments(value)}
        items={pickerItems}
        placeholder={{label: 'เลือกจำนวนงวด', value: null}}
        style={pickerSelectStyles}
      />
 <FlatList
        data={Array.from({length: installments})}
        renderItem={renderItem}
        keyExtractor={(_, index) => index.toString()}
      />

      <Button
        mode="contained"
        onPress={handleSave}
        style={styles.saveButton}
        // disabled={!isPercentagesValid}
      >
        Save
      </Button>
    </View>
    </KeyboardAvoidingView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f4f6f9',
  },
  header: {
    fontSize: 24,
    marginBottom: 16,
    color: '#009EDB',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    flexWrap: 'wrap', // เพิ่มบรรทัดนี้เพื่อให้ข้อความขึ้นบรรทัดใหม่เมื่อความกว้างไม่เพียงพอ
  },
  errorText: {
    fontSize: 14,
    color: 'red',
    marginBottom: 16,
  },
  amountText: {
    flex: 1,
    fontSize: 16,
    color: '#2a7de1',
  },
  saveButton: {
    backgroundColor: '#009EDB',
  },
  amountContainer: {
    flex: 1,
    marginTop: 8,
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#009EDB',
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  detailsInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#009EDB',
    borderRadius: 4,
    marginBottom: 8,
  },
  input: {
    flex: 1,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#009EDB',
    borderRadius: 4,
    width: '90%',
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#009EDB',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30,
    marginBottom: 16,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: '#009EDB',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30,
    marginBottom: 16,
  },
  installmentDetailContainer: {
    backgroundColor: '#e3f3ff',
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16,
  },
  installmentDetailText: {
    fontSize: 16,
  },
});

export default InstallmentScreen;
