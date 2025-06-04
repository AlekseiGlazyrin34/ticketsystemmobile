import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import UserSession from '../UserSession'; //Данные о сессии
const Registration = () => {
  const [username, setUsername] = useState('');
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [jobId, setJobId] = useState('');
  const [roleId, setRoleId] = useState('');
  const navigation = useNavigation();
  const handleRegister = async () => { //Функция регистрации
    if (!username || !login || !password || !jobId || !roleId) { //проверка заполнения полей
      Alert.alert('Ошибка', 'Все поля обязательны для заполнения');
      return;
    }
    try {
        const response= await UserSession.sendAuthorizedRequest(() => ({
            url:'http://192.168.2.62:7006/register', //отправка данных на регистрацию
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({ //данные для отправки
            username,
            login,
            password,
            jobId: parseInt(jobId),
            roleId: parseInt(roleId)
            }),
        }));
      const data = await response.json();
      if (response.ok) {
        Alert.alert('Успех', 'Регистрация прошла успешно');
        navigation.goBack(); //возврат на предыдущую страницу
      } else {
        Alert.alert('Ошибка', data.message || 'Ошибка регистрации'); //сообщение об ошибке
      }
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось подключиться к серверу');
      console.error(error);
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Регистрация</Text>
      <TextInput
        style={styles.input}
        placeholder="Имя пользователя"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput /*Поле ввода логина*/
        style={styles.input}
        placeholder="Логин"
        value={login}
        onChangeText={setLogin}
        autoCapitalize="none"
      />
      <TextInput /*Поле ввода пароля*/
        style={styles.input}
        placeholder="Пароль"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput /*Поле ввода должности*/
        style={styles.input}
        placeholder="ID должности"
        value={jobId}
        onChangeText={setJobId}
        keyboardType="numeric"
      />
      <TextInput /*Поле ввода роли*/
        style={styles.input}
        placeholder="ID роли"
        value={roleId}
        onChangeText={setRoleId}
        keyboardType="numeric"
      />
      <TouchableOpacity style={styles.button} onPress={handleRegister} /*Кнопка регистрации*/>
        <Text style={styles.buttonText}>Зарегистрировать</Text>
      </TouchableOpacity>
    </View>
  );
};
//Стили
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#f5f5f5'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center'
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#fff'
  },
  button: {
    backgroundColor: '#4371e6',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center'
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold'
  }
});
export default Registration;