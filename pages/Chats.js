import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, StyleSheet,ImageBackground } from 'react-native';
import UserSession from '../UserSession';
import { useNavigation } from '@react-navigation/native';


const Chats = () => {
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [inputText, setInputText] = useState('');
  var chatsurl;
  const navigation = useNavigation();
  useEffect(() => {
    fetchChats();
  }, []);

  if (UserSession.role == 'Admin') chatsurl = 'https://localhost:7006/get-adminchats'
  else chatsurl = 'https://localhost:7006/get-chats'
  

  const fetchChats = async () => {
    try {
      const response = await UserSession.sendAuthorizedRequest(() => ({
        url: chatsurl,
        method: 'GET',
        headers: {}
      }));
      const data = await response.json();
      setChats(data);
       
    } catch (e) {
      console.error('Ошибка загрузки чатов:', e);
    }
  };

  const fetchMessages = async (chatId) => {
    try {
      const response = await UserSession.sendAuthorizedRequest(() => ({
        url: `https://localhost:7006/get-messages?chatId=${chatId}`,
        method: 'GET',
        headers: {}
      }));
      const data = await response.json();
      setMessages(data);
      setCurrentChatId(chatId);

    } catch (e) {
      console.error('Ошибка загрузки сообщений:', e);
    }
  };

  const sendMessage = async () => {
    if (!inputText) return;

    try {
      await UserSession.sendAuthorizedRequest(() => ({
        url: `https://localhost:7006/send-message`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chatId: currentChatId, content: inputText })
      }));
      console.log(inputText);
      setInputText('');
      fetchMessages(currentChatId);
    } catch (e) {
      console.error('Ошибка отправки сообщения:', e);
    }
  };

  const renderChatList = () => (
    <View style={styles.container1}>
    <Text style={styles.title}>Сообщения</Text>
    <FlatList
      data={chats}
      keyExtractor={(item) => item.chatId.toString()}
      renderItem={({ item }) => (
        <TouchableOpacity style={styles.chatItem} onPress={() => fetchMessages(item.chatId)}>
          <View style={{flexDirection:'row',justifyContent:'space-between'}}>
            <Text style={styles.chatTitle}>{item.userName}</Text>
            <Text style={{}}>{new Date(item.lastUpdated).toLocaleString()}</Text>
          </View>
          <Text>{item.lastMessage}</Text>
        </TouchableOpacity>
      )}
    />
    <View style={styles.footer}>
            <TouchableOpacity style={styles.footerBtn} onPress={()=>navigation.navigate('CreateRequest')} >
              <ImageBackground source={require('../images/CrReq.png')} style={{width:'100%',height:'100%'}} />
            </TouchableOpacity>
            {UserSession.role === 'Admin' ?(<TouchableOpacity style={[styles.footerBtn]} onPress={()=>navigation.navigate('AdminRequests')}>
            <ImageBackground source={require('../images/List.png')} style={{width:'100%',height:'100%'}}></ImageBackground>
            </TouchableOpacity>) 
            : (<TouchableOpacity style={[styles.footerBtn]} onPress={()=>navigation.navigate('UserRequests')}>
                <ImageBackground source={require('../images/List.png')} style={{width:'100%',height:'100%'}}></ImageBackground>
            </TouchableOpacity>)}
            <TouchableOpacity style={[styles.footerBtn,{backgroundColor:'#fff'}]} disabled={true}>
              <ImageBackground source={require('../images/Messages.png')} style={{width:'100%',height:'100%'}} />
            </TouchableOpacity>
            <TouchableOpacity  style={styles.footerBtn} onPress={()=>navigation.navigate('Account')}>
              <ImageBackground source={require('../images/Profile.png')} style={{width:'95%',height:'95%'}} />
            </TouchableOpacity>
          </View>
    </View>
  );

  const renderMessages = () => (
    <View style={styles.container2}>
      <TouchableOpacity onPress={() => {setCurrentChatId(null);fetchChats()}}>
        <Text style={styles.backButton}>← Назад</Text>
      </TouchableOpacity>
      <FlatList
        data={messages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.messageItem}>
            <Text style={{ fontWeight: 'bold' }}>{item.senderName}</Text>
            <Text>{item.content}</Text>
          </View>
        )}
      />
      <View style={styles.inputContainer}>
        <TextInput
          value={inputText}
          onChangeText={setInputText}
          style={styles.input}
          placeholder="Введите сообщение"
        />
        <TouchableOpacity onPress={sendMessage}>
          <Text style={styles.sendButton}>Отправить</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return currentChatId ? renderMessages() : renderChatList();
};

const styles = StyleSheet.create({
  container1: { flex: 1, padding: 0 },
  container2: { flex: 1, padding: 20 },
  chatItem: { padding: 15, borderBottomWidth: 1, borderColor: '#ccc' },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
    marginHorizontal:10
  },
  chatTitle: { fontSize: 16,fontWeight:'bold' },
  backButton: { fontSize: 18, marginBottom: 10 },
  messageItem: { padding: 10, borderBottomWidth: 1, borderColor: '#ddd' },
  inputContainer: { flexDirection: 'row', paddingTop: 10 },
  input: { flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 5 },
  sendButton: { paddingHorizontal: 10, justifyContent: 'center', color: 'blue' },
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

export default Chats;
