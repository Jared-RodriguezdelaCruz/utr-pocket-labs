import Ionicons from '@expo/vector-icons/Ionicons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HeaderBrand from '../components/HeaderBrand';
import LogoutButton from '../components/LogoutButton';
import ActiveSessionScreen from '../screens/ActiveSessionScreen';
import LabsGridScreen from '../screens/LabsGridScreen';
import { colors } from '../utils/styles';

// === íconos de la barra de abajo, la barra les manda el color (rojo si la pestaña está activa) ===
function MapTabIcon({ color, size }) {
  return <Ionicons name="grid-outline" color={color} size={size} />;
}

function SessionTabIcon({ color, size }) {
  return <Ionicons name="time-outline" color={color} size={size} />;
}

// === pestañas de la app ya con sesión: Mapa (C1) y Mi sesión (C3), con el logo y Cerrar sesión arriba ===
const MainTabs = createBottomTabNavigator({
  screenOptions: {
    headerTitle: () => <HeaderBrand />,
    headerTitleAlign: 'left',
    headerRight: () => <LogoutButton />,
    tabBarActiveTintColor: colors.primary,
    tabBarInactiveTintColor: colors.textSecondary,
    tabBarLabelStyle: { fontSize: 12, fontWeight: '700' },
    sceneStyle: { backgroundColor: colors.page },
  },
  screens: {
    LabsGrid: {
      screen: LabsGridScreen,
      options: { title: 'Mapa', tabBarIcon: MapTabIcon },
    },
    ActiveSession: {
      screen: ActiveSessionScreen,
      options: { title: 'Mi sesión', tabBarIcon: SessionTabIcon },
    },
  },
});

export default MainTabs;
