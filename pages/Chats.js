import { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, StyleSheet,ImageBackground,Modal,Button, ActivityIndicator } from 'react-native';
import UserSession from '../UserSession';
import { useNavigation } from '@react-navigation/native';
const Chats = () => {
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [inputText, setInputText] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [usersList, setUsersList] = useState([]);
  var chatsurl;
  const navigation = useNavigation();
  useEffect(() => {
    fetchChats();
  }, []);
  if (UserSession.role == 'Admin') chatsurl = 'http://192.168.2.62:7006/get-adminchats' //запрос чатов админа
  else chatsurl = 'http://192.168.2.62:7006/get-chats' //запрос чатов апользователя
  const fetchUsers = async () => {
    const res = await UserSession.sendAuthorizedRequest(() => ({
      url: 'http://192.168.2.62:7006/get-admins',  //запрос списка админов
      method: 'GET',
      headers: {}
    }));
    const data = await res.json();
    setUsersList(data);
  };
  const createChat = async () => {
    if (!selectedUserId) return alert('Выберите пользователя');
    await UserSession.sendAuthorizedRequest(() => ({
      url: `http://192.168.2.62:7006/create-chat?userId=${selectedUserId}`, //создание чата с другим админом
      method: 'POST',
      headers: {}
    }));
    setShowCreateDialog(false);
    fetchChats();
  };
  const openCreateDialog = async () => {
    await fetchUsers();
    setShowCreateDialog(true);
  };
  const fetchChats = async () => {
    try {
      setIsLoading(true);
      const response = await UserSession.sendAuthorizedRequest(() => ({
        url: chatsurl,
        method: 'GET',
        headers: {}
      }));
      const data = await response.json();
      setChats(data);
      setIsLoading(false);
    } catch (e) {
      console.error('Ошибка загрузки чатов:', e);
    }
  };
  const fetchMessages = async (chatId) => {
    try {
      const response = await UserSession.sendAuthorizedRequest(() => ({
        url: `http://192.168.2.62:7006/get-messages?chatId=${chatId}`, //получить сообщения
        method: 'GET',
        headers: {}
      }));
      const data = await response.json();
      setMessages(data);
      setCurrentChatId(chatId); // Устанавливаем текущий чат
    } catch (e) {
      console.error('Ошибка загрузки сообщений:', e);
    }
  };
  const sendMessage = async () => {
    if (!inputText) return; // Не отправляем пустые сообщения
    try {
      await UserSession.sendAuthorizedRequest(() => ({
        url: `http://192.168.2.62:7006/send-message`, //отправить сообщение
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chatId: currentChatId, content: inputText })
      }));
      console.log(inputText);
      setInputText(''); // Очищаем поле ввода
      fetchMessages(currentChatId);// Обновляем сообщения
    } catch (e) {
      console.error('Ошибка отправки сообщения:', e);
    }
  };
  // Рендер списка чатов
  const renderChatList = () => (
    <View style={styles.container1}>
    <View style={{backgroundColor:'#4371e6',height:'7%',alignItems: 'center', justifyContent: 'space-between',flexDirection:'row'}}>
        <Text style={styles.header}>Сообщения</Text>
         {UserSession.role === 'Admin' && (
        <TouchableOpacity style={{ width:'30%',height:'45%',backgroundColor:'#f5f7fc',marginHorizontal:20,borderRadius:10,justifyContent:'center'}} onPress={openCreateDialog} /* Шапка экрана с кнопкой создания чата (для админа) */>
          <Text style={{ textAlign: 'center', color: '#4371e6',fontSize: 15, fontWeight: 'bold' }}>Создать чат</Text>
        </TouchableOpacity>
  )}
    </View>
    {isLoading ? ( /* Индикатор загрузки или список чатов */
        <View style={{ height: '83%', justifyContent: 'center', alignItems: 'center',backgroundColor:'#f5f7fc' }}>
          <ActivityIndicator size="large" color="#4371e6" />
        </View>
      ) : chats.length > 0 ? (
    <View style={{ height:'83%'}}>
    <FlatList
      data={chats}
      style={{backgroundColor:'#f5f7fc'}}
      keyExtractor={(item) => item.chatId.toString()}
      renderItem={({ item }) => (
        <TouchableOpacity style={styles.chatItem} onPress={() => fetchMessages(item.chatId)}>
          <View style={{flexDirection:'row',justifyContent:'space-between'}}>
            <Text style={styles.chatTitle}>{item.userName}</Text> 
          </View>
          <Text style={{fontWeight:'bold'}}>{item.problemName}</Text>
          <View style={{flexDirection:'row',justifyContent:'space-between'}}>
            <Text>{item.lastMessage}</Text>
            <Text style={{}}>{new Date(item.lastUpdated).toLocaleString()}</Text>
          </View>
        </TouchableOpacity>
      )}
    />
    </View>) : (<View style={{ height:'83%',justifyContent:'center',alignItems:'center',backgroundColor:'#f5f7fc'}}><Text style={{fontWeight:'bold',fontSize:20}}>На данный момент сообщений нет</Text></View>) }
  <Modal visible={showCreateDialog} animationType="slide" transparent={true} /* Модальное окно для создания нового чата */>
  <View style={{ flex: 1, backgroundColor: '#000000aa', justifyContent: 'center' }}>
    <View style={{ backgroundColor: 'white', margin: 20, padding: 20, borderRadius: 10 }}>
      <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Создать чат</Text>
      
      <Text style={{ marginTop: 10 }}>Выберите пользователя:</Text>
      <FlatList
        data={usersList}
        keyExtractor={(item) => item.userId.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => setSelectedUserId(item.userId)}>
            <Text style={{
              padding: 10,
              backgroundColor: selectedUserId === item.userId ? '#ddd' : '#f9f9f9',
              marginVertical: 2,
              borderRadius: 5
            }}>
              {item.username}
            </Text>
          </TouchableOpacity>
        )}
      />
      <View style={{ flexDirection: 'row', justifyContent: 'space-between',marginTop: 15 }}>
        <Button title="Создать" onPress={createChat} />
        <Button title="Отмена" onPress={() => setShowCreateDialog(false)} />
      </View>
    </View>
  </View>
</Modal>
    <View style={styles.footer} /* Нижнее меню навигации */>
            <TouchableOpacity style={styles.footerBtn} onPress={()=>navigation.navigate('CreateRequest')} >
              <ImageBackground source={require('../images/CrReqW.png')} style={{width:'100%',height:'100%'}} />
            </TouchableOpacity>
            {UserSession.role === 'Admin' ?(<TouchableOpacity style={[styles.footerBtn]} onPress={()=>navigation.navigate('AdminRequests')}>
            <ImageBackground source={require('../images/ListW.png')} style={{width:'100%',height:'100%'}}></ImageBackground>
            </TouchableOpacity>) 
            : (<TouchableOpacity style={[styles.footerBtn]} onPress={()=>navigation.navigate('UserRequests')}>
                <ImageBackground source={require('../images/ListW.png')} style={{width:'100%',height:'100%'}}></ImageBackground>
            </TouchableOpacity>)}
            <TouchableOpacity style={[styles.footerBtn,{backgroundColor:'#f5f7fc'}]} disabled={true}>
              <ImageBackground source={require('../images/Messages.png')} style={{width:'100%',height:'100%'}} />
            </TouchableOpacity>
            <TouchableOpacity  style={styles.footerBtn} onPress={()=>navigation.navigate('Account')}>
              <ImageBackground source={require('../images/ProfileW.png')} style={{width:'100%',height:'100%'}} />
            </TouchableOpacity>
          </View>
    </View>
  );
  // Рендер экрана с сообщениями конкретного чата
  const renderMessages = () => (
    <View style={styles.container2} /* Шапка с кнопкой возврата */>
      <View style={{backgroundColor:'#4371e6',height:'7%',alignItems: 'center', justifyContent: 'space-between',flexDirection:'row'}}>
      <TouchableOpacity onPress={() => {setCurrentChatId(null);fetchChats()}}>
        <Text style={styles.header}>← Назад</Text>
      </TouchableOpacity>
    </View>
    <View style={{ height:'85%'}} /* Список сообщений */>
      <FlatList
        data={messages}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{ paddingVertical: 10 }}
        renderItem={({ item }) => (
          <View style={[
            styles.messageContainer,
            item.senderName === UserSession.username ? styles.myMessage : styles.otherMessage
          ]}>
            {item.senderName !== UserSession.username && (
              <Text style={styles.senderName}>{item.senderName}</Text>
            )}
            <View style={[
              styles.messageBubble,
              item.senderName === UserSession.username ? styles.myBubble : styles.otherBubble
            ]}>
              <Text style={styles.messageText}>{item.content}</Text>

            </View>
            <Text style={[item.senderName === UserSession.username ? styles.myMessageTime : styles.otherMessageTime]}>
              {new Date(item.sentTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </View>
        )}
      />
      </View>
      <View style={styles.inputContainer} /* Поле ввода сообщения */>
        <TextInput
          value={inputText}
          onChangeText={setInputText}
          style={styles.input}
          placeholder="Введите сообщение"
        />
        <TouchableOpacity style={{backgroundColor:'#4371e6',margin:5,borderRadius:10,justifyContent:'center'}} onPress={sendMessage}>
          <Text style={styles.sendButton}>Отправить</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
  // Возвращаем либо список чатов, либо сообщения в зависимости от currentChatId
  return currentChatId ? renderMessages() : renderChatList();
};
const styles = StyleSheet.create({
  container1: { flex: 1, paddingTop:0,backgroundColor:'#4371e6' },
  container2: { flex: 1, padding: 0 },
  chatItem: { padding: 15, borderBottomWidth: 1, borderColor: '#ccc' },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
    marginHorizontal:10
  },
  chatTitle: { fontSize: 16,fontWeight:'bold' },
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 0,marginHorizontal:20,color:'#f5f7fc' },
  backButton: { fontSize: 18, marginBottom: 10 },
  messageItem: { padding: 10, borderBottomWidth: 1, borderColor: '#ddd' },
  inputContainer: { flexDirection: 'row', paddingTop: 0,height:'8%',borderWidth: 1,borderColor: '#ccc' },
  input: { flex: 1, padding: 5,marginBottom:0 },
  sendButton: { paddingHorizontal: 10, justifyContent: 'center', color: 'blue',fontWeight:'bold',color:'#f5f7fc',fontSize:10 },
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
  messageContainer: {
    marginVertical: 4,
    paddingHorizontal: 12,
  },
  myMessage: {
    alignItems: 'flex-end',
  },
  otherMessage: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 12,
    marginTop: 4,
  },
  myBubble: {
    backgroundColor: '#4371e6',
    borderBottomRightRadius: 2, // Острый угол справа
  },
  otherBubble: {
    backgroundColor: '#e5e5ea',
    borderBottomLeftRadius: 2, // Острый угол слева
  },
  messageText: {
    fontSize: 16,
    color: '#000',
  },
  myMessageText: {
    color: '#fff',
  },
  senderName: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  myMessageTime: {
    fontSize: 10,
    color: '#999',
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  otherMessageTime: {
    fontSize: 10,
    color: '#999',
    marginTop: 4,
    alignSelf: 'flex-start',
  },
});
export default Chats;
