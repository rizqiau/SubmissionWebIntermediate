import { getAllStories } from "../../data/api";
import "leaflet/dist/leaflet.css";
import CONFIG from "../../config";
import StoryDatabase from "../../data/database-helper";

class HomePresenter {
  #view = null;
  #stories = [];

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
        this.#stories = response.listStory;
        this._renderStoriesFromData(this.#stories);
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

  async saveStory(storyId) {
    const story = this.#stories.find((s) => s.id === storyId);
    if (story) {
      await StoryDatabase.putStory(story);
      alert(`Story "${story.name}" berhasil disimpan!`);
    } else {
      alert("Story tidak ditemukan untuk disimpan.");
    }
  }

  _renderStoriesFromData(stories) {
    this.#view.renderStories(stories);
    this.#view.initMapAndMarkers(stories, CONFIG.MAPTILER_API_KEY);
  }
}

export default HomePresenter;
