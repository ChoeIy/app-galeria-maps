import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TextInput,
  Modal,
  ScrollView,
} from 'react-native';
import { fetchPhotos, deletePhoto, updatePhotoTitle } from '../services/photoService';
import { Photo } from '../repositories/photosRepository';

interface HomeScreenProps {
  onNavigateTo: (screen: 'home' | 'add' | 'map', photo?: Photo) => void;
}

export default function HomeScreen({ onNavigateTo }: HomeScreenProps) {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [search, setSearch] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [renameModal, setRenameModal] = useState(false);
  const [renameValue, setRenameValue] = useState('');
  const [renamePhotoId, setRenamePhotoId] = useState<number | null>(null);

  async function loadPhotos() {
    const data = await fetchPhotos();
    setPhotos(data);
  }

  useEffect(() => {
    loadPhotos();
  }, []);

  async function handleDelete(id: number) {
    Alert.alert('Excluir foto', 'Deseja realmente excluir esta foto?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          const success = await deletePhoto(id);
          if (success) {
            loadPhotos();
          } else {
            Alert.alert('Erro', 'Não foi possível excluir a foto. Tente novamente.');
          }
        },
      },
    ]);
  }

  function openRenameModal(id: number, currentTitle: string) {
    setRenamePhotoId(id);
    setRenameValue(currentTitle);
    setRenameModal(true);
  }

  async function handleRenameSave() {
    if (!renamePhotoId || !renameValue.trim()) return;
    try {
      const success = await updatePhotoTitle(renamePhotoId, renameValue);
      if (success) {
        setRenameModal(false);
        setRenamePhotoId(null);
        setRenameValue('');
        loadPhotos();
      } else {
        Alert.alert('Erro', 'Falha ao renomear. Tente novamente.');
      }
    } catch (error: any) {
      Alert.alert('Erro', error.message);
    }
  }

  const filteredPhotos = photos.filter((photo) =>
    photo.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View>
          <Text style={styles.logo}>PinPic</Text>
          <Text style={styles.subtitle}>Sua galeria inteligente</Text>
        </View>
        <TouchableOpacity style={styles.mapButton} onPress={() => onNavigateTo('map')}>
          <Text style={styles.mapButtonText}>🗺️</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        placeholder="Buscar fotos..."
        placeholderTextColor="#999"
        value={search}
        onChangeText={setSearch}
        style={styles.searchInput}
      />

      <FlatList
        data={filteredPhotos}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 8, paddingBottom: 120 }}
        renderItem={({ item }) => (
          <TouchableOpacity activeOpacity={0.9} style={styles.card} onPress={() => setSelectedPhoto(item)}>
            <Image source={{ uri: item.image_uri }} style={styles.image} />
            <TouchableOpacity
              style={styles.menuButton}
              onPress={() => {
                Alert.alert(item.title, 'Escolha uma opção', [
                  { text: 'Renomear', onPress: () => openRenameModal(item.id, item.title) },
                  { text: 'Excluir', style: 'destructive', onPress: () => handleDelete(item.id) },
                  { text: 'Cancelar', style: 'cancel' },
                ]);
              }}>
              <Text style={styles.menuText}>⋮</Text>
            </TouchableOpacity>
            <View style={styles.info}>
              <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
              <Text style={styles.date}>{new Date(item.created_at).toLocaleDateString()}</Text>
            </View>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity style={styles.fab} onPress={() => onNavigateTo('add')}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      <Modal visible={!!selectedPhoto} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedPhoto && (
              <ScrollView>
                <Image source={{ uri: selectedPhoto.image_uri }} style={styles.modalImage} />
                <View style={styles.modalInfo}>
                  <Text style={styles.modalTitle}>{selectedPhoto.title}</Text>
                  <Text style={styles.modalLabel}>📅 Data</Text>
                  <Text style={styles.modalValue}>
                    {new Date(selectedPhoto.created_at).toLocaleDateString('pt-BR')}
                  </Text>
                  <Text style={styles.modalLabel}>📍 Latitude</Text>
                  <Text style={styles.modalValue}>{selectedPhoto.latitude}</Text>
                  <Text style={styles.modalLabel}>🌍 Longitude</Text>
                  <Text style={styles.modalValue}>{selectedPhoto.longitude}</Text>
                  <TouchableOpacity
                    style={styles.mapsButton}
                    onPress={() => {
                      const photo = selectedPhoto;
                      setSelectedPhoto(null);
                      onNavigateTo('map', photo);
                    }}>
                    <Text style={styles.mapsButtonText}>Ver no mapa</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.closeButton} onPress={() => setSelectedPhoto(null)}>
                    <Text style={styles.closeButtonText}>Fechar</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

      <Modal visible={renameModal} transparent animationType="fade">
        <View style={styles.renameOverlay}>
          <View style={styles.renameBox}>
            <Text style={styles.renameTitle}>Renomear imagem</Text>
            <TextInput value={renameValue} onChangeText={setRenameValue} style={styles.renameInput} placeholder="Novo nome" />
            <TouchableOpacity style={styles.renameSave} onPress={handleRenameSave}>
              <Text style={styles.renameSaveText}>Salvar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.renameCancel} onPress={() => setRenameModal(false)}>
              <Text style={styles.renameCancelText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6', paddingTop: 55 },
  headerContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 18 },
  logo: { fontSize: 34, fontWeight: '800', color: '#111827' },
  subtitle: { color: '#6b7280', marginTop: 2 },
  mapButton: { width: 54, height: 54, borderRadius: 999, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', elevation: 5 },
  mapButtonText: { fontSize: 24 },
  searchInput: { backgroundColor: '#fff', marginHorizontal: 16, marginBottom: 12, borderRadius: 18, paddingHorizontal: 18, height: 54, fontSize: 16 },
  card: { flex: 1, margin: 7, backgroundColor: '#fff', borderRadius: 24, overflow: 'hidden', elevation: 4 },
  image: { width: '100%', height: 220 },
  menuButton: { position: 'absolute', top: 10, right: 10, width: 34, height: 34, borderRadius: 999, backgroundColor: 'rgba(0,0,0,0.55)', justifyContent: 'center', alignItems: 'center' },
  menuText: { color: '#fff', fontSize: 20 },
  info: { padding: 12 },
  title: { fontSize: 16, fontWeight: '700' },
  date: { marginTop: 4, fontSize: 12, color: '#6b7280' },
  fab: { position: 'absolute', bottom: 30, right: 25, width: 72, height: 72, borderRadius: 999, backgroundColor: '#2563eb', justifyContent: 'center', alignItems: 'center' },
  fabText: { color: '#fff', fontSize: 38 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 28, borderTopRightRadius: 28, maxHeight: '90%' },
  modalImage: { width: '100%', height: 320 },
  modalInfo: { padding: 20 },
  modalTitle: { fontSize: 28, fontWeight: '800' },
  modalLabel: { marginTop: 12, color: '#6b7280', fontWeight: '700' },
  modalValue: { marginTop: 4, fontSize: 16 },
  mapsButton: { backgroundColor: '#2563eb', marginTop: 22, padding: 16, borderRadius: 18, alignItems: 'center' },
  mapsButtonText: { color: '#fff', fontWeight: '700' },
  closeButton: { backgroundColor: '#111827', marginTop: 12, padding: 16, borderRadius: 18, alignItems: 'center', marginBottom: 20 },
  closeButtonText: { color: '#fff', fontWeight: '700' },
  renameOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'center', alignItems: 'center' },
  renameBox: { backgroundColor: '#fff', width: '85%', borderRadius: 24, padding: 20 },
  renameTitle: { fontSize: 22, fontWeight: '700', marginBottom: 15 },
  renameInput: { borderWidth: 1, borderColor: '#ddd', borderRadius: 14, paddingHorizontal: 15, height: 55, fontSize: 16 },
  renameSave: { backgroundColor: '#2563eb', padding: 16, borderRadius: 16, alignItems: 'center', marginTop: 18 },
  renameSaveText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  renameCancel: { backgroundColor: '#111827', padding: 16, borderRadius: 16, alignItems: 'center', marginTop: 10 },
  renameCancelText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});