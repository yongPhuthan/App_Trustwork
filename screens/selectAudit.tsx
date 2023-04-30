import React, {useState, useContext, useEffect, useRef} from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import CardAudit from '../components/CardAudit';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp, ParamListBase} from '@react-navigation/native';
import {ScrollView} from 'react-native-gesture-handler';
import {useRoute} from '@react-navigation/native';
import {Store} from '../redux/Store';
import * as stateAction from '../redux/Actions';

type Props = {
  navigation: StackNavigationProp<ParamListBase, 'SelectAudit'>;
  route: RouteProp<ParamListBase, 'SelectAudit'>;
  // onGoBack: (data: string) => void;
};
type Audit = {
  title: string;
  description: string;
  price: number;
  imageUri: string;
  id: number;
};

const SelectAudit = ({navigation}: Props) => {
  const [selectedAudits, setSelectedAudits] = useState<Audit[]>([]);
  const route = useRoute();

  const {title, description}: any = route.params;

  const {
    state: {selectedAudit},
    dispatch,
  }: any = useContext(Store);
  const audits: Audit[] = [
    {
      id: 1,
      title: 'Audit 1',
      description: 'This is the description of Audit 1',
      price: 300,
      imageUri: 'https://images.unsplash.com/photo-1542057222-14988252f3fa',
    },
    {
      id: 2,
      title: 'Audit 2',
      description: 'This is the description of Audit 2',
      price: 250,
      imageUri: 'https://images.unsplash.com/photo-1556228724-4da03d9f6bf4',
    },
    {
      id: 3,
      title: 'Audit 3',
      description: 'This is the description of Audit 3',
      price: 350,
      imageUri: 'https://images.unsplash.com/photo-1573497497889-573cf1d9041a',
    },
  ];
  const handleSelectAudit = (audit: Audit) => {
    const existingIndex = selectedAudits.findIndex(
      a => a.title === audit.title,
    );
    if (existingIndex !== -1) {
      // if the audit is already selected, remove it
      setSelectedAudits(selectedAudits.filter(a => a.title !== audit.title));
      dispatch(stateAction.remove_selected_audit(audit));
    } else {
      // if the audit is not selected, add it
      setSelectedAudits([...selectedAudits, audit]);
      dispatch(stateAction.selected_audit(audit));
    }
  };

  const handleDonePress = () => {
    if (selectedAudits.length > 0) {
      // dispatch here
      navigation.goBack();
    }
  };

  useEffect(() => {
    if (selectedAudit.length > 0) {
      setSelectedAudits(selectedAudit);
    }
  }, [selectedAudit]);

  // Create a new array of audits with the `defaultChecked` prop set
  const auditsWithChecked = audits.map(audit => ({
    ...audit,
    defaultChecked: selectedAudits.some(a => a.id === audit.id),
  }));

  return (
    <View style={{flex: 1}}>
      <ScrollView style={styles.container}>
        <View style={styles.contentContainer}>
          <View style={styles.headerContainer}>
            <Text style={styles.headerTitle}>Select an Audit </Text>
          </View>
          {/* Tile & description part */}
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.description}>{description}</Text>
          </View>

          <View style={styles.auditListContainer}>
            {auditsWithChecked.map((audit, index) => (
              <CardAudit
                key={index}
                title={audit.title}
                description={audit.description}
                price={audit.price}
                defaultChecked={audit.defaultChecked}
                imageUri={audit.imageUri}
                onPress={() => handleSelectAudit(audit)}
              />
            ))}
          </View>
          {/* problem here */}
        </View>
      </ScrollView>
      {/* Done button */}
      {selectedAudits.length > 0 && (
        <View style={styles.containerBtn}>
          <TouchableOpacity onPress={handleDonePress} style={styles.button}>
            <Text
              style={
                styles.buttonText
              }>{`ไปหน้าสัญญา (${selectedAudits.length})`}</Text>
          </TouchableOpacity>
        </View>
      )}
      {/* Done button */}
    </View>
  );
};

export default SelectAudit;

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
  auditListContainer: {
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
