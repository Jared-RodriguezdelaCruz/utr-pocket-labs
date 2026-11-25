import { useEffect, useState } from 'react';
import { Alert, Image, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import PrimaryButton from '../components/PrimaryButton';
import { login } from '../services/authService';
import { UTR_EMAIL_REGEX } from '../utils/constants';
import { getErrorMessage } from '../utils/httpErrors';
import { getToken, saveSession } from '../utils/session';
import { authStyles, colors } from '../utils/styles';

export default function LoginScreen() {
  // === con navigation nos movemos a Register o a las pestañas (Main) ===
  const navigation = useNavigation();
  // === estados: lo que escribe el usuario, si está cargando y el mensaje de error ===
  const [form, setForm] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // === al abrir la pantalla revisamos si ya había una sesión guardada ===
  useEffect(() => {
    const checkSession = async () => {
      const token = await getToken();
      // === si ya hay token nos saltamos el login y vamos directo a las pestañas ===
      if (token) {
        navigation.replace('Main');
      }
    };

    checkSession();
  }, [navigation]);

  // === se llama cada vez que el usuario escribe en un input ===
  const handleChange = (field, value) => {
    // === copiamos el form y solo cambiamos el campo que se editó ===
    setForm({ ...form, [field]: value });
  };

  // === se ejecuta al presionar "Iniciar sesión" ===
  const handleSubmit = async () => {
    // === limpiamos el error anterior antes de volver a intentar ===
    setError('');
    // === si falta el correo o la contraseña no mandamos nada a la API ===
    if (!form.email.trim() || !form.password) {
      setError('Ingresa tu correo institucional y contraseña.');
      return;
    }
    // === el correo tiene que ser institucional ===
    if (!UTR_EMAIL_REGEX.test(form.email.trim())) {
      setError('Usa tu correo institucional (@utr.edu.mx).');
      return;
    }

    // === mientras isLoading esté en true el botón se bloquea y muestra el spinner ===
    setIsLoading(true);
    try {
      // === mandamos correo (sin espacios) y contraseña, la API regresa el token y el usuario ===
      const session = await login({ ...form, email: form.email.trim() });
      // === guardamos token y usuario en SecureStore para no pedir login otra vez ===
      await saveSession(session);
      // === replace y no navigate para que el botón de atrás no regrese al login ===
      navigation.replace('Main');
    } catch (requestError) {
      // === si la API falla mostramos el mensaje que arma getErrorMessage ===
      setError(getErrorMessage(requestError));
    } finally {
      // === pase lo que pase quitamos el estado de carga ===
      setIsLoading(false);
    }
  };

  // === la pestaña "Registrarse" nos lleva a la pantalla de registro ===
  const handleGoToRegister = () => {
    navigation.navigate('Register');
  };

  // === por ahora no hay recuperación de contraseña, solo avisamos a quién acudir ===
  const handleForgotPassword = () => {
    Alert.alert('Recuperar contraseña', 'Contacta al área de TI para recuperar tu contraseña.');
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
        <Text style={authStyles.title}>Bienvenido de nuevo</Text>
        <Text style={authStyles.subtitle}>Ingresa con tu correo institucional.</Text>

        {/* === pestañas: estamos en login, la otra manda a registro === */}
        <View style={authStyles.tabs}>
          <View style={[authStyles.tab, authStyles.tabActive]}>
            <Text style={[authStyles.tabText, authStyles.tabTextActive]}>Iniciar sesión</Text>
          </View>
          <Pressable accessibilityRole="button" style={authStyles.tab} onPress={handleGoToRegister}>
            <Text style={authStyles.tabText}>Registro</Text>
          </Pressable>
        </View>

        <View style={authStyles.form}>
          {/* === el banner de error solo aparece si error tiene texto === */}
          {error ? (
            <View style={authStyles.error} accessibilityRole="alert">
              <Text style={authStyles.errorIcon}>!</Text>
              <Text style={authStyles.errorText}>{error}</Text>
            </View>
          ) : null}

          {/* === inputs controlados: muestran lo que hay en form y abajo va su texto de ayuda === */}
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
            autoComplete="current-password"
            secureTextEntry
          />
          <Text style={authStyles.hint}>Escribe tu contraseña.</Text>

          <Pressable accessibilityRole="button" style={authStyles.forgotWrap} onPress={handleForgotPassword}>
            <Text style={authStyles.forgotText}>¿Olvidaste tu contraseña?</Text>
          </Pressable>

          {/* === le pasamos isLoading para que el botón se bloquee mientras responde la API === */}
          <PrimaryButton title="Iniciar sesión" onPress={handleSubmit} isLoading={isLoading} />
        </View>

        <Text style={authStyles.support}>
          ¿Necesitas ayuda? <Text style={authStyles.supportLink}>Contacta al área de TI.</Text>
        </Text>
        <Text style={authStyles.footer}>© 2026 UTR Labs · Comunidad universitaria</Text>
      </ScrollView>
    </SafeAreaView>
  );
}
