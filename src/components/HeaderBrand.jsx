import { Image, StyleSheet, Text, View } from 'react-native';
import { colors } from '../utils/styles';

// === logo y nombre de la app que van a la izquierda del header de las pestañas ===
export default function HeaderBrand() {
  return (
    <View style={styles.brand}>
      <Image
        source={require('../../assets/logo-utr.png')}
        style={styles.logo}
        resizeMode="contain"
        accessibilityLabel="Universidad Tecnológica El Retoño y BIS Universities"
      />
      <Text style={styles.text}>UTR Labs</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logo: {
    width: 64,
    height: 36,
  },
  text: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '800',
  },
});
