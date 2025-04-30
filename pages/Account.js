import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Account = () => {
  const navigation = useNavigation();

  // Здесь ты можешь получать данные пользователя, например, через глобальное состояние или контекст
  const user = {
    username: 'Иван Иванов',    // UserSession.Instance.Username
    jobTitle: 'Инженер',        // UserSession.Instance.JobtTitle
    role: 'Пользователь',       // UserSession.Instance.Role
    login: 'ivanov',            // UserSession.Instance.Login
  };

  const handleLogout = () => {
    // Очистить сессию пользователя (например, удалить токены)
    // Навигация на экран авторизации
    Alert.alert('Выход', 'Вы уверены, что хотите выйти?', [
      { text: 'Отмена', style: 'cancel' },
      { text: 'Выйти', style: 'destructive', onPress: () => {
          // Здесь очистить сохраненные токены или userData
          navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }], // Имя экрана входа
          });
        }
      }
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Учетная запись</Text>

      <View style={styles.infoBox}>
        <Text style={styles.infoText}>ФИО: {user.username}</Text>
        <Text style={styles.infoText}>Должность: {user.jobTitle}</Text>
        <Text style={styles.infoText}>Роль: {user.role}</Text>
        <Text style={styles.infoText}>Логин: {user.login}</Text>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Выйти из системы</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f0e6',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 20,
  },
  infoBox: {
    backgroundColor: '#fff',
    width: '100%',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#4c9aff',
  },
  infoText: {
    fontSize: 16,
    marginBottom: 10,
  },
  logoutButton: {
    backgroundColor: 'red',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 8,
  },
  logoutButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default Account;
