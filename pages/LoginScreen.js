import  { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Keyboard,} from 'react-native';
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
    if (!login || !password) { //проверка полей
      setError('Поля должны быть заполнены');
      return;
    }
    setLoading(true); //загрузка
    setError('');
    const data = { //данные для отправки
      Login: login,
      Password: password,
    };
    try {
      const response = await fetch('http://192.168.2.62:7006/login', { //отпровка данных для аутентификации
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        setError('ОК');
        const respData = await response.json();
        UserSession.username = respData.username; //имя ползователя
        UserSession.login = respData.login; //логин
        UserSession.password = respData.password; //пароль
        UserSession.jobTitle = respData.jobTitle; //должность
        UserSession.role = respData.role; //роль
        UserSession.accessToken = respData.token; //аксес токен
        UserSession.refreshToken = respData.refreshToken; //рефреш токен
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
      <TextInput /*Вводить логин*/
        placeholder="Логин"
        style={styles.input}
        value={login}
        onChangeText={setLogin}
      />
      <TextInput /*Вводить пароль*/
        placeholder="Пароль"
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {error ? <Text style={styles.error}>{error}</Text> : null /*Ошибка*/} 
      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        <Text style={styles.buttonText} /*Кнопка входа*/>Войти</Text>
      </TouchableOpacity>
    </View>
  );
};
export default LoginScreen;
//стили
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
