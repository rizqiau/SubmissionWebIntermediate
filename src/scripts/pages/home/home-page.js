import HomeView from "./home-view";
import HomePresenter from "./home-presenter";

export default class HomePage {
  #presenter = null;
  async render() {
    return '<div id="home-container"></div>';
  }

  async afterRender() {
    const homeContainer = document.querySelector("#home-container");
    const homeView = new HomeView();
    homeContainer.innerHTML = homeView.getTemplate();

    this.#presenter = new HomePresenter({ view: homeView });
    await this.#presenter.loadStories();
  }

  async beforeRender() {
    if (this.#presenter) {
    }
  }
}
