import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import PrimaryButton from '../components/PrimaryButton';
import { assignComputer } from '../services/labService';
import { SESSION_HOURS } from '../utils/constants';
import { getErrorMessage } from '../utils/httpErrors';
import { getStoredUser } from '../utils/session';
import { authStyles, colors } from '../utils/styles';

// === C2 asignar equipo: hoja que sale desde abajo encima del mapa, recibe la PC en los params ===
export default function AssignComputerScreen() {
  const navigation = useNavigation();
  const { computer } = useRoute().params;
  // === insets.bottom es el espacio de la barra de gestos del celular ===
  const insets = useSafeAreaInsets();
  // === estados: materia y horas del form, si está cargando y el mensaje de error ===
  const [form, setForm] = useState({ materia: '', horasUso: 2 });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // === se llama cada vez que el usuario escribe la materia ===
  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  // === al tocar una hora del segmentado la guardamos en el form ===
  const handleHoursChange = (hours) => {
    setForm({ ...form, horasUso: hours });
  };

  // === Cancelar o tocar el fondo oscuro: regresamos al mapa, menos mientras se manda la asignación ===
  const handleClose = () => {
    if (!isLoading) navigation.goBack();
  };

  // === se ejecuta al presionar "Confirmar asignación" ===
  const handleSubmit = async () => {
    setError('');
    // === sin materia no mandamos nada a la API ===
    if (!form.materia.trim()) {
      setError('Escribe el nombre de tu materia.');
      return;
    }

    // === mientras isLoading esté en true el botón se bloquea y muestra el spinner ===
    setIsLoading(true);
    try {
      // === el id del usuario sale de la sesión guardada en SecureStore ===
      const user = await getStoredUser();
      // === llamada a la API, horasUso ya es número porque sale del segmentado ===
      await assignComputer({
        computerId: computer.id,
        userId: user.id,
        materia: form.materia.trim(),
        horasUso: form.horasUso,
      });
      // === si sale bien cerramos la hoja y abrimos la pestaña Mi sesión ===
      navigation.popTo('Main', { screen: 'ActiveSession' });
    } catch (requestError) {
      const status = requestError.response?.status;
      // === 401: el apiClient ya borró la sesión, reset para que atrás no regrese a las pestañas ===
      if (status === 401) {
        navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
      } else if (status === 403) {
        Alert.alert('Acceso restringido', getErrorMessage(requestError));
      } else {
        // === por ejemplo un 409 si alguien ya tomó la PC o ya tienes otra asignada ===
        setError(getErrorMessage(requestError));
      }
    } finally {
      // === pase lo que pase quitamos el estado de carga ===
      setIsLoading(false);
    }
  };

  return (
    // === padding en las dos plataformas: con edge-to-edge Android ya no se encoge solo con el teclado ===
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      {/* === fondo oscuro, al tocarlo se cierra la hoja === */}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Cerrar"
        onPress={handleClose}
        style={styles.backdrop}
      />

      <View style={[styles.sheet, { paddingBottom: 16 + insets.bottom }]}>
        {/* === rayita de arriba que marca que es una hoja === */}
        <View style={styles.grabber} />
        <Text style={styles.title} accessibilityRole="header">Asignar equipo</Text>
        <Text style={styles.subtitle}>{computer.numeroInventario} · {computer.laboratorio}</Text>

        {/* === el banner de error solo aparece si error tiene texto === */}
        {error ? (
          <View style={[authStyles.error, styles.error]} accessibilityRole="alert">
            <Text style={authStyles.errorIcon}>!</Text>
            <Text style={authStyles.errorText}>{error}</Text>
          </View>
        ) : null}

        {/* === segmentado de horas, la elegida se pinta en rojo === */}
        <Text style={[authStyles.label, styles.label]}>Duración de la sesión</Text>
        <View style={styles.segmented}>
          {SESSION_HOURS.map((hours) => (
            <Pressable
              key={hours}
              accessibilityRole="button"
              accessibilityState={{ selected: hours === form.horasUso }}
              onPress={() => handleHoursChange(hours)}
              style={[styles.segment, hours === form.horasUso && styles.segmentActive]}
            >
              <Text style={[styles.segmentText, hours === form.horasUso && styles.segmentTextActive]}>{hours} h</Text>
            </Pressable>
          ))}
        </View>

        {/* === input controlado de la materia === */}
        <Text style={[authStyles.label, styles.label]}>Materia</Text>
        <TextInput
          style={authStyles.input}
          value={form.materia}
          onChangeText={(text) => handleChange('materia', text)}
          placeholder="Desarrollo de aplicaciones web"
          placeholderTextColor={colors.placeholder}
          returnKeyType="done"
          onSubmitEditing={handleSubmit}
          accessibilityLabel="Materia"
        />
        <Text style={[authStyles.hint, styles.hint]}>Escribe el nombre de tu materia.</Text>

        <PrimaryButton title="Confirmar asignación" isLoading={isLoading} onPress={handleSubmit} />
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ disabled: isLoading }}
          disabled={isLoading}
          onPress={handleClose}
          style={styles.cancel}
        >
          <Text style={styles.cancelText}>Cancelar</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
  },
  sheet: {
    paddingTop: 8,
    paddingHorizontal: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    backgroundColor: colors.white,
  },
  grabber: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    marginBottom: 16,
    borderRadius: 2,
    backgroundColor: colors.border,
  },
  title: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '800',
  },
  subtitle: {
    marginTop: 4,
    marginBottom: 8,
    color: colors.textSecondary,
    fontSize: 14,
  },
  error: {
    marginTop: 8,
  },
  label: {
    marginTop: 12,
    marginBottom: 6,
  },
  segmented: {
    flexDirection: 'row',
    gap: 4,
    padding: 4,
    borderRadius: 8,
    backgroundColor: colors.surface,
  },
  segment: {
    flex: 1,
    height: 40,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentActive: {
    backgroundColor: colors.primary,
  },
  segmentText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '700',
  },
  segmentTextActive: {
    color: colors.white,
  },
  hint: {
    marginTop: 6,
  },
  cancel: {
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  cancelText: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '700',
  },
});
