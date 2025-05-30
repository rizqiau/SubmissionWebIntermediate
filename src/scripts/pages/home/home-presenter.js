import { getAllStories } from "../../data/api";
import "leaflet/dist/leaflet.css"; // Import Leaflet CSS
import L from "leaflet"; // Import Leaflet library
import CONFIG from "../../config";
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

class HomePresenter {
  #view = null;
  #map = null;

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
      const response = await getAllStories({ token, location: 1 }); // Request stories with location
      if (response.error) {
        this.#view.showError(response.message);
      } else {
        this.#view.renderStories(response.listStory);
        this._initMap(response.listStory); // Initialize map with stories
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

  _initMap(stories) {
    if (!this.#view.mapContainer) {
      console.error(
        "Map container not found in HomeView.getTemplate or not yet rendered."
      );
      return;
    }

    // Ensure map is only initialized once
    if (this.#map) {
      this.#map.remove();
    }

    this.#map = L.map(this.#view.mapContainer).setView([0, 0], 2); // Default view, will adjust with markers

    // Add MapTiler background tile layer
    const mapTilerTileUrl = `https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=${CONFIG.MAPTILER_API_KEY}`;
    L.tileLayer(mapTilerTileUrl, {
      attribution:
        '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
    }).addTo(this.#map);

    const markers = [];
    stories.forEach((story) => {
      if (story.lat && story.lon) {
        const marker = L.marker([story.lat, story.lon]).addTo(this.#map)
          .bindPopup(`
                <b>${story.name}</b><br>
                ${story.description}<br>
                <img src="${story.photoUrl}" alt="Story photo" style="max-width:100px; height:auto;">
              `);
        markers.push(marker);
      }
    });

    if (markers.length > 0) {
      const group = new L.featureGroup(markers);
      this.#map.fitBounds(group.getBounds()); // Adjust map zoom to fit all markers
    }
  }
}

export default HomePresenter;
