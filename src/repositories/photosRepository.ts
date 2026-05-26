import { db } from '../db/database';

export type Photo = {
  id: number;
  title: string;
  image_uri: string;
  latitude: number | null;
  longitude: number | null;
  created_at: string;
};

export type NewPhotoInput = {
  title: string;
  imageUri: string;
  latitude: number | null;
  longitude: number | null;
};

export function insertPhoto(input: NewPhotoInput): void {
  if (!input.title.trim() || !input.imageUri) {
    throw new Error('Título e imagem são obrigatórios.');
  }

  db.runSync(
    `INSERT INTO photos (title, image_uri, latitude, longitude, created_at)
     VALUES (?, ?, ?, ?, ?)`,
    [
      input.title,
      input.imageUri,
      input.latitude,
      input.longitude,
      new Date().toISOString(),
    ]
  );
}

export function listPhotos(): Photo[] {
  try {
    return db.getAllSync(`SELECT * FROM photos ORDER BY created_at DESC`);
  } catch (error) {
    console.error('Erro listPhotos:', error);
    return [];
  }
}

export function deletePhoto(id: number): void {
  db.runSync(`DELETE FROM photos WHERE id = ?`, [id]);
}

export function updatePhotoTitle(id: number, title: string): void {
  db.runSync(`UPDATE photos SET title = ? WHERE id = ?`, [title, id]);
}