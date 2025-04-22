import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert,ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function CreateRequestScreen() {
  const [problemName, setProblemName] = useState('');
  const [room, setRoom] = useState('');
  const [priority, setPriority] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorVisible, setErrorVisible] = useState(false);
  const navigation = useNavigation();

  const handleSubmit = async () => {
    if (!problemName || !room || !priority) {
      setErrorVisible(true);
      return;
    }

    setLoading(true);
    setErrorVisible(false);

    try {
      const response = await fetch('https://localhost:7006/send-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${YOUR_AUTH_TOKEN}` // <-- вставь токен, если используется
        },
        body: JSON.stringify({
          ProblemName: problemName,
          Room: room,
          Priority: priority,
          Description: description
        })
      });

      if (response.ok) {
        Alert.alert('Успешно', 'Запрос успешно отправлен');
        setProblemName('');
        setRoom('');
        setPriority('');
        setDescription('');
      } else {
        Alert.alert('Ошибка', 'Не удалось отправить запрос');
      }
    } catch (error) {
      Alert.alert('Ошибка', 'Проблема с подключением к серверу');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Создание запроса</Text>

      <TextInput
        placeholder="Название проблемы"
        value={problemName}
        onChangeText={setProblemName}
        style={styles.input}
      />

      <TextInput
        placeholder="Помещение"
        value={room}
        onChangeText={setRoom}
        style={styles.input}
      />

      <TextInput
        placeholder="Приоритет"
        value={priority}
        onChangeText={setPriority}
        style={styles.input}
      />

      <TextInput
        placeholder="Дополнительное описание"
        value={description}
        onChangeText={setDescription}
        style={[styles.input, { height: 80 }]}
        multiline
      />

      {errorVisible && <Text style={styles.error}>Заполните обязательные поля</Text>}

      <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Отправить запрос</Text>
        )}
      </TouchableOpacity>
      <View style={styles.footer}>
                <TouchableOpacity style={[styles.footerBtn,{backgroundColor:'#fff'}]}  disabled={true}>
                    <ImageBackground source={require('../images/CrReq.png')} style={{width:'100%',height:'100%'}}></ImageBackground>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.footerBtn]} onPress={()=>navigation.navigate('MyRequests')}>
                    <ImageBackground source={require('../images/List.png')} style={{width:'100%',height:'100%'}}></ImageBackground>
                </TouchableOpacity>
                <TouchableOpacity style={styles.footerBtn} onPress={()=>navigation.navigate('')}>
                    <ImageBackground source={require('../images/Messages.png')} style={{width:'100%',height:'100%'}}></ImageBackground>
                </TouchableOpacity>
                <TouchableOpacity  style={styles.footerBtn} onPress={()=>navigation.navigate('')}>
                    <ImageBackground source={require('../images/Profile.png')} style={{width:'95%',height:'95%'}}></ImageBackground>
                </TouchableOpacity>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3ebdc',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 22,
    marginVertical: 20,
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 6,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#32cd32',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginTop: 10,
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
  error: {
    color: 'red',
    marginBottom: 8,
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
