import { ScrollView, Text } from 'react-native';
import { screenStyles } from '../utils/styles';

// === pestaña Mapa (C1), por ahora solo el título; la cuadrícula de PCs llega en feature/labs-grid ===
export default function LabsGridScreen() {
  return (
    <ScrollView contentContainerStyle={screenStyles.container}>
      <Text style={screenStyles.title} accessibilityRole="header">Elige tu equipo</Text>
      <Text style={screenStyles.subtitle}>Selecciona un equipo disponible en tu laboratorio.</Text>
    </ScrollView>
  );
}
