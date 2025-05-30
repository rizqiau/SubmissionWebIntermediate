import routes from "../routes/routes";
import { getActiveRoute } from "../routes/url-parser";

class App {
  #content = null;
  #drawerButton = null;
  #navigationDrawer = null;

  constructor({ navigationDrawer, drawerButton, content }) {
    this.#content = content;
    this.#drawerButton = drawerButton;
    this.#navigationDrawer = navigationDrawer;

    this._setupDrawer();
  }

  _setupDrawer() {
    this.#drawerButton.addEventListener("click", () => {
      event.stopPropagation();
      this.#navigationDrawer.classList.toggle("open");
    });

    document.body.addEventListener("click", (event) => {
      if (
        !this.#navigationDrawer.contains(event.target) &&
        !this.#drawerButton.contains(event.target)
      ) {
        this.#navigationDrawer.classList.remove("open");
      }

      this.#navigationDrawer.querySelectorAll("a").forEach((link) => {
        if (link.contains(event.target)) {
          this.#navigationDrawer.classList.remove("open");
        }
      });
    });
  }

  _setupNavigation() {
    // Pastikan event listener hanya dipasang sekali untuk elemen yang sama
    // atau, lebih baik, pasang ulang setiap kali halaman dirender
    // atau menggunakan event delegation jika memungkinkan.
    // Untuk kasus ini, karena tombol navigasi ada di HTML statis, kita bisa pasang sekali.
    // Tetapi jika ada tombol logout di dalam halaman yang di-render,
    // kita perlu memanggilnya setelah render.

    // Logout functionality
    const logoutButton = document.querySelector("#logoutButton");
    if (logoutButton) {
      // Pastikan event listener tidak diduplikasi
      logoutButton.removeEventListener("click", this._handleLogout); // Hapus listener lama jika ada
      logoutButton.addEventListener("click", this._handleLogout); // Pasang listener baru
    }

    // Add new story button functionality
    const addStoryButton = document.querySelector("#addStoryButton");
    if (addStoryButton) {
      addStoryButton.removeEventListener("click", this._handleAddStory); // Hapus listener lama jika ada
      addStoryButton.addEventListener("click", this._handleAddStory); // Pasang listener baru
    }

    // Update navigation visibility should also be called here
    this._updateNavigationVisibility();
  }

  _handleLogout = (event) => {
    // Gunakan arrow function untuk mempertahankan 'this'
    event.preventDefault();
    localStorage.removeItem("userToken");
    window.location.hash = "#/login";
  };

  _handleAddStory = (event) => {
    // Gunakan arrow function untuk mempertahankan 'this'
    event.preventDefault();
    window.location.hash = "#/add-story";
  };

  async renderPage() {
    const url = getActiveRoute();
    const page = routes[url];

    if (page && typeof page.beforeRender === "function") {
      await page.beforeRender(); // Call beforeRender for cleanup
    }

    // Use View Transitions API if supported
    if (document.startViewTransition) {
      document.startViewTransition(async () => {
        this.#content.innerHTML = await page.render();
        await page.afterRender();
        this._setupNavigation();
      });
    } else {
      // Fallback for browsers not supporting View Transitions
      this.#content.innerHTML = await page.render();
      await page.afterRender();
      this._setupNavigation();
    }

    // Update navigation visibility based on login status
    this._updateNavigationVisibility();
  }

  _updateNavigationVisibility() {
    const userToken = localStorage.getItem("userToken");
    const authenticatedLinks = document.querySelectorAll(".authenticated");
    const guestLinks = document.querySelectorAll(".guest");

    if (userToken) {
      authenticatedLinks.forEach((link) => (link.style.display = "block"));
      guestLinks.forEach((link) => (link.style.display = "none"));
    } else {
      authenticatedLinks.forEach((link) => (link.style.display = "block"));
      guestLinks.forEach((link) => (link.style.display = "none"));
    }

    if (userToken) {
      authenticatedLinks.forEach((link) => (link.style.display = "block"));
      guestLinks.forEach((link) => (link.style.display = "none"));
    } else {
      authenticatedLinks.forEach((link) => (link.style.display = "none"));
      guestLinks.forEach((link) => (link.style.display = "block"));
    }
  }
}

export default App;
