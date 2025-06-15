import { getAllStories } from "../../data/api";
import "leaflet/dist/leaflet.css";
import CONFIG from "../../config";

class HomePresenter {
  #view = null;

  constructor({ view }) {
    this.#view = view;
  }

  async loadStories() {
    this.#view.showLoading();
    try {
      const token = localStorage.getItem("userToken");
      if (!token) {
        this.#view.showError("Anda harus login untuk melihat story.");
        this.#view.hideLoading();
        return;
      }
      const response = await getAllStories({ token, location: 1 });
      if (response.error) {
        this.#view.showError(response.message);
      } else {
        this.#view.renderStories(response.listStory);
        this.#view.initMapAndMarkers(
          response.listStory,
          CONFIG.MAPTILER_API_KEY
        );
      }
    } catch (error) {
      console.error("Error loading stories:", error);
      this.#view.showError(
        "Gagal memuat story. Periksa koneksi internet Anda."
      );
    } finally {
      this.#view.hideLoading();
    }
  }
}

export default HomePresenter;
