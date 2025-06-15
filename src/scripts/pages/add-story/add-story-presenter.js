import { addStory } from "../../data/api";

class AddStoryPresenter {
  #view = null;
  #onAddStorySuccess = null;
  #onAddStoryError = null;

  constructor({ view, onAddStorySuccess, onAddStoryError }) {
    this.#view = view;
    this.#onAddStorySuccess = onAddStorySuccess;
    this.#onAddStoryError = onAddStoryError;

    this.#view.bindAddStoryEvent(this._addStory.bind(this));

    this.#view.bindPhotoFileInputChange(this._handlePhotoChange.bind(this));

    this.#view.bindOpenCameraButton(this._handleOpenCameraButton.bind(this));
    this.#view.bindTakePictureButton(this._handleTakePictureButton.bind(this));
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

      if (!(data.photo instanceof File)) {
        this.#view.showError("Harap pilih gambar yang valid.");
        this.#view.hideLoading();
        return;
      }

      const response = await addStory({ ...data, token });
      if (response.error) {
        this.#view.showError(response.message);
        if (this.#onAddStoryError) this.#onAddStoryError(response.message);
      } else {
        this.#view.showSuccessMessage("Story berhasil ditambahkan!");
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

  _handlePhotoChange(file) {}

  _handleOpenCameraButton() {
    console.log(
      "AddStoryPresenter: Handling Open Camera Button, calling view.startCameraStream()"
    );
    this.#view.startCameraStream();
  }

  _handleTakePictureButton(capturedBlob) {}

  _handleMapClick(latlng) {
    this.#view.updateCoordinatesDisplay(latlng.lat, latlng.lng);
    this.#view.setMapMarker(
      latlng,
      `Lokasi terpilih: ${latlng.lat.toFixed(5)}, ${latlng.lng.toFixed(5)}`
    );
  }

  _handleLocationFound(latlng) {
    this.#view.updateCoordinatesDisplay(latlng.lat, latlng.lng);
    this.#view.setMapMarker(latlng, "Lokasi Anda saat ini");
  }

  _handleLocationError(message) {
    this.#view.showErrorInMap(message);
  }

  initMapAndCamera(maptilerApiKey) {
    this.#view.initAddStoryMap(maptilerApiKey);

    this.#view.bindMapClickEvent(this._handleMapClick.bind(this));
    this.#view.bindLocationFoundEvent(this._handleLocationFound.bind(this));
    this.#view.bindLocationErrorEvent(this._handleLocationError.bind(this));

    this.#view.locateUser();
  }

  destroyResources() {
    this.#view.cleanup();
  }
}

export default AddStoryPresenter;
