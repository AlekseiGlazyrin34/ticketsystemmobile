import  { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, TextInput, StyleSheet, ScrollView, ImageBackground,ActivityIndicator,Alert,Image,Modal,Button} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Checkbox } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import UserSession from '../UserSession'; 
const AdminRequests = () => {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [status, setStatus] = useState('');
  const [response, setResponse] = useState('');
  const [showDetails, setShowDetails] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedImage,selectImage] = useState(null);
  const navigation = useNavigation();
  useEffect(() => {
    fetchUsers();
    fetchRequests();
  }, []);
 useEffect(() => {
    fetchRequests(selectedUserId);
  }, [selectedUserId]);
  const fetchUsers = async () => { //запросить пользователей
    const res = await UserSession.sendAuthorizedRequest(() => ({
      url: 'http://192.168.2.62:7006/get-users',
      method: 'GET',
    }));
    const data = await res.json();
    setUsers(data);
  };
   const fetchRequests = async (userId = null) => {
    setIsLoading(true);
    const url = userId !== null && userId !== 'Все пользователи'
      ? `http://192.168.2.62:7006/load-alldata?userId=${userId}` //запросить запросы конкретного пользователя
      : 'http://192.168.2.62:7006/load-alldata'; //запросить запросы всех пользователей
    const res = await UserSession.sendAuthorizedRequest(() => ({
      url,
      method: 'GET',
    }));
    const data = await res.json();
    setRequests(data);
    setIsLoading(false);
  };
  const loadRequestDetails = async (reqId) => {
    const res = await UserSession.sendAuthorizedRequest(() =>({
        url: `http://192.168.2.62:7006/loadadd-data?reqid=${reqId}`, //запросить данне о конкретном запросе
        method: 'GET',
        headers: {}
      }));
    const data = await res.json();
    const req = data[0];
    setSelectedRequest(req);
    setStatus(req.statusName);
    setResponse(req.responseContent || '');
    if (req.imageBase641) {
      req.imageUri1 = `data:image/jpeg;base64,${req.imageBase641}`;
    }
    if (req.imageBase642) {
      req.imageUri2 = `data:image/jpeg;base64,${req.imageBase642}`;
    }
    setShowDetails(true);
  };
  const saveChanges = async () => {
    const res = await UserSession.sendAuthorizedRequest(() =>
      ({
        url: 'http://192.168.2.62:7006/save-changes', //сохранить изменения для запроса
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reqId: selectedRequest.requestId,
          statusName: status,
          responseContent: response,
          createChat: isChecked
        })
      })
    );
    if (res.ok) {
      Alert.alert('Успех','Изменения сохранены');
      fetchRequests();
      setShowDetails(false);
    } 
    else if(res.text() == 'ChatAlreadyExist') {
      alert('Чат с данной проблемой уже существует');
    }
    else {
      alert('Ошибка при сохранении');
    }
  };
  const saveBase64ToGallery = async (base64Data) => { //преобразование картинки из base64 для сохранения
  const { status } = await MediaLibrary.requestPermissionsAsync();
  if (status !== 'granted') {
    Alert.alert('Ошибка', 'Нет разрешения на сохранение изображений');
    return;
  }
  try {
    const fileUri = FileSystem.cacheDirectory + `request_image_${Date.now()}.jpg`;
    // Сохраняем base64 в файл
    await FileSystem.writeAsStringAsync(fileUri, base64Data, {
      encoding: FileSystem.EncodingType.Base64,
    });
    // Сохраняем файл в галерею
    const asset = await MediaLibrary.createAssetAsync(fileUri);
    await MediaLibrary.createAlbumAsync('TicketSystem', asset, false);
    Alert.alert('Успешно', 'Изображение сохранено в галерею');
  } catch (err) {
    console.error('Ошибка сохранения:', err);
    Alert.alert('Ошибка', 'Не удалось сохранить изображение');
  }
};
  if (showDetails && selectedRequest) { //показывать конкретный запрос
    return (
      <ScrollView contentContainerStyle={styles.container}/*Подробности запроса*/> 
        <View style={{backgroundColor:'#4371e6',height:'7%',alignItems: 'center', justifyContent: 'space-between',flexDirection:'row'}}>
            <TouchableOpacity onPress={() => {setShowDetails(false)}}>
              <Text style={styles.header}>← Назад</Text>
            </TouchableOpacity>
            <Text style={styles.header}>Подробности запроса</Text> 
        </View>
        <View style={{marginHorizontal:20, marginTop:10, flexDirection:'row'}}>
          <Text style={{fontWeight:'bold', fontSize:18}}>От: </Text>
          <Text style={{fontSize:18}}>{selectedRequest.username }</Text> 
        </View>
        <View style={{marginHorizontal:20, marginTop:5, flexDirection:'row'}}>
          <Text style={{fontWeight:'bold', fontSize:18}}>Проблема: </Text>
          <Text style={{fontSize:18}}>{selectedRequest.problemName}</Text>
        </View>
        <View style={{marginHorizontal:20, marginTop:5, flexDirection:'row'}}>
          <Text style={{fontWeight:'bold', fontSize:18}}>Дата/время: </Text>
          <Text style={{fontSize:18}}>{new Date(selectedRequest.reqtime).toLocaleString()}</Text>
        </View>
        <View style={{marginHorizontal:20, marginTop:5, flexDirection:'row'}}>
          <Text style={{fontWeight:'bold', fontSize:18}}>Приоритет: </Text>
          <Text style={{fontSize:18}}>{selectedRequest.priorityName}</Text>
        </View>
        <View style={{marginHorizontal:20, marginTop:5, flexDirection:'row'}}>
          <Text style={{fontWeight:'bold', fontSize:18}}>Помещение: </Text>
          <Text style={{fontSize:18}}>{selectedRequest.room}</Text>
        </View>
        <Text style={{marginHorizontal:20,fontWeight:'bold',marginTop:5,fontSize:18}}>Описание:</Text>
        <Text style={styles.textBox}>{selectedRequest.description}</Text>
        <View style={{marginHorizontal:20,marginTop:5,flexDirection:'row'}}><Text style={{fontWeight:'bold',fontSize:18}}>Ответ от: {selectedRequest.respusername || '-'}</Text></View>
        <Text style={{marginHorizontal:20,fontWeight:'bold',fontSize:18}}>Ответ:</Text>
        <TextInput
          style={styles.textInput}
          multiline
          value={response}
          onChangeText={setResponse}
        />
        <Text style={{marginHorizontal:20,fontWeight:'bold',fontSize:18}}>Статус:</Text>
        <View style={styles.pickerContainer2}>
        <Picker
          selectedValue={status}
          onValueChange={(itemValue) => setStatus(itemValue)}
        >
          <Picker.Item label="Новый" value="Новый" /*Выбор статуса запроса*//> 
          <Picker.Item label="В работе" value="В работе" />
          <Picker.Item label="Закрыт" value="Закрыт" />
        </Picker>
        </View>
        <View style={{flexDirection:'row',marginHorizontal:20,alignItems:'center'}}>
        <Text style={{fontSize:18}}>Создать чат</Text>
        <Checkbox
          status={isChecked ? 'checked' : 'unchecked'}
          onPress={() => setIsChecked(!isChecked)} 
          color="#4371e6" // Цвет в активном состоянии
        />
        </View>
       <View style={{flexDirection:'row',justifyContent:'space-between',marginHorizontal:20}}> 
        {selectedRequest.imageUri1 && (
          <TouchableOpacity style={{ width:'47%', height: 190,borderWidth:1,alignSelf:'center' }} onPress={() => {selectImage(selectedRequest.imageBase641);setShowCreateDialog(true)}}>
          <Image
            source={{ uri: selectedRequest.imageUri1 }}
            style={{ width:'100%',height:'100%'}}
            resizeMode="stretch"
          />
          </TouchableOpacity>
        )}
        {selectedRequest.imageUri2 && (
          <TouchableOpacity style={{ width:'47%', height: 190,borderWidth:1,alignSelf:'center' }} onPress={() => {selectImage(selectedRequest.imageBase642);setShowCreateDialog(true)}}>
          <Image
            source={{ uri: selectedRequest.imageUri2 }}
            style={{ width:'100%',height:'100%'}}
            resizeMode="stretch"
          />
          </TouchableOpacity>
        )}
        </View>

        <TouchableOpacity style={styles.button} onPress={saveChanges}>
          <Text style={styles.buttonText}>Сохранить изменения</Text>
        </TouchableOpacity>

      {selectedImage && <Modal visible={showCreateDialog} animationType="slide" transparent={true}/*модальное окно для показа изображения*/> 
          <View style={{ flex: 1, backgroundColor: '#000000aa', justifyContent: 'center' }}>
                <Image source={{ uri: `data:image/jpeg;base64,${selectedImage}` }} style={{ width:'80%', height: '70%',borderWidth:1,alignSelf:'center' }} />
              <View style={{ flexDirection: 'row', justifyContent: 'space-around',marginTop: 15 }}>
                <Button title="Скачать" onPress={() =>saveBase64ToGallery(selectedImage)} />
                <Button title="Назад" onPress={() => setShowCreateDialog(false)} />
              </View>
            </View>
        </Modal>}
      </ScrollView>
    );
  }
  return ( //список всех запросов
    <View style={styles.container}>
      <View style={{backgroundColor:'#4371e6',height:'7%',alignItems: 'center', justifyContent: 'space-between',flexDirection:'row'}}>
          <Text style={styles.header}>Запросы</Text>
            <View style={styles.pickerContainer}>
            <Picker
          selectedValue={selectedUserId}
          onValueChange={(itemValue) => setSelectedUserId(itemValue)}
          style={styles.pickerAndroid}>
          <Picker.Item label="Все пользователи" value={null} />
          {users.map((user) => (
            <Picker.Item key={user.userId} label={user.username} value={user.userId} />
          ))}
        </Picker></View>
      </View>
      {isLoading ? ( //анимация загрузки
          <View style={{ height: '83%', justifyContent: 'center', alignItems: 'center',backgroundColor:'#f5f7fc' }}>
            <ActivityIndicator size="large" color="#4371e6" />
          </View>
      ) : requests.length > 0 ? (
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
      </View>) : (<View style={{ height:'83%',justifyContent:'center',alignItems:'center',backgroundColor:'#f5f7fc'}}><Text style={{fontWeight:'bold',fontSize:20}}>На данный момент запросов нет</Text></View>) }
      <View style={styles.footer}>
            <TouchableOpacity style={styles.footerBtn} onPress={()=>navigation.navigate('CreateRequest')} /*Кнопка создания запроса*/>
              <ImageBackground source={require('../images/CrReqW.png')} style={{width:'100%',height:'100%'}} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.footerBtn,{backgroundColor:'#f5f7fc'}]} disabled={true}/*Кнопка просмотра запросов для пользователя*/>
              <ImageBackground source={require('../images/List.png')} style={{width:'100%',height:'100%'}} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.footerBtn} onPress={()=>navigation.navigate('Chats')}/*Кнопка просмотра чатов*/>
              <ImageBackground source={require('../images/MessagesW.png')} style={{width:'100%',height:'100%'}} />
            </TouchableOpacity>
            <TouchableOpacity  style={styles.footerBtn} onPress={()=>navigation.navigate('Account')}/*Кнопка страницы учетной записи*/>
              <ImageBackground source={require('../images/ProfileW.png')} style={{width:'100%',height:'100%'}} />
            </TouchableOpacity>
      </View>
    </View>
  );
};
export default AdminRequests;
const styles = StyleSheet.create({
  container: { 
    flex: 1,
    paddingTop: 0,
    paddingHorizontal: 0,
    },
  header: { fontSize: 20, fontWeight: 'bold',marginHorizontal:20,color:'#f5f7fc' },
  list: {
    backgroundColor: '#f5f7fc',
    borderRadius: 10,
    marginBottom: 0,
  },
  pickerAndroid: {
    width: '100%',
    marginHorizontal: 0
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginTop: 0,
    backgroundColor: '#fff',
    marginHorizontal: 20,
    width:'50%',
    height:'60%',
    justifyContent:'center'
  },
  pickerContainer2: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginVertical: 5,
    backgroundColor: '#fff',
    marginHorizontal: 20,
    width:'90%',
    height:40,
    justifyContent:'center'
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
    marginVertical: 5,
    marginHorizontal:20
  },
  textBox: { 
    backgroundColor: '#f1f1f1',
    borderRadius: 5,
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
  },
  footerBtn:{
    width:'25%',
    height:'100%', 
    backgroundColor: '#4371e6',
    borderWidth:0,
  },
});
