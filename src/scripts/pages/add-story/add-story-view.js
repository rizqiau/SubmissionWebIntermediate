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
            <input type="file" id="photo" name="photo" accept="image/*" capture="camera" required>
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
    // New getter
    return document.querySelector("#imagePlaceholder");
  }

  bindAddStoryEvent(callback) {
    this.form.addEventListener("submit", (event) => {
      event.preventDefault();
      const photoFile = this.photoInput.files[0];
      if (!photoFile) {
        alert("Harap pilih gambar.");
        return;
      }
      callback({
        description: this.descriptionInput.value,
        photo: photoFile,
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
    this.displayImagePreview(null);
    this.updateCoordinatesDisplay(null, null);
  }

  showError(message) {
    alert(`Gagal menambah story: ${message}`);
    this.errorMessage.textContent = `Error: ${message}`;
    this.errorMessage.style.display = "block";
  }
}

export default AddStoryView;
