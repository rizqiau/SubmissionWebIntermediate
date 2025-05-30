import AddStoryView from "./add-story-view";
import AddStoryPresenter from "./add-story-presenter";

class AddStoryPage {
  #presenter = null;

  async render() {
    return '<div id="add-story-container"></div>'; // Kontainer untuk view
  }

  async afterRender() {
    const addStoryContainer = document.querySelector("#add-story-container");
    const addStoryView = new AddStoryView();
    addStoryContainer.innerHTML = addStoryView.getTemplate();

    this.#presenter = new AddStoryPresenter({
      view: addStoryView,
      onAddStorySuccess: () => {
        window.location.hash = "#/"; // Redirect ke home setelah berhasil
      },
      onAddStoryError: (message) => {
        console.error("Add story failed:", message);
      },
    });

    this.#presenter.initMap(); // Initialize map when page is rendered
  }

  // Clean up map when navigating away
  async beforeRender() {
    if (this.#presenter) {
      this.#presenter.destroyMap();
    }
  }
}

export default AddStoryPage;
