# 📸 Galeria Offline - PinPic

![React Native](https://img.shields.io/badge/React%20Native-Expo-blue)
![SQLite](https://img.shields.io/badge/Database-SQLite-green)
![Platform](https://img.shields.io/badge/Platform-Android%20%7C%20iOS-black)
![License](https://img.shields.io/badge/License-MIT-yellow)

Aplicativo mobile de galeria de fotos com suporte offline, geolocalização e visualização no mapa.  
Desenvolvido com React Native (Expo) e SQLite.

---

## ✨ Funcionalidades

- Captura de fotos com câmera ou galeria
- Adição de título personalizado às imagens
- Salvamento automático de localização GPS
- Visualização das fotos em mapa interativo
- Busca de fotos por nome
- Renomeação de fotos salvas
- Exclusão de fotos
- Funcionamento totalmente offline com SQLite
- Controle de permissões (câmera, galeria e localização)

---

## 🚀 Como executar o projeto

### 📌 Pré-requisitos

- Node.js 18 ou superior
- Expo Go instalado no celular

---

### 📦 Instalação

git clone https://github.com/ChoeIy/app-galeria-maps.git  
cd app-galeria-maps  
npm install
npx expo install expo-sqlite expo-image-picker expo-location react-native-maps

---

### ▶️ Iniciar o projeto

npx expo start  

---

### 📲 Executar no dispositivo

- Abra o app **Expo Go**
- Escaneie o QR Code no terminal

Ou use:

- tecla `a` → Android Emulator
- tecla `i` → iOS Simulator

---

## ⚠️ Caso o projeto não funcione

Se houver erro na execução:

npx expo install  

Para limpar cache:

npx expo start -c  

---

## 📁 Estrutura do projeto

src/  
├── db → banco de dados SQLite e inicialização  
├── repositories → consultas SQL diretas  
├── services → regras de negócio  
├── utils → funções auxiliares e permissões  
├── screens → telas do aplicativo  

Fluxo da aplicação:

UI → Services → Repositories → SQLite  

---

## 🛠️ Tecnologias utilizadas

- React Native  
- Expo  
- SQLite (expo-sqlite)  
- React Native Maps  
- Expo Location  
- Expo Image Picker  

---

## 🔐 Permissões utilizadas

- Câmera (captura de fotos)
- Galeria (seleção de imagens)
- Localização GPS (geolocalização das fotos)

O aplicativo continua funcionando mesmo se as permissões forem negadas, com fallback seguro.

---

## 🤝 Contribuição

Pull requests são bem-vindos.  
Sinta-se livre para melhorar este projeto.

---

## 📄 Licença

Este projeto está sob a licença MIT.

---

## ❤️ Autor

Desenvolvido por **ChoeIy**
