import { createStaticNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import MainTabs from './MainTabs';

// === aquí se registran las pantallas, la app siempre arranca en Login y sin header ===
const RootStack = createNativeStackNavigator({
  initialRouteName: 'Login',
  screenOptions: { headerShown: false },
  screens: {
    Login: LoginScreen,
    Register: RegisterScreen,
    // === después del login entramos a las pestañas Mapa y Mi sesión ===
    Main: MainTabs,
  },
});

// === convertimos el stack en un componente para ponerlo en App.js ===
const AppNavigator = createStaticNavigation(RootStack);

export default AppNavigator;
