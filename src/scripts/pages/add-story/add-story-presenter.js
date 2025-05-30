import { addStory } from "../../data/api";
import "leaflet/dist/leaflet.css"; // Import Leaflet CSS
import L from "leaflet"; // Import Leaflet library
import CONFIG from "../../config"; // Import CONFIG to get MAPTILER_API_KEY
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

// Konfigurasi ulang ikon default Leaflet
L.Marker.prototype.options.icon = L.icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41],
});

class AddStoryPresenter {
  #view = null;
  #map = null;
  #marker = null; // To store the selected location marker
  #onAddStorySuccess = null; // Deklarasi private field yang hilang
  #onAddStoryError = null;

  constructor({ view, onAddStorySuccess, onAddStoryError }) {
    this.#view = view;
    this.#view.bindAddStoryEvent(this._addStory.bind(this));
    this.#view.bindPhotoInputChange(this._handlePhotoChange.bind(this));
    this.#onAddStorySuccess = onAddStorySuccess;
    this.#onAddStoryError = onAddStoryError;
  }

  async _addStory(data) {
    this.#view.showLoading();
    try {
      const token = localStorage.getItem("userToken");
      if (!token) {
        this.#view.showError("Anda harus login untuk menambah story.");
        this.#view.hideLoading();
        return;
      }

      const response = await addStory({ ...data, token });
      if (response.error) {
        this.#view.showError(response.message);
        if (this.#onAddStoryError) this.#onAddStoryError(response.message);
      } else {
        this.#view.showSuccess("Story berhasil ditambahkan!");
        if (this.#onAddStorySuccess) this.#onAddStorySuccess();
      }
    } catch (error) {
      console.error("Error adding story:", error);
      this.#view.showError("Terjadi kesalahan saat menambah story.");
      if (this.#onAddStoryError)
        this.#onAddStoryError("Terjadi kesalahan saat menambah story.");
    } finally {
      this.#view.hideLoading();
    }
  }

  _handlePhotoChange(file) {
    this.#view.displayImagePreview(file);
  }

  initMap() {
    if (!this.#view.addStoryMapContainer) {
      console.error("Add Story map container not found.");
      return;
    }

    if (this.#map) {
      this.#map.remove(); // Remove existing map if any
    }

    this.#map = L.map(this.#view.addStoryMapContainer).setView([0, 0], 2); // Default view

    const mapTilerTileUrl = `https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=${CONFIG.MAPTILER_API_KEY}`;
    L.tileLayer(mapTilerTileUrl, {
      attribution:
        '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
    }).addTo(this.#map);

    // Event listener for map click to get coordinates
    this.#map.on("click", (e) => {
      const { lat, lng } = e.latlng;
      this.#view.updateCoordinatesDisplay(lat, lng);

      // Remove previous marker if exists
      if (this.#marker) {
        this.#map.removeLayer(this.#marker);
      }

      // Add new marker
      this.#marker = L.marker([lat, lng])
        .addTo(this.#map)
        .bindPopup(`Lokasi terpilih: ${lat.toFixed(5)}, ${lng.toFixed(5)}`)
        .openPopup();
    });

    // Try to get current location
    this.#map.locate({ setView: true, maxZoom: 16 });
    this.#map.on("locationfound", (e) => {
      const { lat, lng } = e.latlng;
      this.#view.updateCoordinatesDisplay(lat, lng);

      if (this.#marker) {
        this.#map.removeLayer(this.#marker);
      }
      this.#marker = L.marker([lat, lng])
        .addTo(this.#map)
        .bindPopup("Lokasi Anda saat ini")
        .openPopup();
    });
    this.#map.on("locationerror", (e) => {
      console.error("Location access denied or error:", e.message);
      alert(
        "Gagal mendapatkan lokasi Anda. Anda bisa klik peta secara manual."
      );
    });
  }

  // Method to remove map instance when leaving the page (important for memory management)
  destroyMap() {
    if (this.#map) {
      this.#map.remove();
      this.#map = null;
      this.#marker = null;
    }
  }
}

export default AddStoryPresenter;
