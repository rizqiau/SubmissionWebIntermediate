import HomeView from "./home-view";
import HomePresenter from "./home-presenter";

export default class HomePage {
  #view = null;
  #presenter = null;
  async render() {
    return '<div id="home-container"></div>';
  }

  async afterRender() {
    const homeContainer = document.querySelector("#home-container");
    this.#view = new HomeView();
    homeContainer.innerHTML = this.#view.getTemplate();

    this.#presenter = new HomePresenter({ view: this.#view });
    await this.#presenter.loadStories();
  }

  async beforeRender() {
    if (this.#view) {
      this.#view.destroyMap();
    }
  }
}
