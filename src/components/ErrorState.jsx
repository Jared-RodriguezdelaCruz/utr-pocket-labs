import { StyleSheet, Text, View } from 'react-native';
import PrimaryButton from './PrimaryButton';
import { authStyles, colors } from '../utils/styles';

// === pantalla para cuando falla la carga (error 500 o sin conexión), la van a usar el mapa y mi sesión ===
export default function ErrorState({ isOffline = false, isLoading = false, onRetry }) {
  return (
    <View style={styles.container}>
      <View>
        {/* === bloque oscuro: sin conexión va un monitor tachado, con error del servidor va el 500 === */}
        <View style={styles.codeBlock}>
          {isOffline ? (
            <View style={styles.monitor}>
              <View style={styles.monitorScreen} />
              <View style={styles.monitorNeck} />
              <View style={styles.monitorBase} />
              <View style={styles.monitorCut} />
            </View>
          ) : (
            <Text style={styles.code}>500</Text>
          )}
          <Text style={styles.codeLabel}>{isOffline ? 'SIN CONEXIÓN' : 'ERROR DEL SERVIDOR'}</Text>
        </View>

        <Text style={styles.title} accessibilityRole="header">
          {isOffline ? 'No hay conexión con el servidor' : 'El servidor no respondió bien'}
        </Text>
        <Text style={styles.message}>
          {isOffline ? 'Revisa tu internet y vuelve a intentar.' : 'Hubo un problema de nuestro lado. Intenta de nuevo en unos minutos.'}
        </Text>

        {/* === banner rojo del kit, solo con error del servidor === */}
        {!isOffline && (
          <View style={[authStyles.error, styles.banner]}>
            <Text style={authStyles.errorIcon}>!</Text>
            <Text style={authStyles.errorText}>No se pudo cargar la información.</Text>
          </View>
        )}
      </View>

      {/* === el botón va abajo a todo lo ancho, con isLoading se deshabilita y muestra el spinner === */}
      <PrimaryButton title="Reintentar" isLoading={isLoading} onPress={onRetry} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 16,
    backgroundColor: colors.page,
  },
  codeBlock: {
    gap: 12,
    padding: 24,
    borderRadius: 12,
    backgroundColor: colors.charcoal,
  },
  code: {
    color: colors.white,
    fontSize: 64,
    lineHeight: 70,
    fontWeight: '800',
    letterSpacing: -2,
  },
  codeLabel: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.7,
  },
  // === el monitor se arma con cajitas: pantalla, cuello, base y la raya que lo tacha ===
  monitor: {
    width: 64,
    height: 64,
    alignItems: 'center',
  },
  monitorScreen: {
    width: 60,
    height: 40,
    marginTop: 6,
    borderWidth: 4,
    borderColor: colors.white,
    borderRadius: 6,
  },
  monitorNeck: {
    width: 4,
    height: 8,
    backgroundColor: colors.white,
  },
  monitorBase: {
    width: 28,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.white,
  },
  monitorCut: {
    position: 'absolute',
    top: 28,
    left: -6,
    width: 76,
    height: 8,
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderColor: colors.charcoal,
    backgroundColor: colors.white,
    transform: [{ rotate: '-50deg' }],
  },
  title: {
    marginTop: 24,
    color: colors.text,
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  message: {
    marginTop: 8,
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 21,
  },
  banner: {
    marginTop: 20,
  },
});
