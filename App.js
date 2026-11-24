import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';

// === punto de entrada: SafeAreaProvider para respetar el notch y adentro la navegación ===
export default function App() {
  return (
    <SafeAreaProvider>
      <AppNavigator />
      {/* === iconos de la barra de estado en oscuro porque el fondo es blanco === */}
      <StatusBar style="dark" />
    </SafeAreaProvider>
  );
}
