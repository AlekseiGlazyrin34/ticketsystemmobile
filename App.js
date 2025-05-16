import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CreateRequest from './pages/CreateRequest';
import UserRequests from './pages/UserRequests';
import Account from './pages/Account'; 
import LoginScreen from './pages/LoginScreen';
import AdminRequests from './pages/AdminRequests';
import Chats from './pages/Chats';
import UserSession from './UserSession';
import { createNavigationContainerRef } from '@react-navigation/native';

export default function App() {
  const Stack = createNativeStackNavigator();
  const navigationRef = createNavigationContainerRef();
  
  const [isNavigationReady, setIsNavigationReady] = useState(false);

useEffect(() => {
  if (isNavigationReady) {
    UserSession.setLogoutCallback(() => {
      navigationRef.reset({
        index: 0,
        routes: [{ name: 'LoginScreen' }],
      });
    });
  }
}, [isNavigationReady]);
  

  
  return (
    <NavigationContainer ref={navigationRef}
    onReady={() => setIsNavigationReady(true)}>
      <Stack.Navigator initialRouteName="LoginScreen" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="CreateRequest" component={CreateRequest} />
        <Stack.Screen name="Account" component={Account} />
        <Stack.Screen name="AdminRequests" component={AdminRequests} options={{ title: 'Заявки (Админ)' }} />
        <Stack.Screen name="UserRequests" component={UserRequests} options={{ title: 'Мои заявки' }} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="Chats" component={Chats} />
      </Stack.Navigator>
    </NavigationContainer>
  );
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
