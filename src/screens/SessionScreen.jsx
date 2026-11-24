import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { clearSession, getStoredUser } from '../utils/session';
import { colors } from '../utils/styles';

// === pantalla temporal después del login, solo muestra el nombre y deja cerrar sesión ===
export default function SessionScreen() {
  const navigation = useNavigation();
  // === user empieza en null hasta que lo leemos de SecureStore ===
  const [user, setUser] = useState(null);

  // === al abrir la pantalla cargamos el usuario que se guardó en el login ===
  useEffect(() => {
    const loadUser = async () => {
      const storedUser = await getStoredUser();
      // === ya con el usuario lo metemos al estado para que se pinte su nombre ===
      setUser(storedUser);
    };

    loadUser();
  }, []);

  // === borramos token y usuario y regresamos al login ===
  const handleLogout = async () => {
    await clearSession();
    // === replace para que con el botón de atrás no se pueda volver a esta pantalla ===
    navigation.replace('Login');
  };

  return (
    <View style={styles.session}>
      <Text style={styles.sessionTitle}>Sesión iniciada</Text>
      {/* === si todavía no carga el usuario mostramos un nombre genérico === */}
      <Text style={styles.sessionText}>{user?.nombre ?? 'Usuario UTR'}</Text>
      <Pressable accessibilityRole="button" onPress={handleLogout} style={styles.logout}>
        <Text style={styles.logoutText}>Cerrar sesión</Text>
      </Pressable>
    </View>
  );
}

// === mismos colores del kit que usan login y registro ===
const styles = StyleSheet.create({
  session: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: colors.page,
  },
  sessionTitle: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '800',
  },
  sessionText: {
    marginTop: 8,
    color: colors.textSecondary,
    fontSize: 14,
  },
  logout: {
    height: 48,
    marginTop: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    backgroundColor: colors.primary,
  },
  logoutText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
});
