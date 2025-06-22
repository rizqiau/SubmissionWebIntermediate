import L from "leaflet";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

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

class AddStoryView {
  #map = null;
  #marker = null;
  #currentStream = null;
  #capturedImageBlob = null;

  getTemplate() {
    return `
      <section class="container add-story-section">
        <h1>Tambah Story Baru</h1>
        <form id="addStoryForm" class="add-story-form">
          <div class="form-group">
            <label for="description">Deskripsi Story</label>
            <textarea id="description" name="description" rows="5" required placeholder="Ceritakan story Anda di sini..."></textarea>
          </div>

          <div class="form-group photo-upload-group">
            <label>Gambar Story</label>
            <div class="camera-controls">
              <button type="button" id="openCameraButton" class="btn btn-primary">Buka Kamera <span class="camera-icon">📷</span></button>
              <input type="file" id="photoFileInput" name="photo" accept="image/*" class="hidden-file-input">
              <label for="photoFileInput" class="btn btn-secondary">Pilih dari Galeri</label>
            </div>

            <div class="preview-area">
              <img id="imagePreview" src="#" alt="Pratinjau Gambar" class="image-preview" style="display:none;">
              <video id="videoPreview" class="video-preview" autoplay style="display:none;"></video>
              <p id="imagePlaceholder" class="image-placeholder">Tidak ada gambar yang dipilih</p>
            </div>
            <button type="button" id="takePictureButton" class="btn btn-success" style="display:none;">Ambil Foto</button>
          </div>

          <div class="form-group location-map-group">
            <label>Pilih Lokasi di Peta (Opsional)</label>
            <div id="add-story-map" class="map-container add-story-map"></div>
            <p class="map-instruction">Klik pada peta untuk menandai lokasi story Anda.</p>
            <div class="coordinates-display">
              <p>Latitude: <span id="latValue" class="coordinate-value"></span></p>
              <p>Longitude: <span id="lonValue" class="coordinate-value"></span></p>
            </div>
            <input type="hidden" id="lat" name="lat">
            <input type="hidden" id="lon" name="lon">
          </div>

          <button type="submit" class="submit-button">Tambah Story</button>
        </form>
        <div id="loading-indicator" class="loading-indicator" style="display:none;">
          <div class="spinner"></div>
          <p>Mengunggah story...</p>
        </div>
        <div id="error-message" class="error-message" style="display:none;"></div>
        <div id="map-error-message" class="error-message" style="display:none;"></div>
      </section>
    `;
  }

  get form() {
    return document.querySelector("#addStoryForm");
  }

  get descriptionInput() {
    return document.querySelector("#description");
  }

  get photoFileInput() {
    return document.querySelector("#photoFileInput");
  }

  get imagePreview() {
    return document.querySelector("#imagePreview");
  }

  get imagePlaceholder() {
    return document.querySelector("#imagePlaceholder");
  }

  get videoPreview() {
    return document.querySelector("#videoPreview");
  }

  get addStoryMapContainer() {
    return document.querySelector("#add-story-map");
  }

  get latInput() {
    return document.querySelector("#lat");
  }

  get lonInput() {
    return document.querySelector("#lon");
  }

  get latValueDisplay() {
    return document.querySelector("#latValue");
  }

  get lonValueDisplay() {
    return document.querySelector("#lonValue");
  }

  get loadingIndicator() {
    return document.querySelector("#loading-indicator");
  }

  get errorMessage() {
    return document.querySelector("#error-message");
  }

  get mapErrorMessage() {
    return document.querySelector("#map-error-message");
  }

  get openCameraButton() {
    return document.querySelector("#openCameraButton");
  }
  get takePictureButton() {
    return document.querySelector("#takePictureButton");
  }

  bindAddStoryEvent(callback) {
    this.form.addEventListener("submit", (event) => {
      event.preventDefault();
      let photoToUpload = null;
      if (this.#capturedImageBlob) {
        photoToUpload = this.#capturedImageBlob;
      } else if (this.photoFileInput.files[0]) {
        photoToUpload = this.photoFileInput.files[0];
      }

      if (!photoToUpload) {
        this.showError("Harap pilih atau ambil gambar.");
        return;
      }
      callback({
        description: this.descriptionInput.value,
        photo: photoToUpload,
        lat: this.latInput.value ? parseFloat(this.latInput.value) : null,
        lon: this.lonInput.value ? parseFloat(this.lonInput.value) : null,
      });
    });
  }

  bindPhotoFileInputChange(callback) {
    this.photoFileInput.addEventListener("change", (event) => {
      const file = event.target.files[0];
      if (file && file.type.startsWith("image/")) {
        this.displayImagePreview(file);
        this.#capturedImageBlob = file;
      } else {
        this.displayImagePreview(null);
        this.#capturedImageBlob = null;
      }
      callback(file);
    });
  }

  bindOpenCameraButton(callback) {
    this.openCameraButton.addEventListener("click", () => {
      console.log("AddStoryView: Open Camera Button Clicked!");
      callback();
    });
  }

  bindTakePictureButton(callback) {
    this.takePictureButton.addEventListener("click", () => {
      this.capturePicture();
      callback(this.#capturedImageBlob);
    });
  }

  displayImagePreview(file) {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview.src = e.target.result;
        this.imagePreview.style.display = "block";
        this.imagePlaceholder.style.display = "none";
        this.videoPreview.style.display = "none";
        this.takePictureButton.style.display = "none";
      };
      reader.readAsDataURL(file);
    } else {
      this.imagePreview.src = "#";
      this.imagePreview.style.display = "none";
      this.imagePlaceholder.style.display = "block";
      this.videoPreview.style.display = "none";
      this.takePictureButton.style.display = "none";
    }
  }

  async startCameraStream() {
    console.log("AddStoryView: startCameraStream called.");
    try {
      this.imagePreview.style.display = "none";
      this.imagePlaceholder.style.display = "none";
      this.videoPreview.style.display = "block";
      this.takePictureButton.style.display = "block";

      this.#currentStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });
      this.videoPreview.srcObject = this.#currentStream;
      console.log(
        "AddStoryView: Camera stream successfully obtained and assigned."
      );
    } catch (error) {
      console.error("AddStoryView: Error accessing camera:", error);
      this.videoPreview.style.display = "none";
      this.takePictureButton.style.display = "none";
      this.imagePlaceholder.style.display = "block";
      this.showError("Gagal mengakses kamera. Pastikan Anda memberikan izin.");
    }
  }

  stopCameraStream() {
    console.log("AddStoryView: stopCameraStream called.");
    if (this.#currentStream) {
      console.log(
        "AddStoryView: Active stream found, attempting to stop tracks."
      );
      this.#currentStream.getTracks().forEach((track) => {
        track.stop();
        console.log(`AddStoryView: Track stopped - ${track.kind}`);
      });
      this.#currentStream = null;
      this.videoPreview.srcObject = null;
      this.videoPreview.style.display = "none";
      this.takePictureButton.style.display = "none";
      this.imagePlaceholder.style.display = "block";
      console.log("AddStoryView: Camera stream fully stopped.");
    } else {
      console.log(
        "AddStoryView: No active camera stream to stop (this.#currentStream is null or undefined)."
      );
    }
  }

  capturePicture() {
    if (!this.videoPreview || !this.#currentStream) {
      this.showError("Tidak ada stream kamera aktif untuk mengambil gambar.");
      return null;
    }

    const canvas = document.createElement("canvas");
    canvas.width = this.videoPreview.videoWidth;
    canvas.height = this.videoPreview.videoHeight;
    const context = canvas.getContext("2d");
    context.drawImage(this.videoPreview, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      this.#capturedImageBlob = new File([blob], `photo-${Date.now()}.png`, {
        type: "image/png",
      });
      this.displayImagePreview(this.#capturedImageBlob);
      this.stopCameraStream();
    }, "image/png");

    return this.#capturedImageBlob;
  }

  updateCoordinatesDisplay(lat, lon) {
    this.latValueDisplay.textContent = lat !== null ? lat.toFixed(5) : "";
    this.lonValueDisplay.textContent = lon !== null ? lon.toFixed(5) : "";
    this.latInput.value = lat !== null ? lat : "";
    this.lonInput.value = lon !== null ? lon : "";
  }

  showLoading() {
    this.loadingIndicator.style.display = "flex";
    this.errorMessage.style.display = "none";
    this.form.querySelector('button[type="submit"]').disabled = true;
  }

  hideLoading() {
    this.loadingIndicator.style.display = "none";
    this.form.querySelector('button[type="submit"]').disabled = false;
  }

  showSuccessMessage(message) {
    this.form.reset();
    this.displayImagePreview(null);
    this.updateCoordinatesDisplay(null, null);
    if (this.#marker) {
      this.#map.removeLayer(this.#marker);
      this.#marker = null;
    }
    this.#capturedImageBlob = null;
    this.showError("");
  }

  showError(message) {
    if (this.errorMessage) {
      this.errorMessage.textContent = `Error: ${message}`;
      this.mapErrorMessage.style.display = message ? "block" : "none";
    }
  }

  showErrorInMap(message) {
    if (this.mapErrorMessage) {
      this.mapErrorMessage.textContent = `Map Error: ${message}`;
      this.mapErrorMessage.style.display = "block";
    }
  }

  initAddStoryMap(maptilerApiKey) {
    if (!this.addStoryMapContainer) {
      console.error(
        "Add Story map container not found in View for map initialization."
      );
      return;
    }

    if (this.#map) {
      this.#map.remove();
    }

    this.#map = L.map(this.addStoryMapContainer).setView([0, 0], 2);

    const mapTilerTileUrl = `https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=${maptilerApiKey}`;
    L.tileLayer(mapTilerTileUrl, {
      attribution:
        '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
    }).addTo(this.#map);

    this.#map.invalidateSize();
  }

  bindMapClickEvent(callback) {
    if (this.#map) {
      this.#map.off("click");
      this.#map.on("click", (e) => {
        callback(e.latlng);
      });
    } else {
      console.error("Map not initialized for click event binding.");
    }
  }

  setMapMarker(latlng, popupContent) {
    if (this.#marker) {
      this.#map.removeLayer(this.#marker);
    }
    this.#marker = L.marker([latlng.lat, latlng.lng])
      .addTo(this.#map)
      .bindPopup(popupContent)
      .openPopup();
  }

  locateUser() {
    if (this.#map) {
      this.#map.locate({ setView: true, maxZoom: 16 });
    } else {
      console.error("Map not initialized for locating user.");
    }
  }

  bindLocationFoundEvent(callback) {
    if (this.#map) {
      this.#map.off("locationfound");
      this.#map.on("locationfound", (e) => {
        callback(e.latlng);
      });
    } else {
      console.error("Map not initialized for location found event binding.");
    }
  }

  bindLocationErrorEvent(callback) {
    if (this.#map) {
      this.#map.off("locationerror");
      this.#map.on("locationerror", (e) => {
        callback(e.message);
      });
    } else {
      console.error("Map not initialized for location error event binding.");
    }
  }

  destroyMap() {
    if (this.#map) {
      this.#map.remove();
      this.#map = null;
      this.#marker = null;
    }
  }

  cleanup() {
    this.destroyMap();
    this.stopCameraStream();
    if (this.photoFileInput) {
      this.photoFileInput.value = "";
    }
    this.displayImagePreview(null);
    this.#capturedImageBlob = null;
    this.showError("");
    this.showErrorInMap("");
  }
}

export default AddStoryView;
