import AddStoryView from "./add-story-view";
import AddStoryPresenter from "./add-story-presenter";

class AddStoryPage {
  #presenter = null;

  async render() {
    return '<div id="add-story-container"></div>';
  }

  async afterRender() {
    const addStoryContainer = document.querySelector("#add-story-container");
    const addStoryView = new AddStoryView();
    addStoryContainer.innerHTML = addStoryView.getTemplate();

    this.#presenter = new AddStoryPresenter({
      view: addStoryView,
      onAddStorySuccess: () => {
        window.location.hash = "#/";
      },
      onAddStoryError: (message) => {
        console.error("Add story failed:", message);
      },
    });

    this.#presenter.initMap();
  }

  async beforeRender() {
    if (this.#presenter) {
      this.#presenter.destroyMap();
    }
  }
}

export default AddStoryPage;
