import React, { useState, useEffect } from "react";

import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  ScrollView,
} from "react-native";

import MapView, {
  Marker,
  PROVIDER_GOOGLE,
} from "react-native-maps";

import {
  listPhotos,
  Photo,
} from "../repositories/photosRepository";

interface MapScreenProps {
  onNavigateBack: () => void;
  selectedPhoto?: Photo | null;
}

export default function MapScreen({
  onNavigateBack,
  selectedPhoto,
}: MapScreenProps) {
  const [photos, setPhotos] = useState<
    Photo[]
  >([]);

  const [openedPhoto, setOpenedPhoto] =
    useState<Photo | null>(null);

  useEffect(() => {
    const all = listPhotos();

    const validPhotos = all.filter(
      (photo) =>
        photo.latitude !== null &&
        photo.longitude !== null
    );

    setPhotos(validPhotos);
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: selectedPhoto
            ? Number(selectedPhoto.latitude)
            : photos.length > 0
            ? Number(photos[0].latitude)
            : -23.4222,

          longitude: selectedPhoto
            ? Number(selectedPhoto.longitude)
            : photos.length > 0
            ? Number(photos[0].longitude)
            : -51.9361,

          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        }}
      >
        {photos.map((photo) => (
          <Marker
            key={photo.id}
            coordinate={{
              latitude: Number(
                photo.latitude
              ),
              longitude: Number(
                photo.longitude
              ),
            }}
            onPress={() =>
              setOpenedPhoto(photo)
            }
          >
            <View
              style={styles.markerContainer}
            >
              <View
                style={styles.markerBubble}
              >
                <Image
                  source={{
                    uri: photo.image_uri,
                  }}
                  style={styles.markerImage}
                />
              </View>

              <View
                style={styles.markerArrow}
              />
            </View>
          </Marker>
        ))}
      </MapView>

      <TouchableOpacity
        style={styles.backButton}
        onPress={onNavigateBack}
      >
        <Text style={styles.backText}>
          ⬅ Voltar
        </Text>
      </TouchableOpacity>

      <Modal
        visible={!!openedPhoto}
        transparent
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {openedPhoto && (
              <ScrollView>
                <Image
                  source={{
                    uri: openedPhoto.image_uri,
                  }}
                  style={styles.modalImage}
                />

                <View
                  style={styles.modalInfo}
                >
                  <Text
                    style={styles.modalTitle}
                  >
                    {openedPhoto.title}
                  </Text>

                  <Text
                    style={styles.modalLabel}
                  >
                    📅 Data
                  </Text>

                  <Text
                    style={styles.modalValue}
                  >
                    {new Date(
                      openedPhoto.created_at
                    ).toLocaleDateString(
                      "pt-BR"
                    )}
                  </Text>

                  <Text
                    style={styles.modalLabel}
                  >
                    📍 Latitude
                  </Text>

                  <Text
                    style={styles.modalValue}
                  >
                    {openedPhoto.latitude}
                  </Text>

                  <Text
                    style={styles.modalLabel}
                  >
                    🌍 Longitude
                  </Text>

                  <Text
                    style={styles.modalValue}
                  >
                    {openedPhoto.longitude}
                  </Text>

                  <TouchableOpacity
                    style={
                      styles.closeButton
                    }
                    onPress={() =>
                      setOpenedPhoto(
                        null
                      )
                    }
                  >
                    <Text
                      style={
                        styles.closeButtonText
                      }
                    >
                      Fechar
                    </Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  map: {
    flex: 1,
  },

  backButton: {
    position: "absolute",
    top: 55,
    left: 20,
    backgroundColor: "#111827",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 18,
    elevation: 5,
  },

  backText: {
    color: "#fff",
    fontWeight: "700",
  },

  markerContainer: {
    alignItems: "center",
  },

  markerBubble: {
    backgroundColor: "#fff",
    borderRadius: 28,
    padding: 3,
    borderWidth: 2,
    borderColor: "#2563eb",
    elevation: 5,
  },

  markerImage: {
    width: 46,
    height: 46,
    borderRadius: 23,
  },

  markerArrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 7,
    borderRightWidth: 7,
    borderTopWidth: 10,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: "#2563eb",
    marginTop: -2,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor:
      "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },

  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: "85%",
    overflow: "hidden",
  },

  modalImage: {
    width: "100%",
    height: 320,
  },

  modalInfo: {
    padding: 20,
  },

  modalTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 18,
  },

  modalLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#6b7280",
    marginTop: 12,
  },

  modalValue: {
    fontSize: 16,
    color: "#111827",
    marginTop: 3,
  },

  closeButton: {
    backgroundColor: "#2563eb",
    marginTop: 22,
    padding: 16,
    borderRadius: 18,
    alignItems: "center",
    marginBottom: 20,
  },

  closeButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});