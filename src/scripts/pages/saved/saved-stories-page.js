import StoryDatabase from "../../data/database-helper";
import { showFormattedDate } from "../../utils";

const SavedStoriesPage = {
  async render() {
    return `
      <section class="container">
        <h1>Story Tersimpan</h1>
        <div id="saved-stories-container" class="stories-grid">
          <p>Memuat story tersimpan...</p>
        </div>
      </section>
    `;
  },

  async afterRender() {
    const savedStoriesContainer = document.querySelector(
      "#saved-stories-container"
    );

    const renderPage = async () => {
      const stories = await StoryDatabase.getAllStories();
      savedStoriesContainer.innerHTML = "";

      if (stories.length === 0) {
        savedStoriesContainer.innerHTML =
          '<p class="error-message">Belum ada story yang disimpan.</p>';
        return;
      }

      stories.forEach((story) => {
        const storyElement = document.createElement("div");
        storyElement.classList.add("story-item");
        storyElement.innerHTML = `
          <img src="${story.photoUrl}" alt="${
          story.name
        }'s story photo" class="story-photo">
          <div class="story-content">
            <h2 class="story-name">${story.name}</h2>
            <p class="story-date">${showFormattedDate(story.createdAt)}</p>
            <p class="story-description">${story.description}</p>
            <button class="delete-story-button" data-id="${
              story.id
            }">Hapus Story</button>
          </div>
        `;
        savedStoriesContainer.appendChild(storyElement);
      });
    };

    savedStoriesContainer.addEventListener("click", async (event) => {
      if (event.target.classList.contains("delete-story-button")) {
        const storyId = event.target.dataset.id;
        await StoryDatabase.deleteStory(storyId);
        alert("Story berhasil dihapus!");
        renderPage();
      }
    });

    await renderPage();
  },
};

export default SavedStoriesPage;
