import { StyleSheet } from 'react-native';

// === colores del kit de Figma, si cambia el diseño se cambian aquí ===
export const colors = {
  primary: '#D32F2F',
  primaryPressed: '#B71C1C',
  charcoal: '#1E293B',
  text: '#111827',
  textSecondary: '#475569',
  placeholder: '#64748B',
  page: '#F8FAFC',
  surface: '#F1F5F9',
  border: '#E2E8F0',
  white: '#FFFFFF',
  errorBg: '#FEF2F2',
  errorBorder: '#E97373',
  errorText: '#991B1B',
  // === estatus de las computadoras: texto, fondo y borde fino de los chips ===
  availableText: '#166534',
  availableBg: '#ECFDF5',
  availableBorder: '#62D3AD',
  occupiedText: '#B91C1C',
  occupiedBg: '#FEF2F2',
  occupiedBorder: '#E97373',
  maintenanceText: '#92400E',
  maintenanceBg: '#FFFBEB',
  maintenanceBorder: '#F9C15F',
};

// === estilos que comparten las pantallas de las pestañas (Mapa y Mi sesión) ===
export const screenStyles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
    backgroundColor: colors.page,
  },
  title: {
    color: colors.text,
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  subtitle: {
    marginTop: 4,
    color: colors.textSecondary,
    fontSize: 14,
  },
});

export const authStyles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.page,
  },
  scroll: {
    flexGrow: 1,
  },
  container: {
    flexGrow: 1,
    minHeight: '100%',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  brandLogo: {
    width: 96,
    height: 55,
  },
  brandText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '800',
  },
  title: {
    marginTop: 24,
    color: colors.text,
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  subtitle: {
    marginTop: 4,
    color: colors.textSecondary,
    fontSize: 14,
  },
  tabs: {
    height: 48,
    marginTop: 20,
    marginBottom: 16,
    padding: 4,
    borderRadius: 8,
    flexDirection: 'row',
    backgroundColor: colors.surface,
  },
  tab: {
    flex: 1,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabActive: {
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  tabText: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '700',
  },
  tabTextActive: {
    color: colors.primary,
  },
  form: {
    gap: 6,
  },
  label: {
    marginTop: 8,
    color: colors.text,
    fontSize: 13,
    fontWeight: '700',
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 16,
    color: colors.text,
    backgroundColor: colors.white,
    fontSize: 14,
  },
  hint: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  forgotWrap: {
    minHeight: 32,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  forgotText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '700',
  },
  error: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: colors.errorBorder,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: colors.errorBg,
  },
  errorIcon: {
    color: colors.errorText,
    fontSize: 14,
    fontWeight: '800',
  },
  errorText: {
    flex: 1,
    color: colors.errorText,
    fontSize: 14,
    fontWeight: '600',
  },
  support: {
    marginTop: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    fontSize: 12,
  },
  supportLink: {
    color: colors.text,
    textDecorationLine: 'underline',
  },
  footer: {
    marginTop: 'auto',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    color: colors.textSecondary,
    textAlign: 'center',
    fontSize: 12,
  },
});
