import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../utils/styles';

// === botón rojo que usamos en los formularios, recibe el texto, qué hacer al tocarlo y si está cargando ===
export default function PrimaryButton({ title, onPress, isLoading = false }) {
  return (
    // === con isLoading en true se deshabilita para que no manden la petición dos veces ===
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isLoading, busy: isLoading }}
      disabled={isLoading}
      onPress={onPress}
      android_ripple={{ color: colors.primaryPressed }}
      style={styles.button}
    >
      {/* === mientras carga se ve el spinner con "Cargando...", si no, el texto del botón === */}
      {isLoading ? (
        <View style={styles.loading}>
          <ActivityIndicator color={colors.white} size="small" />
          <Text style={styles.text}>Cargando...</Text>
        </View>
      ) : (
        <Text style={styles.text}>{title}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 48,
    marginTop: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: colors.primary,
  },
  loading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  text: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
});
