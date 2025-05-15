import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import UserSession from '../UserSession';
const Account = () => {
  const navigation = useNavigation();
  
  // Здесь ты можешь получать данные пользователя, например, через глобальное состояние или контекст
  const user = {
    username: UserSession.username,    // UserSession.Instance.Username
    jobTitle: UserSession.jobTitle,        // UserSession.Instance.JobtTitle
    role: UserSession.role,       // UserSession.Instance.Role
    login: UserSession.login,            // UserSession.Instance.Login
  };

  const handleLogout = () => {
    // Очистить сессию пользователя (например, удалить токены)
    // Навигация на экран авторизации
    console.log('Нажата кнопка выхода');
    //Alert.alert('Выход', 'Вы уверены, что хотите выйти?', [
      //{ text: 'Отмена', style: 'cancel' },
      //{ text: 'Выйти', style: 'destructive', 
        //onPress: () => {
          // Здесь очистить сохраненные токены или userData
          UserSession.clear();
          navigation.reset({
            index: 0,
            routes: [{ name: 'LoginScreen' }], // Имя экрана входа
          });
        }
      //}
    //]);
  //};

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
      <View style={styles.footer}>
            <TouchableOpacity style={styles.footerBtn} onPress={()=>navigation.navigate('CreateRequest')} >
                <ImageBackground source={require('../images/CrReq.png')} style={{width:'100%',height:'100%'}}></ImageBackground>
            </TouchableOpacity>
            {UserSession.role === 'Admin' ?(<TouchableOpacity style={[styles.footerBtn]} onPress={()=>navigation.navigate('AdminRequests')}>
            <ImageBackground source={require('../images/List.png')} style={{width:'100%',height:'100%'}}></ImageBackground>
            </TouchableOpacity>) 
            : (<TouchableOpacity style={[styles.footerBtn]} onPress={()=>navigation.navigate('UserRequests')}>
                <ImageBackground source={require('../images/List.png')} style={{width:'100%',height:'100%'}}></ImageBackground>
            </TouchableOpacity>)}
            <TouchableOpacity style={styles.footerBtn} onPress={()=>navigation.navigate('Chats')}>
                <ImageBackground source={require('../images/Messages.png')} style={{width:'100%',height:'100%'}}></ImageBackground>
            </TouchableOpacity>
            <TouchableOpacity  style={[styles.footerBtn,{backgroundColor:'#fff'}]} disabled={true}>
                <ImageBackground source={require('../images/Profile.png')} style={{width:'95%',height:'95%'}}></ImageBackground>
            </TouchableOpacity>
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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

export default Account;
