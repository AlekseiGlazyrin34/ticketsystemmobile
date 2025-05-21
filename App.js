import  { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CreateRequest from './pages/CreateRequest';
import UserRequests from './pages/UserRequests';
import Account from './pages/Account'; 
import LoginScreen from './pages/LoginScreen';
import AdminRequests from './pages/AdminRequests';
import Chats from './pages/Chats';
import UserSession from './UserSession';
import Registration from './pages/Registration';
import { StatusBar } from 'react-native';
import { createNavigationContainerRef } from '@react-navigation/native';
export default function App() {
  const Stack = createNativeStackNavigator();
  const navigationRef = createNavigationContainerRef();
  const [isNavigationReady, setIsNavigationReady] = useState(false);
useEffect(() => {
  StatusBar.setHidden(true);
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
        <Stack.Screen name="Registration" component={Registration} />
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
