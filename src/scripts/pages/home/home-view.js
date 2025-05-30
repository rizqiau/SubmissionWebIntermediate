import { showFormattedDate } from "../../utils";

class HomeView {
  getTemplate() {
    return `
      <section class="container">
        <h1>Dicoding Story</h1>
        <div id="map-container" class="map-container"></div>
        <div id="stories-container" class="stories-grid">
          </div>
        <div id="loading-indicator" class="loading-indicator">Loading stories...</div>
        <div id="error-message" class="error-message" style="display: none;"></div>
      </section>
    `;
  }

  get storiesContainer() {
    return document.querySelector("#stories-container");
  }

  get loadingIndicator() {
    return document.querySelector("#loading-indicator");
  }

  get errorMessage() {
    return document.querySelector("#error-message");
  }

  get mapContainer() {
    return document.querySelector("#map-container");
  }

  showLoading() {
    this.loadingIndicator.style.display = "block";
    this.storiesContainer.innerHTML = ""; // Clear previous stories
    this.errorMessage.style.display = "none";
  }

  hideLoading() {
    this.loadingIndicator.style.display = "none";
  }

  showError(message) {
    this.errorMessage.textContent = `Error: ${message}`;
    this.errorMessage.style.display = "block";
  }

  renderStories(stories) {
    if (!this.storiesContainer) return;
    this.storiesContainer.innerHTML = ""; // Clear previous stories
    if (stories.length === 0) {
      this.storiesContainer.innerHTML = "<p>Belum ada story.</p>";
      return;
    }

    stories.forEach((story) => {
      const storyElement = `
        <div class="story-item">
          <img src="${story.photoUrl}" alt="${
        story.name
      }'s story photo" class="story-photo">
          <div class="story-content">
            <h2 class="story-name">${story.name}</h2>
            <p class="story-date">${showFormattedDate(story.createdAt)}</p>
            <p class="story-description">${story.description}</p>
            ${
              story.lat && story.lon
                ? `<p class="story-location">Lokasi: ${story.lat}, ${story.lon}</p>`
                : ""
            }
          </div>
        </div>
      `;
      this.storiesContainer.innerHTML += storyElement;
    });
  }

  initMap() {
    // This will be implemented by the presenter, but the container is here
  }
}

export default HomeView;
