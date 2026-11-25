import { Pressable, StyleSheet, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { clearSession } from '../utils/session';
import { colors } from '../utils/styles';

// === botón de la derecha del header para cerrar la sesión ===
export default function LogoutButton() {
  const navigation = useNavigation();

  // === borramos token y usuario de SecureStore y regresamos al login ===
  const handleLogout = async () => {
    await clearSession();
    // === replace es del stack de afuera, desde las pestañas también se puede usar ===
    navigation.replace('Login');
  };

  return (
    <Pressable
      accessibilityRole="button"
      onPress={handleLogout}
      android_ripple={{ color: colors.errorBg }}
      hitSlop={4}
      style={styles.button}
    >
      <Text style={styles.text}>Cerrar sesión</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 40,
    marginRight: 16,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: colors.errorBorder,
    borderRadius: 8,
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: colors.white,
  },
  text: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '700',
  },
});
