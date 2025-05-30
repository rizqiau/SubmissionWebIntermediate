import HomeView from "./home-view";
import HomePresenter from "./home-presenter";

export default class HomePage {
  #presenter = null;
  async render() {
    return '<div id="home-container"></div>'; // Kontainer untuk view home
  }

  async afterRender() {
    const homeContainer = document.querySelector("#home-container");
    const homeView = new HomeView();
    homeContainer.innerHTML = homeView.getTemplate(); // Render template View

    // Inisialisasi Presenter setelah View dirender
    this.#presenter = new HomePresenter({ view: homeView });
    await this.#presenter.loadStories(); // loadStories akan panggil _initMap
  }

  // Tambahkan lifecycle hook untuk membersihkan peta saat meninggalkan halaman Home
  async beforeRender() {
    if (this.#presenter) {
      // Asumsikan HomePresenter memiliki metode destroyMap jika diperlukan
      // Untuk Home, ini mungkin tidak sekompleks AddStoryPage,
      // tetapi jika ada interaksi peta yang kompleks, destroyMap bisa membantu.
      // Untuk saat ini, kita biarkan saja karena Leaflet akan otomatis menghapus map
      // jika container direset innerHTML nya. Namun, jika ada event listener lain,
      // ini bisa menjadi tempat untuk membersihkannya.
      // this.#presenter.destroyMap(); // Jika Anda menambahkan destroyMap di HomePresenter
    }
  }
}
