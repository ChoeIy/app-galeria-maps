import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { Alert } from 'react-native';

export async function requestCameraPermission(): Promise<boolean> {
  const { status } = await ImagePicker.requestCameraPermissionsAsync();
  if (status !== 'granted') {
    Alert.alert(
      'Permissão negada',
      'Precisamos da câmera para tirar fotos. Você pode permitir nas configurações do dispositivo.'
    );
    return false;
  }
  return true;
}

export async function requestGalleryPermission(): Promise<boolean> {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== 'granted') {
    Alert.alert(
      'Permissão negada',
      'Precisamos acessar sua galeria para escolher imagens.'
    );
    return false;
  }
  return true;
}

export async function requestLocationPermission(): Promise<{
  granted: boolean;
  latitude?: number;
  longitude?: number;
}> {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    Alert.alert(
      'Permissão de localização negada',
      'A foto será salva sem coordenadas. Você pode permitir depois nas configurações.'
    );
    return { granted: false };
  }

  try {
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });
    return {
      granted: true,
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
  } catch (error) {
    console.error('Erro ao obter localização:', error);
    Alert.alert('Erro', 'Não foi possível obter sua localização. A foto será salva sem coordenadas.');
    return { granted: false };
  }
}