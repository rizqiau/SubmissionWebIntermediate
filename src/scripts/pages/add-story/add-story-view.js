// src/scripts/pages/add-story/add-story-view.js
class AddStoryView {
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
            <label>Ambil Foto atau Unggah</label>
            <video id="cameraFeed" class="image-preview" autoplay style="display:none; width: 100%; max-height: 250px; object-fit: contain;"></video>
            <button type="button" id="startCameraButton" class="submit-button" style="margin-top: 10px;">Buka Kamera</button>
            <button type="button" id="takePictureButton" class="submit-button" style="margin-top: 10px; display:none;">Ambil Gambar</button>
            <button type="button" id="stopCameraButton" class="submit-button" style="margin-top: 10px; background-color: #dc3545; display:none;">Tutup Kamera</button>

            <canvas id="cameraCanvas" style="display:none;"></canvas>

            <input type="file" id="photo" name="photo" accept="image/*" style="margin-top: 15px;">
            <div class="preview-area">
              <img id="imagePreview" src="#" alt="Pratinjau Gambar" class="image-preview" style="display:none;">
              <p id="imagePlaceholder" class="image-placeholder">Tidak ada gambar yang dipilih</p>
            </div>
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
      </section>
      `;
  }

  get form() {
    return document.querySelector("#addStoryForm");
  }

  get descriptionInput() {
    return document.querySelector("#description");
  }

  get photoInput() {
    return document.querySelector("#photo");
  }

  get imagePreview() {
    return document.querySelector("#imagePreview");
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

  get imagePlaceholder() {
    return document.querySelector("#imagePlaceholder");
  }

  // New getters for camera elements
  get cameraFeed() {
    return document.querySelector("#cameraFeed");
  }

  get cameraCanvas() {
    return document.querySelector("#cameraCanvas");
  }

  get startCameraButton() {
    return document.querySelector("#startCameraButton");
  }

  get takePictureButton() {
    return document.querySelector("#takePictureButton");
  }

  get stopCameraButton() {
    return document.querySelector("#stopCameraButton");
  }

  bindAddStoryEvent(callback) {
    this.form.addEventListener("submit", (event) => {
      event.preventDefault();
      const photoFile = this.photoInput.files[0];
      // Pastikan ada file dari input atau dari kamera
      if (!photoFile && !this.imagePreview.src.startsWith("data:image")) {
        // Cek juga jika ada gambar dari kamera
        alert("Harap pilih gambar atau ambil foto dengan kamera.");
        return;
      }

      // Jika ada gambar dari kamera, gunakan itu
      let finalPhoto = photoFile;
      if (
        this.imagePreview.src.startsWith("data:image") &&
        this.imagePreview.style.display !== "none"
      ) {
        // Convert data URL to Blob (File-like object)
        const dataUrl = this.imagePreview.src;
        const blob = this.dataURItoBlob(dataUrl);
        // Beri nama file arbitrer
        finalPhoto = new File([blob], "camera_capture.png", {
          type: "image/png",
        });
      }

      callback({
        description: this.descriptionInput.value,
        photo: finalPhoto,
        lat: this.latInput.value ? parseFloat(this.latInput.value) : null,
        lon: this.lonInput.value ? parseFloat(this.lonInput.value) : null,
      });
    });
  }

  bindPhotoInputChange(callback) {
    this.photoInput.addEventListener("change", (event) => {
      callback(event.target.files[0]);
    });
  }

  // New binding for camera buttons
  bindCameraEvents({ onStart, onTakePicture, onStop }) {
    this.startCameraButton.addEventListener("click", onStart);
    this.takePictureButton.addEventListener("click", onTakePicture);
    this.stopCameraButton.addEventListener("click", onStop);
  }

  displayImagePreview(file) {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview.src = e.target.result;
        this.imagePreview.style.display = "block";
        this.imagePlaceholder.style.display = "none";
      };
      reader.readAsDataURL(file);
    } else {
      this.imagePreview.src = "#";
      this.imagePreview.style.display = "none";
      this.imagePlaceholder.style.display = "block";
    }
  }

  // New method to display image from data URL (for camera capture)
  displayImageFromDataUrl(dataUrl) {
    this.imagePreview.src = dataUrl;
    this.imagePreview.style.display = "block";
    this.imagePlaceholder.style.display = "none";
    this.cameraFeed.style.display = "none"; // Hide camera feed after picture is taken
    this.stopCameraFeed(); // Stop camera stream
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

  showSuccess(message) {
    alert(message);
    this.form.reset();
    this.displayImagePreview(null); // Clear preview for file upload
    this.updateCoordinatesDisplay(null, null);
    this.hideCameraControls(); // Hide camera controls after success
    this.stopCameraFeed(); // Stop camera stream
  }

  showError(message) {
    alert(`Gagal menambah story: ${message}`);
    this.errorMessage.textContent = `Error: ${message}`;
    this.errorMessage.style.display = "block";
  }

  // Helper function to convert data URI to Blob
  dataURItoBlob(dataURI) {
    const byteString = atob(dataURI.split(",")[1]);
    const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  }

  // Camera UI visibility methods
  showCameraFeed() {
    this.cameraFeed.style.display = "block";
    this.startCameraButton.style.display = "none";
    this.takePictureButton.style.display = "inline-block";
    this.stopCameraButton.style.display = "inline-block";
    this.imagePlaceholder.style.display = "none"; // Hide placeholder when camera is active
    this.imagePreview.style.display = "none"; // Hide image preview if visible
    this.photoInput.value = ""; // Clear file input if camera is used
  }

  hideCameraControls() {
    this.cameraFeed.style.display = "none";
    this.startCameraButton.style.display = "inline-block";
    this.takePictureButton.style.display = "none";
    this.stopCameraButton.style.display = "none";
    this.imagePlaceholder.style.display = "block"; // Show placeholder when camera is off
  }

  stopCameraFeed() {
    if (this.cameraFeed.srcObject) {
      this.cameraFeed.srcObject.getTracks().forEach((track) => track.stop());
      this.cameraFeed.srcObject = null;
    }
    this.hideCameraControls();
  }
}

export default AddStoryView;
