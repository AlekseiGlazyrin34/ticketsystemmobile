import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CreateRequest from './pages/CreateRequest';
import UserRequests from './pages/UserRequests';
import Account from './pages/Account'; 
import LoginScreen from './pages/LoginScreen';
import AdminRequests from './pages/AdminRequests'; 
import UserSession from './UserSession';

export default function App() {
  const Stack = createNativeStackNavigator();
  const role = UserSession.role;
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LoginScreen" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="CreateRequest" component={CreateRequest} />
        <Stack.Screen name="Account" component={Account} />
        {role === 'Admin' ? (
          <Stack.Screen name="Requests" component={AdminRequests} options={{ title: 'Заявки (Админ)' }} />
        ) : (
          <Stack.Screen name="Requests" component={UserRequests} options={{ title: 'Мои заявки' }} />
        )}
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
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
