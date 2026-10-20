# Veste Coburg – Interaktives 3D-Gelände- & Druckmodell

[![GitHub Pages](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-brightgreen?logo=github)](https://RLKO31.github.io/veste-coburg-3d/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Three.js](https://img.shields.io/badge/3D-Three.js-000000?logo=three.js)](https://threejs.org/)
[![Open Data Bayern](https://img.shields.io/badge/Data-Open%20Data%20Bayern%20(dl--de%2Fby--2--0)-blue)](https://geodatenonline.bayern.de/)

[English](#english-version) | [Deutsch](#deutsche-version)

---

## English Version

A lightweight, responsive web dashboard for interactive 3D exploration of **Veste Coburg** ("The Franconian Crown"). Developed within the **3D-GIS** module at the **Technical University of Applied Sciences Würzburg-Schweinfurt (THWS)**.

**Live Website:** [https://RLKO31.github.io/veste-coburg-3d/](https://RLKO31.github.io/veste-coburg-3d/)

---

### About the 3D Model

The 3D model synthesizes high-resolution official geospatial baseline data of the Free State of Bavaria into a 3D-printable and web-renderable solid mesh:
- **Terrain Relief (DTM / DGM):** Digital Terrain Model (DGM1) provided by the Bavarian Agency for Surveying and Geoinformation (LDBV)
- **Architectural Ensembles (LoD2):** Standardized 3D building models (CityGML LoD2) of Veste Coburg capturing authentic roof types and structural elevations
- **Georeference:** UTM Zone 32N / ETRS89 (EPSG:25832)
- **Bounding Extent:** 500 m x 500 m spatial footprint, base elevation 345 m above sea level up to the fortress peak at 485 m (approx. 140 m elevation gradient)
- **3D Printing Ready:** Sealed manifold mesh solid with a flat pedestal base optimized for FDM and SLA additive manufacturing

---

### Web Application Features

- **3D Orbit Navigation:** Orbit rotation (Left mouse / Touch drag), panning (Right mouse / Two-finger drag), and smooth zoom (Scroll wheel / Pinch)
- **Model Switching:** Toggle between the solid **3D Print Model with Pedestal** (`Druckmodell.stl`) and the natural **Fortress Ensemble Terrain** (`GesamtVeste.stl`)
- **Shading & Visualization Modes:**
  - *Sandstone / Natural:* Realistic masonry and natural rock coloration of the medieval complex
  - *Hypsometric Elevation Tinting:* Topographic pseudocolor gradient (345 m to 485 m)
  - *Clay / Studio Sculpture:* Monochrome studio shading for fine architectural detail inspection
  - *Wireframe:* Triangulated TIN mesh topology inspection (37,700 faces)
- **Standard Camera Presets:** Isometric perspective, Nadir top view, South panoramic view, and Detail zoom
- **Auto-Rotation:** Smooth 360-degree presentation turn
- **Direct Downloads:** Export and download the production-ready STL and 3MF print files directly via the dashboard
- **Open Data & Compliance:** Built-in legal notice (§ 5 DDG) and full open data attribution under dl-de/by-2-0

---

### Data Sources & Licenses

- **Geospatial Data:** Bavarian Agency for Digitisation, High-Speed Internet and Surveying ([GeodatenOnline / Open Data Bayern](https://geodatenonline.bayern.de/))
  - Digital Terrain Model (DGM) & 3D Building Models (LoD2 CityGML)
  - License: [Data licence Germany – attribution – Version 2.0 (dl-de/by-2-0)](https://www.govdata.de/dl-de/by-2-0)
- **Attribution Notice:** *"Bayerische Vermessungsverwaltung – www.geodaten.bayern.de"*
- **Software Code:** MIT License

---

## Deutsche Version

Ein leichtes, responsives Web-Dashboard zur interaktiven 3D-Erkundung der **Veste Coburg** („Fränkische Krone“). Entwickelt im Rahmen des Moduls **3D-GIS** an der **Technischen Hochschule Würzburg-Schweinfurt (THWS)**.

**Live-Webseite:** [https://RLKO31.github.io/veste-coburg-3d/](https://RLKO31.github.io/veste-coburg-3d/)

---

### Über das Modell

Das 3D-Modell verbindet hochauflösende Geobasisdaten des Freistaates Bayern zu einem druckfertigen und web-visualisierbaren 3D-Volumenmodell:
- **Terrain (DGM / Relief):** Digitales Geländemodell (DGM1) der Bayerischen Vermessungsverwaltung (LDBV)
- **Bauwerksstrukturen (LoD2):** 3D-Gebäudemodelle (CityGML LoD2) der Veste Coburg mit standardisierten Dachformen und Gebäudehöhen
- **Georeferenzierung:** UTM Zone 32N / ETRS89 (EPSG:25832)
- **Modell-Ausschnitt:** 500 m × 500 m Kantenlänge, Sockelhöhe 345 m ü. NHN bis Burgspitze 485 m ü. NHN (Höhendifferenz ~140 m)
- **3D-Druck:** Optimiert als geschlossener Solid (Manifold Mesh) mit festem Sockelboden für FDM- und SLA-Druck

---

### Funktionen der Web-Applikation

- **3D-Orbit-Steuerung:** Frei rotieren (linker Mausklick / Touch), verschieben (rechter Mausklick / 2 Finger) und stufenlos zoomen (Mausrad / Pinch-to-Zoom)
- **Modellauswahl:** Wechsel zwischen dem vollvolumigen **3D-Druckmodell mit Sockel** (`Druckmodell.stl`) und dem reinen **Ensemble-Geländeausschnitt** (`GesamtVeste.stl`)
- **Visualisierungs-Modi:**
  - *Sandstein / Natur:* Realistische Farbgebung der fränkischen Festungsanlage
  - *Höhenschichten (Topografie):* Pseudofarben nach Höhenmeter (345 m bis 485 m)
  - *Clay / Skulptur:* Monochromes Studio-Shading für maximale Detailwahrnehmung
  - *Wireframe (Drahtgitter):* Visualisierung der triangulierten TIN-Topologie (37.700 Dreiecke)
- **Standard-Kameraansichten:** Isometrie, Vogelperspektive (Draufsicht), Süd-Panorama und Detail-Zoom
- **Auto-Rotation:** Sanfte 360°-Präsentationsrotation
- **Direkter Download:** Bereitstellung der STL- und 3MF-Druckdateien direkt über das Dashboard
- **Rechtssicherheit & Open Data:** Integriertes Impressum (§ 5 DDG) und vollständige Quellenangaben nach CC BY 4.0 / Datenlizenz Deutschland

---

### Datenquellen & Lizenzen

- **Geodatenbasis:** Bayerische Vermessungsverwaltung ([GeodatenOnline / Open Data Bayern](https://geodatenonline.bayern.de/))
  - Digitales Geländemodell (DGM) & 3D-Gebäudemodelle (LoD2 CityGML)
  - Lizenz: [Datenlizenz Deutschland – Namensnennung – Version 2.0 (dl-de/by-2-0)](https://www.govdata.de/dl-de/by-2-0)
- **Quellennachweis:** *Bayerische Vermessungsverwaltung – www.geodaten.bayern.de*
- **Software-Code:** MIT License
