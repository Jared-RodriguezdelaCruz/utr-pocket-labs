import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import ErrorState from '../components/ErrorState';
import StatusBadge from '../components/StatusBadge';
import { getComputers, getLabs } from '../services/labService';
import { COMPUTER_STATUS, STATUS_FILTERS } from '../utils/constants';
import { getErrorMessage } from '../utils/httpErrors';
import { colors, screenStyles } from '../utils/styles';

// === texto de abajo de la tarjeta cuando la PC no se puede pedir ===
const STATUS_NOTES = {
  [COMPUTER_STATUS.OCUPADA]: 'Equipo en uso',
  [COMPUTER_STATUS.MANTENIMIENTO]: 'No disponible',
};

// === pestaña Mapa (C1): laboratorios, filtros de estatus y la cuadrícula de PCs ===
export default function LabsGridScreen() {
  const navigation = useNavigation();
  // === isFocused vuelve a true cada vez que regresamos a esta pestaña ===
  const isFocused = useIsFocused();
  // === estados: labs de la API, lab y filtro elegidos, las PCs, carga, error y reintentos ===
  const [labs, setLabs] = useState([]);
  const [laboratorio, setLaboratorio] = useState('');
  const [estatus, setEstatus] = useState('');
  const [computers, setComputers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  // === al abrir la pestaña pedimos los nombres de los laboratorios ===
  useEffect(() => {
    // === si ya los tenemos no los pedimos otra vez (pasa al reintentar) ===
    if (labs.length > 0) return;

    const loadLabs = async () => {
      try {
        // === llamada a la API, regresa algo como ['Lab-A', 'Lab-B', 'Redes'] ===
        const labNames = await getLabs();
        setLabs(labNames);
        if (labNames.length > 0) {
          // === elegimos el primero, eso hace que el otro efecto pida sus PCs ===
          setLaboratorio(labNames[0]);
        } else {
          // === sin laboratorios no hay nada más que cargar ===
          setIsLoading(false);
        }
      } catch (requestError) {
        setIsLoading(false);
        const status = requestError.response?.status;
        // === 401: el apiClient ya borró la sesión, volvemos al login ===
        if (status === 401) {
          navigation.replace('Login');
        } else if (status === 403) {
          Alert.alert('Acceso restringido', getErrorMessage(requestError));
        } else {
          setError(requestError);
        }
      }
    };

    loadLabs();
  }, [labs.length, retryCount, navigation]);

  // === pedimos las PCs al cambiar de lab o de filtro, al reintentar y al volver a la pestaña ===
  useEffect(() => {
    // === sin lab elegido o con la pestaña escondida no pedimos nada ===
    if (!laboratorio || !isFocused) return;
    // === si cambian de lab antes de que llegue la respuesta, la vieja se ignora ===
    let ignore = false;

    const loadComputers = async () => {
      // === mientras carga se ve el spinner en lugar de las tarjetas ===
      setIsLoading(true);
      setError(null);
      try {
        // === llamada a la API con el lab y el estatus del filtro ===
        const data = await getComputers({ laboratorio, estatus });
        if (!ignore) setComputers(data);
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
        // === pase lo que pase quitamos la carga, solo si esta respuesta sigue siendo la buena ===
        if (!ignore) setIsLoading(false);
      }
    };

    loadComputers();

    // === limpieza: corre al cambiar de lab o filtro y al salir de la pestaña ===
    return () => {
      ignore = true;
    };
  }, [laboratorio, estatus, retryCount, isFocused, navigation]);

  // === al tocar una pestaña de laboratorio cambiamos el lab y el efecto pide sus PCs ===
  const handleTabChange = (labName) => {
    setLaboratorio(labName);
  };

  // === al tocar un filtro cambiamos el estatus que se manda a la API ===
  const handleFilterChange = (value) => {
    setEstatus(value);
  };

  // === al tocar "Asignar equipo" abrimos la hoja C2 con los datos de la PC ===
  const handleSelect = (computer) => {
    navigation.navigate('AssignComputer', { computer });
  };

  // === botón Reintentar: quitamos el error y sumamos un reintento para que los efectos corran otra vez ===
  const handleRetry = () => {
    setError(null);
    setIsLoading(true);
    setRetryCount(retryCount + 1);
  };

  // === si falló la carga se ve la pantalla de error (500 o sin conexión) ===
  if (error) {
    return <ErrorState isOffline={!error.response} isLoading={isLoading} onRetry={handleRetry} />;
  }

  // === textos del estado vacío según lo que pasó ===
  let emptyTitle = 'Este laboratorio no tiene equipos';
  let emptyText = 'Prueba con otro laboratorio.';
  if (labs.length === 0) {
    emptyTitle = 'Todavía no hay laboratorios';
    emptyText = 'Cuando se registren equipos van a aparecer aquí.';
  } else if (estatus) {
    emptyTitle = 'No hay equipos con este filtro';
    emptyText = 'Prueba con otro estatus o laboratorio.';
  }

  // === parte de arriba de la lista: título, laboratorios, filtros y pizarrón ===
  const listHeader = (
    <View style={styles.header}>
      <Text style={screenStyles.title} accessibilityRole="header">Elige tu equipo</Text>
      <Text style={screenStyles.subtitle}>Selecciona un equipo disponible en tu laboratorio.</Text>

      {/* === pestañas de laboratorio, vienen de la API y se desplazan si son muchas === */}
      <FlatList
        horizontal
        data={labs}
        keyExtractor={(item) => item}
        showsHorizontalScrollIndicator={false}
        style={styles.labTabsList}
        contentContainerStyle={styles.labTabs}
        renderItem={({ item }) => (
          <Pressable
            accessibilityRole="tab"
            accessibilityState={{ selected: item === laboratorio }}
            onPress={() => handleTabChange(item)}
            style={[styles.chip, styles.labTab, item === laboratorio && styles.chipActive]}
          >
            <Text style={[styles.chipText, item === laboratorio && styles.chipTextActive]}>{item}</Text>
          </Pressable>
        )}
      />

      {/* === filtros de estatus en dos filas, como en Figma === */}
      <View style={styles.filters}>
        {STATUS_FILTERS.map((filter) => (
          <Pressable
            key={filter.label}
            accessibilityRole="button"
            accessibilityState={{ selected: filter.value === estatus }}
            onPress={() => handleFilterChange(filter.value)}
            style={[styles.chip, styles.filter, filter.value === estatus && styles.chipActive]}
          >
            <Text style={[styles.chipText, filter.value === estatus && styles.chipTextActive]}>{filter.label}</Text>
          </Pressable>
        ))}
      </View>

      {/* === franja que marca el frente del salón === */}
      <View style={styles.board}>
        <Text style={styles.boardText}>Pizarrón / Escritorio Docente</Text>
      </View>
    </View>
  );

  return (
    <FlatList
      data={isLoading ? [] : computers}
      keyExtractor={(item) => String(item.id)}
      numColumns={2}
      columnWrapperStyle={styles.row}
      contentContainerStyle={screenStyles.container}
      ListHeaderComponent={listHeader}
      ListEmptyComponent={
        isLoading ? (
          // === mientras llega la respuesta se ve el spinner ===
          <View style={styles.loading}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Cargando equipos...</Text>
          </View>
        ) : (
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>{emptyTitle}</Text>
            <Text style={styles.emptyText}>{emptyText}</Text>
          </View>
        )
      }
      renderItem={({ item }) => (
        // === tarjeta de la PC: inventario, especificaciones y estatus ===
        <View style={styles.card}>
          <Text style={styles.cardLabel}>N.º de inventario</Text>
          <Text style={styles.cardNumber}>{item.numeroInventario}</Text>
          <Text style={styles.cardSpecs}>{item.especificaciones}</Text>
          <StatusBadge estatus={item.estatus} />
          {/* === solo las PCs disponibles se pueden pedir, las demás muestran su nota === */}
          {item.estatus === COMPUTER_STATUS.DISPONIBLE ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Asignar equipo ${item.numeroInventario}`}
              onPress={() => handleSelect(item)}
              android_ripple={{ color: colors.primaryPressed }}
              style={styles.cardButton}
            >
              <Text style={styles.cardButtonText}>Asignar equipo</Text>
            </Pressable>
          ) : (
            <Text style={styles.cardNote}>{STATUS_NOTES[item.estatus]}</Text>
          )}
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: 16,
  },
  labTabsList: {
    marginTop: 20,
    flexGrow: 0,
  },
  labTabs: {
    gap: 8,
  },
  chip: {
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: colors.white,
  },
  chipActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  chipText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '700',
  },
  chipTextActive: {
    color: colors.white,
  },
  labTab: {
    minWidth: 96,
    paddingHorizontal: 20,
  },
  filters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 8,
    marginTop: 12,
  },
  filter: {
    width: '48.5%',
  },
  board: {
    marginTop: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: colors.surface,
  },
  boardText: {
    color: colors.textSecondary,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  card: {
    width: '48.5%',
    gap: 6,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.white,
  },
  cardLabel: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  cardNumber: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
    fontFamily: Platform.select({ ios: 'Menlo', default: 'monospace' }),
  },
  cardSpecs: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  cardNote: {
    marginTop: 2,
    color: colors.textSecondary,
    fontSize: 12,
  },
  cardButton: {
    height: 40,
    marginTop: 4,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: colors.primary,
  },
  cardButtonText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '700',
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
  empty: {
    gap: 4,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.white,
  },
  emptyTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
});
