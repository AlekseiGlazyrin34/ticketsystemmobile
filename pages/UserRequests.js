import React, { useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity, FlatList, TextInput, StyleSheet, ScrollView,Picker, ImageBackground
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import UserSession from '../UserSession'; 

const UserRequests = () => {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [status, setStatus] = useState('');
  const [response, setResponse] = useState('');
  const [showDetails, setShowDetails] = useState(false);
  const navigation = useNavigation();
  
  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    const res = await UserSession.sendAuthorizedRequest(() =>({
      url: 'https://localhost:7006/load-data',
      method: 'GET',
      headers: {}
  }));
    const data = await res.json();
    setRequests(data);
  };

  const loadRequestDetails = async (reqId) => {
    const res = await UserSession.sendAuthorizedRequest(() =>({
        url: `https://localhost:7006/loadadd-data?reqid=${reqId}`,
        method: 'GET',
        headers: {}
      }));
   
    const data = await res.json();
    const req = data[0];

    setSelectedRequest(req);
    setStatus(req.statusName);
    setResponse(req.responseContent || '');
    setShowDetails(true);
  };

  if (showDetails && selectedRequest) {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity onPress={() => setShowDetails(false)}>
          <Text style={styles.backArrow}>← Назад</Text>
        </TouchableOpacity>

        <Text style={styles.header}>Подробности запроса</Text>
        <Text style={{marginHorizontal:20}}>ID: {selectedRequest.requestId}</Text>
        <Text style={{marginHorizontal:20}}>От: {selectedRequest.username}</Text>
        <Text style={{marginHorizontal:20}}>Проблема: {selectedRequest.problemName}</Text>
        <Text style={{marginHorizontal:20}}>Дата/время: {selectedRequest.reqtime}</Text>
        <Text style={{marginHorizontal:20}}>Приоритет: {selectedRequest.priorityName}</Text>
        <Text style={{marginHorizontal:20}}>Помещение: {selectedRequest.room}</Text>
        <Text style={{marginHorizontal:20}}>Описание:</Text>
        <Text style={styles.textBox}>{selectedRequest.description}</Text>
        <Text style={{marginHorizontal:20}}>Ответ от: {selectedRequest.respusername || '-'}</Text>

        <Text style={{marginHorizontal:20}}>Ответ:</Text>
        <TextInput
          style={styles.textInput}
          multiline
          value={response}
          onChangeText={setResponse}
          editable={false}
        />

        <Text style={{marginHorizontal:20}}>Статус:</Text>
        <Text style={{marginHorizontal:20}}>{status}</Text>
          

        
      </ScrollView>
    );
  }

  return (
    <View style={styles.container}>
      <View style={{backgroundColor:'#4371e6',height:'7%',justifyContent:'space-around'}}>
        <Text style={styles.header}>Запросы</Text>
      </View>
      
      <View style={{ height:'83%'}}>
      <FlatList
        style={styles.list}
        data={requests}
        keyExtractor={(item) => item.requestId.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.listItem}
            onPress={() => loadRequestDetails(item.requestId)}
          >
            <Text>Проблема: {item.problemName}</Text>
            <Text>Статус: {item.statusName}</Text>
            <Text>Дата: {new Date(item.reqtime).toLocaleString()}</Text>
          </TouchableOpacity>
        )}
      />
      
      </View>
      <View style={styles.footer}> 
            <TouchableOpacity style={styles.footerBtn} onPress={()=>navigation.navigate('CreateRequest')} >
              <ImageBackground source={require('../images/CrReqW.png')} style={{width:'100%',height:'100%'}} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.footerBtn,{backgroundColor:'#f5f7fc'}]} disabled={true}>
              <ImageBackground source={require('../images/List.png')} style={{width:'100%',height:'100%'}} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.footerBtn} onPress={()=>navigation.navigate('Chats')}>
              <ImageBackground source={require('../images/MessagesW.png')} style={{width:'100%',height:'100%'}} />
            </TouchableOpacity>
            <TouchableOpacity  style={styles.footerBtn} onPress={()=>navigation.navigate('Account')}>
              <ImageBackground source={require('../images/ProfileW.png')} style={{width:'95%',height:'95%'}} />
            </TouchableOpacity>
      </View>
    </View>
  );
};

export default UserRequests;

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    paddingTop: 0,
    paddingHorizontal: 0,
    
    },
  header: { fontSize: 20, fontWeight: 'bold',marginHorizontal:20,color:'#f5f7fc' },
  list: {
    backgroundColor: '#f5f7fc',
    marginBottom: 0,
    borderTopWidth:1,
  },
  listItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#ccc',

  },
  backArrow: {
    fontSize: 18,
    marginBottom: 10,
    color: '#007AFF',
    marginHorizontal:20
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    minHeight: 80,
    marginVertical: 10,
    marginHorizontal:20
  },
  textBox: {
    padding: 10,
    backgroundColor: '#f1f1f1',
    borderRadius: 5,
    marginVertical: 10,
    marginHorizontal:20
  },
  picker: {
    height: 50,
    marginVertical: 10,
    marginHorizontal:20
  },
  button: {
    backgroundColor: '#4a90e2',
    padding: 12,
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 10,
    marginHorizontal:20
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    marginHorizontal:20
  },
  footer: {
    width:'100%',
    height:'10%',
    flexDirection:'row',
    position: 'absolute',
    bottom:0,
    backgroundColor: '#4371e6',
  },
  footerBtn:{
    width:'25%',
    height:'100%', 
    backgroundColor: '#4371e6',
    borderWidth:0,
  },
});

