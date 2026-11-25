import { ScrollView, Text } from 'react-native';
import { screenStyles } from '../utils/styles';

// === pestaña Mi sesión (C3), por ahora solo el título; el equipo asignado llega en feature/active-session ===
export default function ActiveSessionScreen() {
  return (
    <ScrollView contentContainerStyle={screenStyles.container}>
      <Text style={screenStyles.title} accessibilityRole="header">Mi sesión</Text>
      <Text style={screenStyles.subtitle}>Administra tu equipo asignado.</Text>
    </ScrollView>
  );
}
