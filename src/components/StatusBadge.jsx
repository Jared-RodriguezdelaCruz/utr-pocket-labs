import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Text, View } from 'react-native';
import { COMPUTER_STATUS, STATUS_LABELS } from '../utils/constants';
import { colors } from '../utils/styles';

// === colores e ícono de cada estatus, el ícono ayuda a no depender solo del color ===
const STATUS_STYLES = {
  [COMPUTER_STATUS.DISPONIBLE]: {
    text: colors.availableText,
    background: colors.availableBg,
    border: colors.availableBorder,
    icon: 'checkmark',
  },
  [COMPUTER_STATUS.OCUPADA]: {
    text: colors.occupiedText,
    background: colors.occupiedBg,
    border: colors.occupiedBorder,
    icon: 'remove',
  },
  [COMPUTER_STATUS.MANTENIMIENTO]: {
    text: colors.maintenanceText,
    background: colors.maintenanceBg,
    border: colors.maintenanceBorder,
    icon: 'warning',
  },
};

// === chip de estatus del kit: punto, ícono y texto con el color del estatus ===
export default function StatusBadge({ estatus }) {
  const statusStyle = STATUS_STYLES[estatus];

  return (
    <View
      accessible
      accessibilityLabel={`Estatus: ${STATUS_LABELS[estatus]}`}
      style={[styles.badge, { backgroundColor: statusStyle.background, borderColor: statusStyle.border }]}
    >
      <View style={[styles.dot, { backgroundColor: statusStyle.text }]} />
      <Ionicons name={statusStyle.icon} size={12} color={statusStyle.text} />
      <Text style={[styles.text, { color: statusStyle.text }]}>{STATUS_LABELS[estatus]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderRadius: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  text: {
    fontSize: 12,
    fontWeight: '700',
  },
});
