import React, { useEffect, useState } from "react";

import { initDatabase } from "./src/db/database";

import HomeScreen from "./src/screens/HomeScreen";
import AddPhotoScreen from "./src/screens/AddPhotoScreen";
import MapScreen from "./src/screens/MapScreen";

export default function App() {
  const [currentScreen, setCurrentScreen] =
    useState<"home" | "add" | "map">(
      "home"
    );

  const [selectedMapPhoto, setSelectedMapPhoto] =
    useState<any | null>(null);

  useEffect(() => {
    initDatabase();
  }, []);

  switch (currentScreen) {
    case "add":
      return (
        <AddPhotoScreen
          onNavigateBack={() =>
            setCurrentScreen("home")
          }
        />
      );

    case "map":
      return (
        <MapScreen
          selectedPhoto={selectedMapPhoto}
          onNavigateBack={() =>
            setCurrentScreen("home")
          }
        />
      );

    case "home":
    default:
      return (
        <HomeScreen
          onNavigateTo={(
            screen,
            photo
          ) => {
            if (photo) {
              setSelectedMapPhoto(photo);
            }

            setCurrentScreen(screen);
          }}
        />
      );
  }
}