import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { requestCameraPermission, requestGalleryPermission } from '../utils/permissions';
import { savePhoto } from '../services/photoService';

interface AddPhotoScreenProps {
  onNavigateBack: () => void;
}

export default function AddPhotoScreen({ onNavigateBack }: AddPhotoScreenProps) {
  const [title, setTitle] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLaunchCamera = async () => {
    const granted = await requestCameraPermission();
    if (!granted) return;

    const result = await ImagePicker.launchCameraAsync({ quality: 0.7 });
    if (!result.canceled && result.assets[0].uri) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleSelectFromLibrary = async () => {
    const granted = await requestGalleryPermission();
    if (!granted) return;

    const result = await ImagePicker.launchImageLibraryAsync({ quality: 0.7 });
    if (!result.canceled && result.assets[0].uri) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Erro', 'Informe um título.');
      return;
    }
    if (!imageUri) {
      Alert.alert('Erro', 'Escolha ou tire uma foto.');
      return;
    }

    setLoading(true);
    try {
      await savePhoto(title, imageUri, true); // true = tenta obter localização
      Alert.alert('Sucesso', 'Imagem salva com sucesso!');
      onNavigateBack();
    } catch (err: any) {
      Alert.alert('Erro', err.message || 'Erro ao salvar imagem.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onNavigateBack} style={styles.backButton}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nova Imagem</Text>
      </View>

      <View style={styles.previewCard}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.previewImage} />
        ) : (
          <View style={styles.emptyPreview}>
            <Text style={styles.emptyEmoji}>📸</Text>
            <Text style={styles.emptyText}>Nenhuma imagem selecionada</Text>
          </View>
        )}
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Título da imagem</Text>
        <TextInput
          placeholder="Digite um título..."
          placeholderTextColor="#999"
          value={title}
          onChangeText={setTitle}
          style={styles.input}
        />

        <View style={styles.buttonsRow}>
          <TouchableOpacity style={[styles.mediaButton, { backgroundColor: '#2563eb' }]} onPress={handleLaunchCamera}>
            <Text style={styles.mediaButtonText}>📸 Câmera</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.mediaButton, { backgroundColor: '#7c3aed' }]} onPress={handleSelectFromLibrary}>
            <Text style={styles.mediaButtonText}>🖼️ Galeria</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveButtonText}>Salvar imagem</Text>}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// Estilos exatamente iguais aos seus (não precisa mudar)
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6', paddingTop: 55 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, marginBottom: 20 },
  backButton: { width: 42, height: 42, borderRadius: 999, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', marginRight: 12, elevation: 3 },
  backText: { fontSize: 22, color: '#111', fontWeight: 'bold' },
  headerTitle: { fontSize: 28, fontWeight: '800', color: '#111827' },
  previewCard: { marginHorizontal: 18, backgroundColor: '#fff', borderRadius: 28, overflow: 'hidden', elevation: 4, height: 320, justifyContent: 'center', alignItems: 'center' },
  previewImage: { width: '100%', height: '100%' },
  emptyPreview: { alignItems: 'center' },
  emptyEmoji: { fontSize: 70 },
  emptyText: { marginTop: 12, color: '#6b7280', fontSize: 15 },
  form: { padding: 18 },
  label: { marginBottom: 8, color: '#374151', fontWeight: '600', fontSize: 15 },
  input: { backgroundColor: '#fff', height: 56, borderRadius: 18, paddingHorizontal: 18, fontSize: 16, elevation: 2, marginBottom: 18 },
  buttonsRow: { flexDirection: 'row', gap: 12, marginBottom: 22 },
  mediaButton: { flex: 1, height: 56, borderRadius: 18, justifyContent: 'center', alignItems: 'center', elevation: 3 },
  mediaButtonText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  saveButton: { backgroundColor: '#111827', height: 58, borderRadius: 20, justifyContent: 'center', alignItems: 'center', elevation: 4 },
  saveButtonText: { color: '#fff', fontSize: 17, fontWeight: '700' },
});