import {
  insertPhoto,
  listPhotos,
  deletePhoto as deletePhotoRepo,
  updatePhotoTitle as updateTitleRepo,
  type Photo,
  type NewPhotoInput,
} from '../repositories/photosRepository';
import { requestLocationPermission } from '../utils/permissions';

export async function savePhoto(
  title: string,
  imageUri: string,
  includeLocation: boolean = true
): Promise<void> {
  if (!title.trim()) {
    throw new Error('O título é obrigatório.');
  }
  if (!imageUri) {
    throw new Error('Nenhuma imagem selecionada.');
  }

  let latitude: number | null = null;
  let longitude: number | null = null;

  if (includeLocation) {
    const location = await requestLocationPermission();
    if (location.granted) {
      latitude = location.latitude ?? null;
      longitude = location.longitude ?? null;
    }
  }

  const photoData: NewPhotoInput = {
    title: title.trim(),
    imageUri,
    latitude,
    longitude,
  };

  try {
    insertPhoto(photoData);
  } catch (error: any) {
    console.error('Erro ao salvar no banco:', error);
    throw new Error(error.message || 'Erro ao salvar imagem no banco.');
  }
}

export async function fetchPhotos(): Promise<Photo[]> {
  try {
    return listPhotos();
  } catch (error) {
    console.error('Erro ao buscar fotos:', error);
    return [];
  }
}

export async function deletePhoto(id: number): Promise<boolean> {
  try {
    deletePhotoRepo(id);
    return true;
  } catch (error) {
    console.error('Erro ao deletar foto:', error);
    return false;
  }
}

export async function updatePhotoTitle(id: number, newTitle: string): Promise<boolean> {
  if (!newTitle.trim()) {
    throw new Error('O título não pode estar vazio.');
  }
  try {
    updateTitleRepo(id, newTitle.trim());
    return true;
  } catch (error) {
    console.error('Erro ao atualizar título:', error);
    return false;
  }
}