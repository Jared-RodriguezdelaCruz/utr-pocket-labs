import { createStaticNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AssignComputerScreen from '../screens/AssignComputerScreen';
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
    // === C2 sale encima del mapa como hoja desde abajo, transparente para que se vea el mapa detrás ===
    AssignComputer: {
      screen: AssignComputerScreen,
      options: { presentation: 'transparentModal', animation: 'slide_from_bottom' },
    },
  },
});

// === convertimos el stack en un componente para ponerlo en App.js ===
const AppNavigator = createStaticNavigation(RootStack);

export default AppNavigator;
