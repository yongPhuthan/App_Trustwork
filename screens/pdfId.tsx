import React, {
    useRef,
    useEffect,
    useContext,
    useState,
    useMemo,
    useCallback,
  } from 'react';
import Pdf from 'react-native-pdf';
import { useRoute } from '@react-navigation/native';
  import PDFView from 'react-native-pdf';
  import {useQuery} from 'react-query';
  import { useSelector } from 'react-redux';
  import {
    ActivityIndicator,
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Alert,
  } from 'react-native';

  
  const RenderID = () => {
    const pdfRef = useRef<Pdf | null>(null); // declare pdfRef as RefObject<Pdf | null>
    const sigCanvasRef = useRef();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [signature, setSignature] = useState(null);
    const [qrValue, setQrValue] = useState('');
    const route = useRoute();
    const { id } : any = route.params;
  
    // const { isLoading, data, error: queryError } = useQuery(
    //   ['contract', id],
    //   async () => {
    //     const response = await fetch(
    //       `https://example.com/api/contract/${id}`,
    //       {
    //         headers: {
    //           Authorization: `Bearer ${token}`,
    //         },
    //       }
    //     );
    //     if (!response.ok) {
    //       throw new Error('Network response was not ok');
    //     }
    //     const data = await response.json();
    //     return data;
    //   }
    // );
  
    // useEffect(() => {
    //   if (!isLoading && !queryError) {
    //     setLoading(false);
    //     setQrValue(data.qrCode);
    //   } else if (queryError) {
    //     setLoading(false);
    //   }
    // }, [isLoading, queryError, data]);
  

  
    if (loading) {
      return (
        <View style={styles.container}>
          <ActivityIndicator />
        </View>
      );
    }
  
    if (error) {
      return (
        <View style={styles.container}>
          <Text>Error: {error}</Text>
        </View>
      );
    }
  
    return (
      <View style={styles.container}>
        <PDFView
        
        ref={pdfRef}
        //   ref={pdfRef}
          source={{ uri: `http://localhost:3000/api/quotations/contract/31e4a94e-bddb-4610-826f-73c7770f4cba` }}
          style={styles.pdf}
        />
       
    </View>
  );
};
export default RenderID;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    padding: 10,
  },
  pdf: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  signature: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    width: 150,
    height: 75,
    borderColor: '#000033',
    borderWidth: 1,
  },
  qrCode: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#fff',
    padding: 10,
    borderColor: '#000033',
    borderWidth: 1,
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

