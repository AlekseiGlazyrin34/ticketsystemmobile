import { useState } from 'react';
import {
  View,  Text,StyleSheet, TextInput,  TouchableOpacity, Alert, Platform,ImageBackground,Modal,Button} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'react-native';
import UserSession from '../UserSession';
// Основной компонент для создания нового запроса
const CreateRequest = () => {
  const navigation = useNavigation();
  const [problemName, setProblemName] = useState('');
  const [room, setRoom] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Отложенный');
  const priorities = ['Отложенный', 'Срочный', 'Критический'];
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedImage,selectImage] = useState(null);
  const pickImage1 = async () => {
    // Запрос разрешения
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Требуется разрешение на доступ к галерее');
      return;
    }
    // Открытие выбора изображения
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      base64: true,
      quality: 1,
    });
    if (!result.canceled) {
      setImage1({
      uri: result.assets[0].uri,         // для отображения картинки в <Image>
      base64: result.assets[0].base64,   // для отправки на сервер
    });
      // result.assets[0].base64 — изображение в виде строки для сохранения в БД
    }
  };
const pickImage2 = async () => {
    // Запрос разрешения
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Требуется разрешение на доступ к галерее');
      return;
    }
    // Открытие выбора изображения
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      base64: true,
      quality: 1,
    });
    if (!result.canceled) {
      setImage2({
      uri: result.assets[0].uri,         // для отображения картинки в <Image>
      base64: result.assets[0].base64,   // для отправки на сервер
    });
      // result.assets[0].base64 — изображение в виде строки для сохранения в БД
    }
  };
  const handleSubmit = async () => {
    // Проверка заполнения обязательных полей
    if (!problemName || !room || !description) {
      Alert.alert('Ошибка', 'Пожалуйста, заполните все поля');
      return;
    }
    try {
      // Отправка данных на сервер
      const response = await UserSession.sendAuthorizedRequest(() => ({
        url: 'http://192.168.2.62:7006/send-request', 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          problemName,
          room,
          priority: priority,
          description,
          image1:image1?.base64 || null,
          image2:image2?.base64 || null
        }),
      }));
      // Обработка ответа от сервера
      if (response.ok) {
        Alert.alert('Успех', 'Запрос успешно отправлен');
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
  const saveBase64ToGallery = async (base64Data) => {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        
        Alert.alert('Ошибка', 'Нет разрешения на сохранение изображений');
        return;
      }
      try {
        const fileUri = FileSystem.cacheDirectory + `request_image_${Date.now()}.jpg`;
  
        // Сохраняем base64 в файл
        await FileSystem.writeAsStringAsync(fileUri, base64Data, {
          encoding: FileSystem.EncodingType.Base64,
        });
        // Сохраняем файл в галерею
        const asset = await MediaLibrary.createAssetAsync(fileUri);
        await MediaLibrary.createAlbumAsync('TicketSystem', asset, false);
  
        Alert.alert('Успешно', 'Изображение сохранено в галерею');
      } catch (err) {
        console.error('Ошибка сохранения:', err);
        Alert.alert('Ошибка', 'Не удалось сохранить изображение');
      }
    };
  return (
    <View style={styles.container}>
      <View style={{backgroundColor:'#4371e6',height:'7%',justifyContent:'space-around'}}>
          <Text style={styles.header}>Создание запроса</Text>
      </View>
      <Text style={styles.label}>Проблема</Text>
      <TextInput
        maxLength={30}
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
      <View style={{flexDirection:'row',justifyContent:'space-between',marginHorizontal:20}}>
      <TouchableOpacity style={styles.imageButton1} title="Выбрать изображение" onPress={pickImage1}>
        <Text style={styles.buttonText}>Выбрать изображение</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.imageButton2} title="Выбрать изображение" onPress={pickImage2}>
        <Text style={styles.buttonText}>Выбрать изображение</Text>
      </TouchableOpacity>
      </View>
      <View style={{flexDirection:'row',justifyContent:'space-between',marginHorizontal:20}}>
        {image1 && <TouchableOpacity style={{ width:'47%', height: 190,borderWidth:1,alignSelf:'center' }} onPress={() => {setShowCreateDialog(true);selectImage(image1)}}>
         <Image source={{ uri: image1.uri }} style={{ width:'100%',height:'100%' }} resizeMode="stretch"/>
        </TouchableOpacity>}
         {image2 && <TouchableOpacity style={{ width:'47%', height: 190,borderWidth:1,alignSelf:'center' }} onPress={() => {setShowCreateDialog(true);selectImage(image2)}}>
         <Image source={{ uri: image2.uri }} style={{ width:'100%',height:'100%' }} />
        </TouchableOpacity>}
      </View> 
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Создать запрос</Text>
      </TouchableOpacity>
      {selectedImage && <Modal visible={showCreateDialog} animationType="slide" transparent={true}>
        <View style={{ flex: 1, backgroundColor: '#000000aa', justifyContent: 'center' }}>
             <Image source={{ uri: selectedImage.uri }} style={{ width:'80%', height: '70%',borderWidth:1,alignSelf:'center' }} />
            <View style={{ flexDirection: 'row', justifyContent: 'space-around',marginTop: 15 }}>
              <Button title="Скачать" onPress={() =>saveBase64ToGallery(selectedImage.base64)} />
              <Button title="Назад" onPress={() => setShowCreateDialog(false)} />
            </View>
          </View>
      </Modal>}
      <View style={styles.footer}>
            <TouchableOpacity style={[styles.footerBtn,{backgroundColor:'#f5f7fc'}]}  disabled={true}>
                <ImageBackground source={require('../images/CrReq.png')} style={{width:'100%',height:'100%'}}></ImageBackground>
            </TouchableOpacity>
            {UserSession.role === 'Admin' ?(<TouchableOpacity style={[styles.footerBtn]} onPress={()=>navigation.navigate('AdminRequests')}>
                <ImageBackground source={require('../images/ListW.png')} style={{width:'100%',height:'100%'}}></ImageBackground>
            </TouchableOpacity>) 
            : (<TouchableOpacity style={[styles.footerBtn]} onPress={()=>navigation.navigate('UserRequests')}>
                <ImageBackground source={require('../images/ListW.png')} style={{width:'100%',height:'100%'}}></ImageBackground>
            </TouchableOpacity>)}
            <TouchableOpacity style={styles.footerBtn} onPress={()=>navigation.navigate('Chats')}>
                <ImageBackground source={require('../images/MessagesW.png')} style={{width:'100%',height:'100%'}}></ImageBackground>
            </TouchableOpacity>
            <TouchableOpacity  style={styles.footerBtn} onPress={()=>navigation.navigate('Account')}>
                <ImageBackground source={require('../images/ProfileW.png')} style={{width:'100%',height:'100%'}}></ImageBackground>
            </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    padding: 0,
    flex: 1,
    paddingHorizontal:0,
    backgroundColor:'#f5f7fc'
  },
  header: { fontSize: 20, fontWeight: 'bold',marginHorizontal:20,color:'#f5f7fc' },
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
    marginHorizontal: 20,
    
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
    marginHorizontal: 20,
    
  },
  pickerAndroid: {
    height: 50,
    width: '100%',
    marginHorizontal: 0
  },
  button: {
    marginTop: 10,
    backgroundColor: '#109c35',
    padding: 12,
    borderRadius: 5,
    borderColor: '#19e04e',
    alignItems: 'center',
    marginHorizontal: 20
  },
  imageButton1: {
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: '#4371e6',
    padding: 8,
    borderRadius: 5,
    borderColor: '#19e04e',
    width:'47%',
    height:50
  },
  imageButton2: {
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: '#4371e6',
    padding: 8,
    borderRadius: 5,
    borderColor: '#19e04e',
    width:'47%',
    height:50
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign:'center'
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
    borderTopWidth:0,
    borderColor:'#f5f7fc'
  },
});
export default CreateRequest;

  

