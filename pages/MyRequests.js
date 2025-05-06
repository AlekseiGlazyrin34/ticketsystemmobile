import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, RefreshControl,ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const MyRequests = () => {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    //loadData();
  }, []);

  /*const loadData = async () => {
    try {
      const response = await fetch('https://localhost:7006/load-data', {
        headers: {
          Authorization: 'Bearer ' + 'твой_токен', // подставь свой токен если нужно
        },
      });
      const data = await response.json();
      setRequests(data);
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
    }
  };*/

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const loadDetails = async (requestId) => {
    try {
      const response = await fetch(`https://localhost:7006/loadadd-data?reqid=${requestId}`, {
        headers: {
          Authorization: 'Bearer ' + 'твой_токен',
        },
      });
      const data = await response.json();
      setSelectedRequest(data[0]);
    } catch (error) {
      console.error('Ошибка загрузки деталей:', error);
    }
  };

  const renderRequestItem = ({ item }) => (
    <TouchableOpacity style={styles.item} onPress={() => loadDetails(item.requestId)}>
      <Text style={styles.itemTitle}>{item.problemName}</Text>
      <Text>{item.statusName}</Text>
      <Text>{new Date(item.reqtime).toLocaleString()}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Мои запросы</Text>
      <View style={{ flex: 0.5 ,marginHorizontal:10}}>
      <FlatList
        data={requests}
        keyExtractor={(item) => item.requestId.toString()}
        renderItem={renderRequestItem}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        style={styles.list}
      />
      </View>
      <Text style={styles.title}>Подробности</Text>
      <View style={styles.details}>
        {selectedRequest ? (
          <>
            <Text>№: {selectedRequest.requestId}</Text>
            <Text>Проблема: {selectedRequest.problemName}</Text>
            <Text>Дата: {new Date(selectedRequest.reqtime).toLocaleString()}</Text>
            <Text>Статус: {selectedRequest.statusName}</Text>
            <Text style={{ color: getPriorityColor(selectedRequest.priorityName) }}>
              Приоритет: {selectedRequest.priorityName}
            </Text>
            <Text>Помещение: {selectedRequest.room}</Text>
            <Text>Описание: {selectedRequest.description}</Text>
            {selectedRequest.respusername && (
              <>
                <Text>Ответ от: {selectedRequest.respusername}</Text>
                <Text>Ответ: {selectedRequest.responseContent}</Text>
              </>
            )}
          </>
        ) : (
          <Text>Выберите запрос для просмотра</Text>
        )}
      </View>
      <View style={styles.footer}>
                      <TouchableOpacity style={styles.footerBtn} onPress={()=>navigation.navigate('CreateRequest')} >
                          <ImageBackground source={require('../images/CrReq.png')} style={{width:'100%',height:'100%'}}></ImageBackground>
                      </TouchableOpacity>
                      <TouchableOpacity style={[styles.footerBtn,{backgroundColor:'#fff'}]} disabled={true}>
                          <ImageBackground source={require('../images/List.png')} style={{width:'100%',height:'100%'}}></ImageBackground>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.footerBtn} onPress={()=>navigation.navigate('')}>
                          <ImageBackground source={require('../images/Messages.png')} style={{width:'100%',height:'100%'}}></ImageBackground>
                      </TouchableOpacity>
                      <TouchableOpacity  style={styles.footerBtn} onPress={()=>navigation.navigate('Account')}>
                          <ImageBackground source={require('../images/Profile.png')} style={{width:'95%',height:'95%'}}></ImageBackground>
                      </TouchableOpacity>
        </View>
    </View>
  );
};

const getPriorityColor = (priority) => {
  switch (priority) {
    case 'Отложенный':
      return 'green';
    case 'Срочный':
      return 'orange';
    case 'Критический':
      return 'red';
    default:
      return 'black';
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f0e6',
    paddingHorizontal: 0,
    paddingTop: 40
    
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
    marginHorizontal:10
  },
  list: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 10,
    height:'50%'
    
  },
  item: {
    padding: 10,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
  },
  itemTitle: {
    fontWeight: 'bold',
  },
  details: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    minHeight: 100,
    marginHorizontal:10
  },
  footer: {
    width:'100%',
    height:'10%',
    flexDirection:'row',
    position: 'absolute',
    
    bottom:0,
    backgroundColor: 'rgba(0,0,0,0)',
  },
  footerBtn:{
    width:'25%',
    height:'100%', 
    backgroundColor: '#4c0080',
    borderWidth:1,
  },
});

export default MyRequests;
