import React, { useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity, FlatList, TextInput, StyleSheet, ScrollView,Picker
} from 'react-native';

import UserSession from '../UserSession'; 

const AdminRequests = () => {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [status, setStatus] = useState('');
  const [response, setResponse] = useState('');
  const [showDetails, setShowDetails] = useState(false);
  console.log("sfsfds"+UserSession.role)
  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    const res = await UserSession.sendAuthorizedRequest(() =>
      fetch('https://localhost:7006/load-alldata')
    );
    const data = await res.json();
    setRequests(data);
  };

  const loadRequestDetails = async (reqId) => {
    const res = await UserSession.sendAuthorizedRequest(() =>
      fetch(`https://localhost:7006/loadadd-data?reqid=${reqId}`)
    );
    const data = await res.json();
    const req = data[0];

    setSelectedRequest(req);
    setStatus(req.statusName);
    setResponse(req.responseContent || '');
    setShowDetails(true);
  };

  const saveChanges = async () => {
    const res = await UserSession.sendAuthorizedRequest(() =>
      fetch('https://localhost:7006/save-changes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reqId: selectedRequest.requestId,
          statusName: status,
          responseContent: response
        })
      })
    );

    if (res.ok) {
      alert('Изменения сохранены');
      fetchRequests();
      setShowDetails(false);
    } else {
      alert('Ошибка при сохранении');
    }
  };

  if (showDetails && selectedRequest) {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity onPress={() => setShowDetails(false)}>
          <Text style={styles.backArrow}>← Назад</Text>
        </TouchableOpacity>

        <Text style={styles.header}>Подробности запроса</Text>
        <Text>ID: {selectedRequest.requestId}</Text>
        <Text>От: {selectedRequest.username}</Text>
        <Text>Проблема: {selectedRequest.problemName}</Text>
        <Text>Дата/время: {selectedRequest.reqtime}</Text>
        <Text>Приоритет: {selectedRequest.priorityName}</Text>
        <Text>Помещение: {selectedRequest.room}</Text>
        <Text>Описание:</Text>
        <Text style={styles.textBox}>{selectedRequest.description}</Text>
        <Text>Ответ от: {selectedRequest.respusername || '-'}</Text>

        <Text>Ответ:</Text>
        <TextInput
          style={styles.textInput}
          multiline
          value={response}
          onChangeText={setResponse}
        />

        <Text>Статус:</Text>
        <Picker
          selectedValue={status}
          style={styles.picker}
          onValueChange={(itemValue) => setStatus(itemValue)}
        >
          <Picker.Item label="Новый" value="Новый" />
          <Picker.Item label="В работе" value="В работе" />
          <Picker.Item label="Закрыт" value="Закрыт" />
        </Picker>

        <TouchableOpacity style={styles.button} onPress={saveChanges}>
          <Text style={styles.buttonText}>Сохранить изменения</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Мои запросы</Text>
      <FlatList
        data={requests}
        keyExtractor={(item) => item.requestId.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.listItem}
            onPress={() => loadRequestDetails(item.requestId)}
          >
            <Text>Проблема: {item.problemName}</Text>
            <Text>Статус: {item.statusName}</Text>
            <Text>Дата: {item.reqtime}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default AdminRequests;

const styles = StyleSheet.create({
  container: { padding: 20 },
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  listItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#ccc'
  },
  backArrow: {
    fontSize: 18,
    marginBottom: 10,
    color: '#007AFF'
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    minHeight: 80,
    marginVertical: 10
  },
  textBox: {
    padding: 10,
    backgroundColor: '#f1f1f1',
    borderRadius: 5,
    marginVertical: 10
  },
  picker: {
    height: 50,
    marginVertical: 10
  },
  button: {
    backgroundColor: '#4a90e2',
    padding: 12,
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 10
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold'
  }
});
