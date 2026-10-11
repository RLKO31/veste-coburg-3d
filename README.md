# Veste Coburg – Interaktives 3D-Gelände- & Druckmodell

Ein leichtes, responsives Web-Dashboard zur interaktiven 3D-Erkundung der **Veste Coburg** („Fränkische Krone“). Entwickelt im Rahmen des Moduls **3D-GIS** an der THWS (Hochschule für angewandte Wissenschaften Würzburg-Schweinfurt).

🌐 **Live-Webseite:** [https://RLKO31.github.io/veste-coburg-3d/](https://RLKO31.github.io/veste-coburg-3d/)

---

## 🏰 Über das Modell

Das 3D-Modell verbindet hochauflösende Geobasisdaten des Freistaates Bayern zu einem druckfertigen und web-visualisierbaren 3D-Volumenmodell:
- **Terrain (DGM / Relief):** Digitales Geländemodell (DGM1) der Bayerischen Vermessungsverwaltung (LDBV)
- **Bauwerksstrukturen (LoD2):** 3D-Gebäudemodelle (CityGML LoD2) der Veste Coburg mit standardisierten Dachformen und Gebäudehöhen
- **Georeferenzierung:** UTM Zone 32N / ETRS89 (EPSG:25832)
- **Modell-Ausschnitt:** 500 m × 500 m Kantenlänge, Sockelhöhe 345 m ü. NHN bis Burgspitze 485 m ü. NHN (Höhendifferenz ~140 m)
- **3D-Druck:** Optimiert als geschlossener Solid (Manifold Mesh) mit festem Sockelboden für FDM- und SLA-Druck

---

## ⚙️ Funktionen der Web-Applikation

- 🕹️ **3D-Orbit-Steuerung:** Frei rotieren (linker Mausklick / Touch), verschieben (rechter Mausklick / 2 Finger) und stufenlos zoomen (Mausrad / Pinch-to-Zoom)
- 🔄 **Modellauswahl:** Wechsel zwischen dem vollvolumigen **3D-Druckmodell mit Sockel** (`Druckmodell.stl`) und dem reinen **Ensemble-Geländeausschnitt** (`GesamtVeste.stl`)
- 🎨 **Visualisierungs-Modi:**
  - *Sandstein / Natur:* Realistische Farbgebung der fränkischen Festungsanlage
  - *Höhenschichten (Topografie):* Pseudofarben nach Höhenmeter (345 m bis 485 m)
  - *Clay / Skulptur:* Monochromes Studio-Shading für maximale Detailwahrnehmung
  - *Wireframe (Drahtgitter):* Visualisierung der triangulierten TIN-Topologie (37.700 Dreiecke)
- 🧭 **Standard-Kameraansichten:** Isometrie, Vogelperspektive (Draufsicht), Süd-Panorama und Detail-Zoom
- 🎬 **Auto-Rotation:** Sanfte 360°-Präsentationsrotation
- 💾 **Direkter Download:** Bereitstellung der STL- und 3MF-Druckdateien direkt über das Dashboard
- ⚖️ **Rechtssicherheit & Open Data:** Integriertes Impressum (§ 5 DDG) und vollständige Quellenangaben nach CC BY 4.0 / Datenlizenz Deutschland

---

## 📊 Datenquellen & Lizenzen

- **Geodatenbasis:** Bayerische Vermessungsverwaltung ([GeodatenOnline / Open Data Bayern](https://geodatenonline.bayern.de/))
  - Digitales Geländemodell (DGM) & 3D-Gebäudemodelle (LoD2 CityGML)
  - Lizenz: [Datenlizenz Deutschland – Namensnennung – Version 2.0 (dl-de/by-2-0)](https://www.govdata.de/dl-de/by-2-0)
- **Quellennachweis:** *Bayerische Vermessungsverwaltung – www.geodaten.bayern.de*
- **Software-Code:** MIT License
