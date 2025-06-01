// src/scripts/pages/add-story/add-story-presenter.js
import { addStory } from "../../data/api";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import CONFIG from "../../config";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";
import { getToken } from "../../data/auth-helper"; // Import getToken dari auth-helper

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
  #marker = null;
  #onAddStorySuccess = null;
  #onAddStoryError = null;
  #cameraStream = null; // Tambahkan properti untuk stream kamera

  constructor({ view, onAddStorySuccess, onAddStoryError }) {
    this.#view = view;
    this.#view.bindAddStoryEvent(this._addStory.bind(this));
    this.#view.bindPhotoInputChange(this._handlePhotoChange.bind(this));
    this.#onAddStorySuccess = onAddStorySuccess;
    this.#onAddStoryError = onAddStoryError;

    // Bind event untuk kamera
    this.#view.bindCameraEvents({
      onStart: this._startCamera.bind(this),
      onTakePicture: this._takePicture.bind(this),
      onStop: this._stopCamera.bind(this),
    });
  }

  async _addStory(data) {
    this.#view.showLoading();
    try {
      const token = getToken();
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
    this._stopCamera(); // Pastikan kamera mati jika memilih file
  }

  async _startCamera() {
    try {
      this.#cameraStream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      this.#view.cameraFeed.srcObject = this.#cameraStream;
      this.#view.cameraFeed.play();
      this.#view.showCameraFeed();
    } catch (error) {
      console.error("Error accessing camera:", error);
      alert(
        "Gagal mengakses kamera. Pastikan Anda memberikan izin dan tidak ada aplikasi lain yang menggunakan kamera."
      );
      this.#view.hideCameraControls(); // Sembunyikan kontrol kamera jika gagal
    }
  }

  _takePicture() {
    const video = this.#view.cameraFeed;
    const canvas = this.#view.cameraCanvas;
    const context = canvas.getContext("2d");

    // Pastikan video sudah ada dan terputar
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      const dataUrl = canvas.toDataURL("image/png");
      this.#view.displayImageFromDataUrl(dataUrl);

      // Setelah mengambil gambar, Anda mungkin ingin menghentikan stream
      this._stopCamera();
    } else {
      alert("Kamera belum siap untuk mengambil gambar.");
    }
  }

  _stopCamera() {
    if (this.#cameraStream) {
      this.#cameraStream.getTracks().forEach((track) => track.stop());
      this.#cameraStream = null;
      this.#view.cameraFeed.srcObject = null;
      this.#view.hideCameraControls(); // Sembunyikan kembali kontrol kamera
    }
  }

  initMap() {
    // ... kode initMap yang sudah ada ...
    if (!this.#view.addStoryMapContainer) {
      console.error("Add Story map container not found.");
      return;
    }

    if (this.#map) {
      this.#map.remove();
    }

    this.#map = L.map(this.#view.addStoryMapContainer).setView([0, 0], 2);

    const mapTilerTileUrl = `https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=${CONFIG.MAPTILER_API_KEY}`;
    L.tileLayer(mapTilerTileUrl, {
      attribution:
        '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
    }).addTo(this.#map);

    this.#map.on("click", (e) => {
      const { lat, lng } = e.latlng;
      this.#view.updateCoordinatesDisplay(lat, lng);

      if (this.#marker) {
        this.#map.removeLayer(this.#marker);
      }

      this.#marker = L.marker([lat, lng])
        .addTo(this.#map)
        .bindPopup(`Lokasi terpilih: ${lat.toFixed(5)}, ${lng.toFixed(5)}`)
        .openPopup();
    });

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

  destroyMap() {
    if (this.#map) {
      this.#map.remove();
      this.#map = null;
      this.#marker = null;
    }
    this._stopCamera(); // Pastikan kamera juga berhenti saat halaman add-story ditinggalkan
  }
}

export default AddStoryPresenter;
