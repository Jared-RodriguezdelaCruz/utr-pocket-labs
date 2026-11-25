import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import ErrorState from '../components/ErrorState';
import PrimaryButton from '../components/PrimaryButton';
import { getAssignments, releaseAssignment } from '../services/labService';
import { ASSIGNMENT_STATUS } from '../utils/constants';
import { getErrorMessage } from '../utils/httpErrors';
import { getStoredUser } from '../utils/session';
import { authStyles, colors, screenStyles } from '../utils/styles';

// === pestaña Mi sesión (C3): el equipo asignado, reportar falla y liberarlo ===
export default function ActiveSessionScreen() {
  const navigation = useNavigation();
  // === isFocused vuelve a true cada vez que regresamos a esta pestaña ===
  const isFocused = useIsFocused();
  // === estados: la asignación activa, el form, carga, errores, banner de éxito y reintentos ===
  const [assignment, setAssignment] = useState(null);
  const [form, setForm] = useState({ reporteFalla: false, descripcionFalla: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [retryCount, setRetryCount] = useState(0);

  // === al entrar a la pestaña y al reintentar buscamos si el usuario tiene una PC asignada ===
  useEffect(() => {
    // === con la pestaña escondida no pedimos nada ===
    if (!isFocused) return;
    // === si salimos de la pestaña antes de que llegue la respuesta, la ignoramos ===
    let ignore = false;

    const loadAssignment = async () => {
      setIsLoading(true);
      setError(null);
      // === el banner verde es solo para el momento de liberar ===
      setSuccessMessage('');
      try {
        // === el id del usuario sale de la sesión guardada en SecureStore ===
        const user = await getStoredUser();
        // === llamada a la API, la sesión activa es la ASIGNADA de este usuario ===
        const data = await getAssignments();
        const activeAssignment = data.find(
          (item) => item.estatus === ASSIGNMENT_STATUS.ASIGNADA && item.userId === user?.id,
        );
        if (!ignore) setAssignment(activeAssignment ?? null);
      } catch (requestError) {
        if (ignore) return;
        const status = requestError.response?.status;
        // === 401: el apiClient ya borró la sesión, volvemos al login ===
        if (status === 401) {
          navigation.replace('Login');
        } else if (status === 403) {
          Alert.alert('Acceso restringido', getErrorMessage(requestError));
        } else {
          setError(requestError);
        }
      } finally {
        if (!ignore) setIsLoading(false);
      }
    };

    loadAssignment();

    // === limpieza: corre al salir de la pestaña o antes de reintentar ===
    return () => {
      ignore = true;
    };
  }, [retryCount, isFocused, navigation]);

  // === se llama al marcar el checkbox o al escribir la descripción ===
  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  // === se ejecuta al presionar "Liberar equipo" ===
  const handleRelease = async () => {
    setFormError('');
    // === si reporta falla la API pide una descripción de al menos 5 caracteres ===
    if (form.reporteFalla && form.descripcionFalla.trim().length < 5) {
      setFormError('Describe la falla con al menos 5 caracteres.');
      return;
    }

    // === mientras isLoading esté en true el botón se bloquea y muestra el spinner ===
    setIsLoading(true);
    try {
      // === llamada a la API, sin falla mandamos la descripción vacía ===
      await releaseAssignment(assignment.assignmentId, {
        reporteFalla: form.reporteFalla,
        descripcionFalla: form.reporteFalla ? form.descripcionFalla.trim() : '',
      });
      // === ya no hay equipo: avisamos, limpiamos el form y se ve el estado vacío ===
      setSuccessMessage(form.reporteFalla ? 'Equipo liberado y falla reportada.' : 'Equipo liberado.');
      setForm({ reporteFalla: false, descripcionFalla: '' });
      setAssignment(null);
    } catch (requestError) {
      const status = requestError.response?.status;
      // === 401: el apiClient ya borró la sesión, volvemos al login ===
      if (status === 401) {
        navigation.replace('Login');
      } else if (status === 403) {
        Alert.alert('Acceso restringido', getErrorMessage(requestError));
      } else {
        setFormError(getErrorMessage(requestError));
      }
    } finally {
      // === pase lo que pase quitamos el estado de carga ===
      setIsLoading(false);
    }
  };

  // === botón Reintentar: quitamos el error y sumamos un reintento para que el efecto corra otra vez ===
  const handleRetry = () => {
    setError(null);
    setIsLoading(true);
    setRetryCount(retryCount + 1);
  };

  // === "Ir al mapa" cambia a la pestaña Mapa ===
  const handleGoToMap = () => {
    navigation.navigate('LabsGrid');
  };

  // === si falló la carga se ve la pantalla de error (500 o sin conexión) ===
  if (error) {
    return <ErrorState isOffline={!error.response} isLoading={isLoading} onRetry={handleRetry} />;
  }

  // === lo que va debajo del título: carga, sin equipo o la sesión ===
  let content;
  if (isLoading && !assignment) {
    content = (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Cargando tu sesión...</Text>
      </View>
    );
  } else if (!assignment) {
    content = (
      <View style={styles.card}>
        {/* === banner verde del kit, solo después de liberar === */}
        {successMessage ? (
          <View style={styles.success} accessibilityRole="alert">
            <Ionicons name="checkmark" size={16} color={colors.availableText} />
            <Text style={styles.successText}>{successMessage}</Text>
          </View>
        ) : null}
        <Text style={styles.emptyTitle} accessibilityRole="header">No tienes equipo asignado</Text>
        <Text style={styles.emptyText}>Elige un equipo disponible para comenzar.</Text>
        <PrimaryButton title="Ir al mapa" onPress={handleGoToMap} />
      </View>
    );
  } else {
    content = (
      <>
        {/* === tarjeta oscura con la PC asignada === */}
        <View style={styles.pcCard} accessible accessibilityLabel={`Equipo asignado ${assignment.pc}, ${assignment.laboratorio}`}>
          <Text style={styles.pcLabel}>N.º de inventario</Text>
          <Text style={styles.pcNumber}>{assignment.pc}</Text>
          <Text style={styles.pcLab}>Laboratorio / {assignment.laboratorio}</Text>
          <View style={styles.badge}>
            <View style={styles.badgeDot} />
            <Ionicons name="checkmark" size={12} color={colors.occupiedText} />
            <Text style={styles.badgeText}>En curso</Text>
          </View>
        </View>

        <View style={styles.card}>
          {/* === el banner de error solo aparece si formError tiene texto === */}
          {formError ? (
            <View style={[authStyles.error, styles.error]} accessibilityRole="alert">
              <Text style={authStyles.errorIcon}>!</Text>
              <Text style={authStyles.errorText}>{formError}</Text>
            </View>
          ) : null}

          {/* === checkbox controlado, al marcarlo aparece la descripción === */}
          <Pressable
            accessibilityRole="checkbox"
            accessibilityState={{ checked: form.reporteFalla }}
            onPress={() => handleChange('reporteFalla', !form.reporteFalla)}
            hitSlop={4}
            style={styles.checkRow}
          >
            <View style={[styles.checkbox, form.reporteFalla && styles.checkboxChecked]}>
              {form.reporteFalla ? <Ionicons name="checkmark" size={16} color={colors.white} /> : null}
            </View>
            <Text style={styles.checkText}>Reportar falla</Text>
          </Pressable>

          {form.reporteFalla ? (
            <>
              <Text style={[authStyles.label, styles.label]}>Describe la falla</Text>
              <TextInput
                style={[authStyles.input, styles.textArea]}
                value={form.descripcionFalla}
                onChangeText={(text) => handleChange('descripcionFalla', text)}
                placeholder="El teclado no responde al escribir."
                placeholderTextColor={colors.placeholder}
                multiline
                textAlignVertical="top"
                accessibilityLabel="Describe la falla"
              />
            </>
          ) : (
            <Text style={styles.hint}>Guarda tus archivos antes de liberar el equipo.</Text>
          )}

          <PrimaryButton title="Liberar equipo" isLoading={isLoading} onPress={handleRelease} />
        </View>
      </>
    );
  }

  // === sin equipo el subtítulo cambia, como en Figma ===
  const subtitle = !isLoading && !assignment ? 'Tu próximo espacio de trabajo te espera.' : 'Administra tu equipo asignado.';

  return (
    // === padding en las dos plataformas: con edge-to-edge Android ya no se encoge solo con el teclado ===
    <KeyboardAvoidingView behavior="padding" style={styles.flex}>
      <ScrollView contentContainerStyle={screenStyles.container} keyboardShouldPersistTaps="handled">
        <Text style={screenStyles.title} accessibilityRole="header">Mi sesión</Text>
        <Text style={screenStyles.subtitle}>{subtitle}</Text>
        {content}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  loading: {
    alignItems: 'center',
    gap: 12,
    paddingVertical: 48,
  },
  loadingText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  pcCard: {
    gap: 10,
    marginTop: 20,
    padding: 20,
    borderRadius: 12,
    backgroundColor: colors.charcoal,
  },
  pcLabel: {
    color: '#CBD5E1',
    fontSize: 12,
  },
  pcNumber: {
    color: colors.white,
    fontSize: 28,
    fontWeight: '700',
    fontFamily: Platform.select({ ios: 'Menlo', default: 'monospace' }),
  },
  pcLab: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: colors.errorBorder,
    borderRadius: 6,
    backgroundColor: colors.white,
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.occupiedText,
  },
  badgeText: {
    color: colors.occupiedText,
    fontSize: 12,
    fontWeight: '700',
  },
  card: {
    marginTop: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.white,
  },
  error: {
    marginBottom: 12,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minHeight: 40,
  },
  checkbox: {
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.placeholder,
    borderRadius: 6,
    backgroundColor: colors.white,
  },
  checkboxChecked: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  checkText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  label: {
    marginTop: 12,
    marginBottom: 6,
  },
  textArea: {
    height: 112,
    paddingTop: 12,
  },
  hint: {
    marginTop: 8,
    color: colors.textSecondary,
    fontSize: 13,
  },
  emptyTitle: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '800',
  },
  emptyText: {
    marginTop: 12,
    color: colors.textSecondary,
    fontSize: 14,
  },
  success: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 16,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: colors.availableBorder,
    borderRadius: 8,
    backgroundColor: colors.availableBg,
  },
  successText: {
    flex: 1,
    color: colors.availableText,
    fontSize: 14,
    fontWeight: '600',
  },
});
