import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  FlatList,
  Dimensions,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { listPhotos, Photo } from "../repositories/photosRepository";

const { width, height } = Dimensions.get("window");

interface MapScreenProps {
  onNavigateBack: () => void;
  selectedPhoto?: Photo | null;
}

const roundCoordinate = (coord: number, precision: number = 4) => {
  const factor = Math.pow(10, precision);
  return Math.round(coord * factor) / factor;
};

const groupPhotosByLocation = (photos: Photo[]) => {
  const groups: { [key: string]: Photo[] } = {};
  photos.forEach((photo) => {
    const lat = roundCoordinate(photo.latitude!);
    const lng = roundCoordinate(photo.longitude!);
    const key = `${lat},${lng}`;
    if (!groups[key]) groups[key] = [];
    groups[key].push(photo);
  });
  return Object.entries(groups).map(([key, photos]) => {
    const [lat, lng] = key.split(",").map(Number);
    return { latitude: lat, longitude: lng, photos };
  });
};

export default function MapScreen({ onNavigateBack, selectedPhoto }: MapScreenProps) {
  const [groups, setGroups] = useState<{ latitude: number; longitude: number; photos: Photo[] }[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<{ photos: Photo[] } | null>(null);
  const [carouselIndex, setCarouselIndex] = useState(0);

  useEffect(() => {
    const all = listPhotos();
    const validPhotos = all.filter((photo) => photo.latitude !== null && photo.longitude !== null);
    const grouped = groupPhotosByLocation(validPhotos);
    setGroups(grouped);
  }, []);

  const initialRegion = () => {
    if (selectedPhoto && selectedPhoto.latitude && selectedPhoto.longitude) {
      return {
        latitude: Number(selectedPhoto.latitude),
        longitude: Number(selectedPhoto.longitude),
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      };
    }
    if (groups.length > 0) {
      return {
        latitude: groups[0].latitude,
        longitude: groups[0].longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      };
    }
    return {
      latitude: -23.4222,
      longitude: -51.9361,
      latitudeDelta: 0.02,
      longitudeDelta: 0.02,
    };
  };

  return (
    <View style={styles.container}>
      <MapView style={styles.map} provider={PROVIDER_GOOGLE} initialRegion={initialRegion()}>
        {groups.map((group, idx) => (
          <Marker
            key={idx}
            coordinate={{ latitude: group.latitude, longitude: group.longitude }}
            onPress={() => {
              setSelectedGroup(group);
              setCarouselIndex(0);
            }}
          >
            <View style={styles.markerContainer}>
              <View style={styles.markerBubble}>
                <Image source={{ uri: group.photos[0].image_uri }} style={styles.markerImage} />
                {group.photos.length > 1 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{group.photos.length}</Text>
                  </View>
                )}
              </View>
              <View style={styles.markerArrow} />
            </View>
          </Marker>
        ))}
      </MapView>

      <TouchableOpacity style={styles.backButton} onPress={onNavigateBack}>
        <Text style={styles.backText}>⬅ Voltar</Text>
      </TouchableOpacity>

      <Modal visible={!!selectedGroup} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedGroup && (
              <>
                <FlatList
                  data={selectedGroup.photos}
                  keyExtractor={(item, index) => index.toString()}
                  horizontal
                  pagingEnabled
                  showsHorizontalScrollIndicator={false}
                  initialScrollIndex={carouselIndex}
                  getItemLayout={(data, index) => ({
                    length: width,
                    offset: width * index,
                    index,
                  })}
                  onMomentumScrollEnd={(event) => {
                    const newIndex = Math.round(event.nativeEvent.contentOffset.x / width);
                    setCarouselIndex(newIndex);
                  }}
                  renderItem={({ item }) => (
                    <View style={styles.carouselPage}>
                      <Image source={{ uri: item.image_uri }} style={styles.carouselImage} />
                    </View>
                  )}
                />
                <View style={styles.modalInfo}>
                  <Text style={styles.modalTitle}>{selectedGroup.photos[carouselIndex].title}</Text>
                  <Text style={styles.modalLabel}>📅 Data</Text>
                  <Text style={styles.modalValue}>
                    {new Date(selectedGroup.photos[carouselIndex].created_at).toLocaleDateString("pt-BR")}
                  </Text>
                  <Text style={styles.modalLabel}>📍 Latitude</Text>
                  <Text style={styles.modalValue}>{selectedGroup.photos[carouselIndex].latitude}</Text>
                  <Text style={styles.modalLabel}>🌍 Longitude</Text>
                  <Text style={styles.modalValue}>{selectedGroup.photos[carouselIndex].longitude}</Text>
                  <TouchableOpacity style={styles.closeButton} onPress={() => setSelectedGroup(null)}>
                    <Text style={styles.closeButtonText}>Fechar</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  backButton: {
    position: "absolute",
    top: 55,
    left: 20,
    backgroundColor: "#111827",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 18,
    elevation: 5,
    zIndex: 10,
  },
  backText: { color: "#fff", fontWeight: "700" },
  markerContainer: { alignItems: "center" },
  markerBubble: {
    backgroundColor: "#fff",
    borderRadius: 28,
    padding: 3,
    borderWidth: 2,
    borderColor: "#2563eb",
    elevation: 5,
    position: "relative",
    overflow: "visible",
  },
  markerImage: { width: 46, height: 46, borderRadius: 23 },
  badge: {
    position: "absolute",
    bottom: 30,
    right: -8, 
    backgroundColor: "#ef4444",
    borderRadius: 14,
    minWidth: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
    borderWidth: 1,
    borderColor: "#fff",
    zIndex: 10,
  },
  badgeText: { color: "#fff", fontSize: 12, fontWeight: "bold" },
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
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: "85%",
    overflow: "hidden",
  },
  carouselPage: {
    width: width,
    justifyContent: "center",
    alignItems: "center",
  },
  carouselImage: {
    width: width,
    height: height * 0.4,
    resizeMode: "cover",
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