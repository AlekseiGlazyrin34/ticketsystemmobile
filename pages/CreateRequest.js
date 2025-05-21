import { useState } from 'react';
import {
  View,  Text, TextInput, StyleSheet, TouchableOpacity, Alert, Platform,ImageBackground} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import UserSession from '../UserSession';
const CreateRequest = () => {
  const navigation = useNavigation();
  const [problemName, setProblemName] = useState('');
  const [room, setRoom] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Отложенный');
  const priorities = ['Отложенный', 'Срочный', 'Критический'];
  const handleSubmit = async () => {
    if (!problemName || !room || !description) {
      Alert.alert('Ошибка', 'Пожалуйста, заполните все поля');
      return;
    }
    try {
      const response = await UserSession.sendAuthorizedRequest(() => ({
        url: 'http://192.168.2.62:7006/send-request', 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          problemName,
          room,
          priority: priority,
          description,
        }),
      }));
      if (response.ok) {
        Alert.alert('Успех', 'Запрос успешно отправлен');
        if (UserSession.role === 'Admin') {
            navigation.reset({
              index: 0,
              routes: [{ name: 'AdminRequests' }],
            });
          } else {
            navigation.reset({
              index: 0,
              routes: [{ name: 'UserRequests' }],
        });
      }
      } else {
        const errorText = await response.text();
        console.error('Ошибка запроса:', errorText);
        Alert.alert('Ошибка', 'Не удалось отправить запрос');
      }
    } catch (error) {
      console.error('Ошибка при отправке:', error);
      Alert.alert('Ошибка', 'Произошла ошибка при отправке запроса');
    }
  };
  return (
    <View style={styles.container}>
      <View style={{backgroundColor:'#4371e6',height:'7%',justifyContent:'space-around'}}>
          <Text style={styles.header}>Создание запроса</Text>
      </View>
      <Text style={styles.label}>Проблема</Text>
      <TextInput
        maxLength={30}
        style={styles.input}
        value={problemName}
        onChangeText={setProblemName}
      />
      <Text style={styles.label}>Помещение</Text>
      <TextInput
        style={styles.input}
        value={room}
        onChangeText={setRoom}
      />
      <Text style={styles.label}>Описание</Text>
      <TextInput
        style={styles.textArea}
        multiline
        numberOfLines={4}
        value={description}
        onChangeText={setDescription}
      />
      <Text style={styles.label}>Приоритет</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={priority}
          onValueChange={(itemValue) => setPriority(itemValue)}
          style={Platform.OS === 'android' ? styles.pickerAndroid : undefined}
        >
          {priorities.map((p) => (
            <Picker.Item key={p} label={p} value={p} />
          ))}
        </Picker>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Создать запрос</Text>
      </TouchableOpacity>
      <View style={styles.footer}>
            <TouchableOpacity style={[styles.footerBtn,{backgroundColor:'#f5f7fc'}]}  disabled={true}>
                <ImageBackground source={require('../images/CrReq.png')} style={{width:'100%',height:'100%'}}></ImageBackground>
            </TouchableOpacity>
            {UserSession.role === 'Admin' ?(<TouchableOpacity style={[styles.footerBtn]} onPress={()=>navigation.navigate('AdminRequests')}>
                <ImageBackground source={require('../images/ListW.png')} style={{width:'100%',height:'100%'}}></ImageBackground>
            </TouchableOpacity>) 
            : (<TouchableOpacity style={[styles.footerBtn]} onPress={()=>navigation.navigate('UserRequests')}>
                <ImageBackground source={require('../images/ListW.png')} style={{width:'100%',height:'100%'}}></ImageBackground>
            </TouchableOpacity>)}
            
            <TouchableOpacity style={styles.footerBtn} onPress={()=>navigation.navigate('Chats')}>
                <ImageBackground source={require('../images/MessagesW.png')} style={{width:'100%',height:'100%'}}></ImageBackground>
            </TouchableOpacity>
            <TouchableOpacity  style={styles.footerBtn} onPress={()=>navigation.navigate('Account')}>
                <ImageBackground source={require('../images/ProfileW.png')} style={{width:'100%',height:'100%'}}></ImageBackground>
            </TouchableOpacity>
        </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    padding: 0,
    flex: 1,
    paddingHorizontal:0,
    backgroundColor:'#f5f7fc'
  },
  header: { fontSize: 20, fontWeight: 'bold',marginHorizontal:20,color:'#f5f7fc' },
  label: {
    fontWeight: 'bold',
    marginTop: 10,
    marginHorizontal: 20
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 5,
    marginTop: 5,
    backgroundColor: '#fff',
    marginHorizontal: 20,
    
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 5,
    marginTop: 5,
    backgroundColor: '#fff',
    height: 100,
    marginHorizontal: 20
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginTop: 5,
    backgroundColor: '#fff',
    marginHorizontal: 20
  },
  pickerAndroid: {
    height: 50,
    width: '100%',
    marginHorizontal: 0
  },
  button: {
    marginTop: 20,
    backgroundColor: '#109c35',
    padding: 12,
    borderRadius: 5,
    borderColor: '#19e04e',
    alignItems: 'center',
    marginHorizontal: 20
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
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
    borderTopWidth:0,
    borderColor:'#f5f7fc'
  },
});
export default CreateRequest;

  

