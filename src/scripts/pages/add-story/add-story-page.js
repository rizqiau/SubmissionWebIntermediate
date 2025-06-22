import AddStoryView from "./add-story-view";
import AddStoryPresenter from "./add-story-presenter";
import CONFIG from "../../config";

class AddStoryPage {
  #view = null;
  #presenter = null;

  async render() {
    return '<div id="add-story-container"></div>';
  }

  async afterRender() {
    const addStoryContainer = document.querySelector("#add-story-container");
    this.#view = new AddStoryView();
    addStoryContainer.innerHTML = this.#view.getTemplate();

    this.#presenter = new AddStoryPresenter({
      view: this.#view,
      onAddStorySuccess: () => {
        alert("Story berhasil ditambahkan!");
        window.location.hash = "#/";
      },

      onAddStoryError: (message) => {
        console.error("Add story failed:", message);
      },
    });

    this.#presenter.initMapAndCamera(CONFIG.MAPTILER_API_KEY);
  }

  async beforeRender() {
    console.log("AddStoryPage: beforeRender called, cleaning up view.");
    if (this.#view) {
      this.#view.cleanup();
    }
  }
}

export default AddStoryPage;
