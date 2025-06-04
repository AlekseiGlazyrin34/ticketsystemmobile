import { View, Text, StyleSheet, TouchableOpacity, ImageBackground,Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import UserSession from '../UserSession';
const Account = () => {
  const navigation = useNavigation();
  const user = {
    username: UserSession.username,    // UserSession.Instance.Username
    jobTitle: UserSession.jobTitle,        // UserSession.Instance.JobtTitle
    role: UserSession.role,       // UserSession.Instance.Role
    login: UserSession.login,            // UserSession.Instance.Login
  };
  const handleLogout = () => {
    // Очистить сессию пользователя
    // Навигация на экран авторизации
    console.log('Нажата кнопка выхода');
    Alert.alert('Выход', 'Вы уверены, что хотите выйти?', [
      { text: 'Отмена', style: 'cancel' },
      { text: 'Выйти', style: 'destructive', 
        onPress: () => {
          // очистить сохраненные токены или userData
          UserSession.clear();
          navigation.reset({
            index: 0,
            routes: [{ name: 'LoginScreen' }], // Имя экрана входа
          });
        }
      } 
    ]);
  };
  return (
    <View style={styles.container}>
      <View style={{backgroundColor:'#4371e6',height:'7%',width:'100%',justifyContent:'space-around'}}>
          <Text style={styles.header}>Учетная запись</Text>
      </View>
      <View style={styles.infoBox}  /*Информация об ученой записи*/> 
        <Text style={styles.infoText}>ФИО: {user.username}</Text>
        <Text style={styles.infoText}>Должность: {user.jobTitle}</Text>
        <Text style={styles.infoText}>Роль: {user.role}</Text>
        <Text style={styles.infoText}>Логин: {user.login}</Text>
      </View>
      {UserSession.role === 'Admin' && (<TouchableOpacity style={[styles.logoutButton,{backgroundColor: '#109c35',borderColor: '#19e04e'}]} onPress={()=>navigation.navigate('Registration')}>
        <Text style={styles.logoutButtonText}/*Кнопка добавления пользователя для админа*/>Добавить пользователя</Text> 
      </TouchableOpacity>)}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}/*Кнопка выхода из системы*/>Выйти из системы</Text> 
      </TouchableOpacity>
      <View style={styles.footer}/*Панел меню*/> 
            <TouchableOpacity style={styles.footerBtn} onPress={()=>navigation.navigate('CreateRequest')} /*Кнопка создания запроса*/> 
                <ImageBackground source={require('../images/CrReqW.png')} style={{width:'100%',height:'100%'}}></ImageBackground> 
            </TouchableOpacity>
            {UserSession.role === 'Admin' ?(<TouchableOpacity style={[styles.footerBtn]} onPress={()=>navigation.navigate('AdminRequests')}/*Кнопка просмотра запросов для админа*/> 
            <ImageBackground source={require('../images/ListW.png')} style={{width:'100%',height:'100%'}}></ImageBackground>
            </TouchableOpacity>) 
            : (<TouchableOpacity style={[styles.footerBtn]} onPress={()=>navigation.navigate('UserRequests')}/*Кнопка просмотра запросов для пользователя*/> 
                <ImageBackground source={require('../images/ListW.png')} style={{width:'100%',height:'100%'}}></ImageBackground>
            </TouchableOpacity>)}
            <TouchableOpacity style={styles.footerBtn} onPress={()=>navigation.navigate('Chats')}/*Кнопка просмотра чатов*/> 
                <ImageBackground source={require('../images/MessagesW.png')} style={{width:'100%',height:'100%'}}></ImageBackground>
            </TouchableOpacity>
            <TouchableOpacity  style={[styles.footerBtn,{backgroundColor:'#f5f7fc'}]} disabled={true}/*Кнопка страницы учетной записи*/> 
                <ImageBackground source={require('../images/Profile.png')} style={{width:'100%',height:'100%'}}></ImageBackground>
            </TouchableOpacity>
        </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
    alignItems:'center',
    backgroundColor:'#f5f7fc',
  },
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 0,marginHorizontal:20,color:'#f5f7fc' },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 20,
  },
  infoBox: {
    backgroundColor: '#f5f7fc',
    width: '100%',
    padding: 20,
    marginBottom: 10,
  },
  infoText: {
    fontSize: 16,
    marginBottom: 10,
  },
  logoutButton: {
    backgroundColor: 'red',
    borderRadius: 8,
    width:'50%',
    height:'5%',
    justifyContent:'space-around',
    alignItems:'center',
    margin:10
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
  },
  footerBtn:{
    width:'25%',
    height:'100%', 
    backgroundColor: '#4371e6',
    borderWidth:0,
  },
});
export default Account;
