import  { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import UserSession from '../UserSession'; // предполагаем, что синглтон сохранён тут

import { useNavigation } from '@react-navigation/native';

const LoginScreen = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  
  const handleLogin = async () => {
    Keyboard.dismiss();

    if (!login || !password) {
      setError('Поля должны быть заполнены');
      return;
    }

    setLoading(true);
    setError('');

    const data = {
      Login: login,
      Password: password,
    };

    try {
      
      const response = await fetch('http://192.168.2.62:7006/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        
      });

      if (response.ok) {
        setError('ОК');
        const respData = await response.json();
        UserSession.username = respData.username;
        UserSession.login = respData.login;
        UserSession.password = respData.password;
        UserSession.jobTitle = respData.jobTitle;
        UserSession.role = respData.role;
        UserSession.accessToken = respData.token;
        UserSession.refreshToken = respData.refreshToken;
        UserSession.userId = parseInt(respData.userId);
        
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
      } 
      else if (response.status === 401) {
        setError('Неправильный логин или пароль');
      } else {
        setError('Ошибка при входе');
      }
    } catch (e) {
      console.log(e);
      setError('Не удалось установить соединение с сервером');
    }

    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Логин"
        style={styles.input}
        value={login}
        onChangeText={setLogin}
      />
      <TextInput
        placeholder="Пароль"
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        <Text style={styles.buttonText}>Войти</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fc',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  input: {
    width: '80%',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 12,
    padding: 10,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#4371e6',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 6,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
