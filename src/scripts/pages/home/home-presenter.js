import { getAllStories } from "../../data/api";
import "leaflet/dist/leaflet.css";
import CONFIG from "../../config";
import StoryDatabase from "../../data/database-helper";

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
        await this._loadFromDatabase();
      } else {
        await StoryDatabase.clearStories();
        response.listStory.forEach(async (story) => {
          await StoryDatabase.putStory(story);
        });
        this._renderStoriesFromData(response.listStory);
      }
    } catch (error) {
      console.error("Error loading stories from network:", error);
      this.#view.showError(
        "Gagal memuat dari network. Mencoba memuat dari database."
      );
      await this._loadFromDatabase();
    } finally {
      this.#view.hideLoading();
    }
  }

  async _loadFromDatabase() {
    const stories = await StoryDatabase.getAllStories();
    if (stories && stories.length > 0) {
      this._renderStoriesFromData(stories);
    } else {
      this.#view.showError(
        "Tidak ada data di database. Coba lagi saat online."
      );
    }
  }

  _renderStoriesFromData(stories) {
    this.#view.renderStories(stories);
    this.#view.initMapAndMarkers(stories, CONFIG.MAPTILER_API_KEY);
  }
}

export default HomePresenter;
