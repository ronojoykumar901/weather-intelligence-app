# Weather Intelligence (AetherIntel) 🌌

A highly polished, responsive, and production-ready **Weather Intelligence App** built using React, Vite, Tailwind CSS (v4), Lucide Icons, and Recharts. The application utilizes public, keyless geocoding and forecasting meteorological APIs provided by **Open-Meteo** to offer granular 7-day outlooks, micro-climate insights, atmospheric variance trends, and customized planning recommendations.

---

## 🎨 Design Theme: Elegant Dark
The application adheres to the custom **Elegant Dark** specification:
- **Atmospheric Palette**: Dark slate-gray (`#0F1115`) page backgrounds paired with structured carbon-card backings (`#1A1D24`), high-contrast borders (`#2D333E`), and crisp typography (`#E2E8F0`).
- **Interactive Accents**: Sleek, vibrant blue and turquoise accents highlight high/low temperature bounds, active metric filters, and dynamic weather status graphics.
- **Glassmorphism Metrics**: High-fidelity micro-cards use backdrop blur filters (`backdrop-blur-md`) and subtle overlays to deliver a futuristic weather telemetry vibe.

---

## 🚀 Key Features

### 1. Unified Search & Geocoding Dispatcher
- Real-time text-search input geocoding via Open-Meteo to resolve city, region, and state names directly into precise coordinates.
- **Search History Memory**: Automatically caches the 5 most recent coordinates to local storage for quick access.
- **Instant Destination Anchors**: Access one-click global hubs (e.g., London, New York, Tokyo, Sydney, Paris) from the custom quick-selector.

### 2. Live Telemetry Dashboard
- Displays local time, station coordinates, temperature, weather conditions, wind speed, and wind direction.
- Fluid compass navigation rendering to orient wind currents in real-time.
- Easily toggle temperature units between **°C (Metric)** and **°F (Imperial)** instantly across the entire dashboard.

### 3. Smart Planning Assistant
- Logic-driven diagnostic helper that runs continuous condition analysis.
- Automatically delivers critical alerts for extreme parameters:
  - **High Wind Warning**: Initiates when maximum daily wind exceeds 40 km/h.
  - **Extreme Heat Advisory**: Flags temperatures spiking above 34°C.
  - **Freezing Ice Watch**: Warns when minimum temperatures plunge below 0°C.
  - **Thunderstorm Watch**: Detects active electrical storm codes.
- Advises on specialized protective layering (e.g., UV protective garments, thermal jackets, or waterproof gear) and labels them by category (*safety*, *clothing*, *activities*).

### 4. Interactive Atmospheric Trends Chart
- Seamlessly integrates Recharts for granular visualization of temperature or precipitation trends.
- Smooth gradients for line bounds, custom styled tooltip overlays, and clean data grids with high responsiveness.

### 5. Multi-Device Layout Consistency
- Optimized for desktops, tablets, and mobile viewport densities. Includes sleek loading skeletons to preserve structural stability during API requests.

---

## ⚡ Tech Stack & Libraries
- **Runtime**: TypeScript & React 19
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS v4
- **Animations**: Motion (Framer Motion)
- **Icons**: Lucide React
- **Data Visualization**: Recharts

---

## 🛠️ Development & Production

To run the application locally or prepare a production deployment, use the following standard commands:

### Install Dependencies
```bash
npm install
```

### Run Local Development Server
```bash
npm run dev
```

### Production Build compilation
```bash
npm run build
```
*(Static output compiles directly into the `/dist` directory).*

### Lint & Verify Types
```bash
npm run lint
```

---

*Open meteorological forecast models provided exclusively by Open-Meteo under standard WMO guidelines.*
