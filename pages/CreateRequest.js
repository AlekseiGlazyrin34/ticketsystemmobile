import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Picker, // если используешь старую версию
  Platform,ImageBackground
} from 'react-native';
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
        url: 'https://localhost:7006/send-request', // замените на свой IP
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
        navigation.goBack();
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
      <Text style={styles.label}>Проблема</Text>
      <TextInput
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
            <TouchableOpacity style={[styles.footerBtn,{backgroundColor:'#fff'}]}  disabled={true}>
                <ImageBackground source={require('../images/CrReq.png')} style={{width:'100%',height:'100%'}}></ImageBackground>
            </TouchableOpacity>
            {UserSession.role === 'Admin' ?(<TouchableOpacity style={[styles.footerBtn]} onPress={()=>navigation.navigate('AdminRequests')}>
                <ImageBackground source={require('../images/List.png')} style={{width:'100%',height:'100%'}}></ImageBackground>
            </TouchableOpacity>) 
            : (<TouchableOpacity style={[styles.footerBtn]} onPress={()=>navigation.navigate('UserRequests')}>
                <ImageBackground source={require('../images/List.png')} style={{width:'100%',height:'100%'}}></ImageBackground>
            </TouchableOpacity>)}
            
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

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    paddingHorizontal:0
  },
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
    marginHorizontal: 20
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
    marginHorizontal: 20
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
    backgroundColor: 'rgba(0,0,0,0)',
  },
  footerBtn:{
    width:'25%',
    height:'100%', 
    backgroundColor: '#4c0080',
    borderWidth:1,
  },
});

export default CreateRequest;

  

