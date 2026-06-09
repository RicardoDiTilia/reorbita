import { Alert, Platform } from 'react-native';

export const confirmAction = (
  title: string,
  message: string,
  onConfirm: () => void,
  confirmLabel = 'Confirmar'
) => {
  if (Platform.OS === 'web') {
    const ok = typeof window !== 'undefined' && window.confirm(`${title}\n\n${message}`);
    if (ok) onConfirm();
    return;
  }
  Alert.alert(title, message, [
    { text: 'Cancelar', style: 'cancel' },
    { text: confirmLabel, style: 'destructive', onPress: onConfirm },
  ]);
};
