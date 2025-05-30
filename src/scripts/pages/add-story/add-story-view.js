class AddStoryView {
  getTemplate() {
    return `
        <section class="container">
          <h1>Tambah Story Baru</h1>
          <form id="addStoryForm">
            <div class="form-group">
              <label for="description">Deskripsi</label>
              <textarea id="description" name="description" rows="5" required></textarea>
            </div>
  
            <div class="form-group">
              <label for="photo">Ambil Gambar</label>
              <input type="file" id="photo" name="photo" accept="image/*" capture="camera" required>
              <div class="preview-area">
                <img id="imagePreview" src="#" alt="Image Preview" style="display:none; max-width: 100%; height: auto; margin-top: 10px;">
              </div>
            </div>
  
            <div class="form-group">
              <label>Pilih Lokasi di Peta (Opsional)</label>
              <div id="add-story-map" class="map-container"></div>
              <p>Klik pada peta untuk memilih lokasi.</p>
              <p>Latitude: <span id="latValue"></span></p>
              <p>Longitude: <span id="lonValue"></span></p>
              <input type="hidden" id="lat" name="lat">
              <input type="hidden" id="lon" name="lon">
            </div>
  
            <button type="submit">Tambah Story</button>
          </form>
          <div id="loading-indicator" class="loading-indicator" style="display:none;">Uploading...</div>
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
      };
      reader.readAsDataURL(file);
    } else {
      this.imagePreview.src = "#";
      this.imagePreview.style.display = "none";
    }
  }

  updateCoordinatesDisplay(lat, lon) {
    this.latValueDisplay.textContent = lat !== null ? lat.toFixed(5) : "";
    this.lonValueDisplay.textContent = lon !== null ? lon.toFixed(5) : "";
    this.latInput.value = lat !== null ? lat : "";
    this.lonInput.value = lon !== null ? lon : "";
  }

  showLoading() {
    this.loadingIndicator.style.display = "block";
    this.errorMessage.style.display = "none";
    this.form.querySelector('button[type="submit"]').disabled = true; // Disable button
  }

  hideLoading() {
    this.loadingIndicator.style.display = "none";
    this.form.querySelector('button[type="submit"]').disabled = false; // Enable button
  }

  showSuccess(message) {
    alert(message);
    this.form.reset();
    this.displayImagePreview(null); // Clear image preview
    this.updateCoordinatesDisplay(null, null); // Clear coordinates
  }

  showError(message) {
    alert(`Gagal menambah story: ${message}`);
    this.errorMessage.textContent = `Error: ${message}`;
    this.errorMessage.style.display = "block";
  }
}

export default AddStoryView;
