import { useState } from 'react';
import { Image, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import PrimaryButton from '../components/PrimaryButton';
import { register } from '../services/authService';
import { MATRICULA_REGEX, UTR_EMAIL_REGEX } from '../utils/constants';
import { getErrorMessage } from '../utils/httpErrors';
import { authStyles, colors } from '../utils/styles';

// === form vacío, lo usamos al iniciar y para limpiar después de registrarse ===
const INITIAL_FORM = {
  nombre: '',
  matricula: '',
  email: '',
  password: '',
  confirmPassword: '',
};

export default function RegisterScreen() {
  // === con navigation regresamos al login ===
  const navigation = useNavigation();
  // === estados: los datos del registro, si está cargando y el mensaje de error ===
  const [form, setForm] = useState(INITIAL_FORM);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // === se llama cada vez que el usuario escribe en un input ===
  const handleChange = (field, value) => {
    // === copiamos el form y solo cambiamos el campo que se editó ===
    setForm({ ...form, [field]: value });
  };

  // === se ejecuta al presionar "Crear cuenta" ===
  const handleSubmit = async () => {
    // === limpiamos el error anterior antes de volver a intentar ===
    setError('');

    // === todos los campos son obligatorios ===
    if (
      !form.nombre.trim() ||
      !form.matricula.trim() ||
      !form.email.trim() ||
      !form.password.trim() ||
      !form.confirmPassword.trim()
    ) {
      setError('Completa todos los campos para crear tu cuenta.');
      return;
    }
    // === la matrícula tiene que ser de 4 números ===
    if (!MATRICULA_REGEX.test(form.matricula)) {
      setError('La matrícula debe tener 4 números.');
      return;
    }
    // === el correo tiene que ser institucional ===
    if (!UTR_EMAIL_REGEX.test(form.email.trim())) {
      setError('Usa tu correo institucional (@utr.edu.mx).');
      return;
    }
    // === la API pide contraseñas de al menos 6 caracteres ===
    if (form.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    // === las dos contraseñas tienen que ser iguales ===
    if (form.password !== form.confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    // === mientras isLoading esté en true el botón se bloquea y muestra el spinner ===
    setIsLoading(true);
    try {
      // === mandamos los datos a la API (confirmPassword no se envía), el correo sin espacios ===
      await register({ ...form, email: form.email.trim() });
      // === si salió bien limpiamos el form y mandamos al login ===
      setForm(INITIAL_FORM);
      navigation.navigate('Login');
    } catch (requestError) {
      // === si la API falla mostramos el mensaje que arma getErrorMessage ===
      setError(getErrorMessage(requestError));
    } finally {
      // === pase lo que pase quitamos el estado de carga ===
      setIsLoading(false);
    }
  };

  // === la pestaña "Iniciar sesión" regresa al login ===
  const handleGoToLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <SafeAreaView style={authStyles.safe}>
      <ScrollView
        style={authStyles.scroll}
        contentContainerStyle={authStyles.container}
        keyboardShouldPersistTaps="handled"
      >
        {/* === encabezado con el logo y el nombre de la app === */}
        <View style={authStyles.brand}>
          <Image
            source={require('../../assets/logo-utr.png')}
            style={authStyles.brandLogo}
            resizeMode="contain"
            accessibilityLabel="Universidad Tecnológica El Retoño y BIS Universities"
          />
          <Text style={authStyles.brandText}>UTR Labs</Text>
        </View>
        <Text style={authStyles.title}>Crea tu cuenta</Text>
        <Text style={authStyles.subtitle}>Únete con tus datos institucionales.</Text>

        {/* === pestañas: estamos en registro, la otra regresa al login === */}
        <View style={authStyles.tabs}>
          <Pressable accessibilityRole="button" style={authStyles.tab} onPress={handleGoToLogin}>
            <Text style={authStyles.tabText}>Iniciar sesión</Text>
          </Pressable>
          <View style={[authStyles.tab, authStyles.tabActive]}>
            <Text style={[authStyles.tabText, authStyles.tabTextActive]}>Registro</Text>
          </View>
        </View>

        <View style={authStyles.form}>
          {/* === el banner de error solo aparece si error tiene texto === */}
          {error ? (
            <View style={authStyles.error} accessibilityRole="alert">
              <Text style={authStyles.errorIcon}>!</Text>
              <Text style={authStyles.errorText}>{error}</Text>
            </View>
          ) : null}

          {/* === inputs controlados: cada uno lee su campo de form y abajo va su texto de ayuda === */}
          <Text style={authStyles.label}>Nombre completo</Text>
          <TextInput
            style={authStyles.input}
            value={form.nombre}
            onChangeText={(text) => handleChange('nombre', text)}
            placeholder="Ej. Mariana López"
            placeholderTextColor={colors.placeholder}
            autoComplete="name"
          />
          <Text style={authStyles.hint}>Escribe tu nombre y apellidos.</Text>

          <Text style={authStyles.label}>Matrícula</Text>
          <TextInput
            style={authStyles.input}
            value={form.matricula}
            onChangeText={(text) => handleChange('matricula', text)}
            placeholder="Ej. 1234"
            placeholderTextColor={colors.placeholder}
            keyboardType="number-pad"
            maxLength={4}
          />
          <Text style={authStyles.hint}>Ingresa los 4 dígitos de tu matrícula.</Text>

          <Text style={authStyles.label}>Correo institucional</Text>
          <TextInput
            style={authStyles.input}
            value={form.email}
            onChangeText={(text) => handleChange('email', text)}
            placeholder="nombre@utr.edu.mx"
            placeholderTextColor={colors.placeholder}
            autoCapitalize="none"
            autoComplete="email"
            keyboardType="email-address"
          />
          <Text style={authStyles.hint}>Usa tu cuenta @utr.edu.mx.</Text>

          <Text style={authStyles.label}>Contraseña</Text>
          <TextInput
            style={authStyles.input}
            value={form.password}
            onChangeText={(text) => handleChange('password', text)}
            placeholder="••••••••••"
            placeholderTextColor={colors.placeholder}
            autoComplete="new-password"
            secureTextEntry
          />
          <Text style={authStyles.hint}>Escribe tu contraseña.</Text>

          <Text style={authStyles.label}>Confirmar contraseña</Text>
          <TextInput
            style={authStyles.input}
            value={form.confirmPassword}
            onChangeText={(text) => handleChange('confirmPassword', text)}
            placeholder="••••••••••"
            placeholderTextColor={colors.placeholder}
            autoComplete="new-password"
            secureTextEntry
          />
          <Text style={authStyles.hint}>Repite la misma contraseña.</Text>

          {/* === le pasamos isLoading para que el botón se bloquee mientras responde la API === */}
          <PrimaryButton title="Crear cuenta" onPress={handleSubmit} isLoading={isLoading} />
        </View>

        <Text style={authStyles.support}>
          Al registrarte aceptas el reglamento de los laboratorios.
        </Text>
        <Text style={authStyles.footer}>© 2026 UTR Labs · Comunidad universitaria</Text>
      </ScrollView>
    </SafeAreaView>
  );
}
