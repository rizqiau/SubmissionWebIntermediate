// src/scripts/pages/app.js
import routes from "../routes/routes";
import { getActiveRoute } from "../routes/url-parser";
import { getToken, removeToken } from "../data/auth-helper"; // Import getToken dan removeToken

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
    const logoutButton = document.querySelector("#logoutButton");
    if (logoutButton) {
      logoutButton.removeEventListener("click", this._handleLogout);
      logoutButton.addEventListener("click", this._handleLogout);
    }

    const addStoryButton = document.querySelector("#addStoryButton");
    if (addStoryButton) {
      addStoryButton.removeEventListener("click", this._handleAddStory);
      addStoryButton.addEventListener("click", this._handleAddStory);
    }

    this._updateNavigationVisibility();
  }

  _handleLogout = (event) => {
    event.preventDefault();
    removeToken(); // Menggunakan removeToken dari auth-helper
    window.location.hash = "#/login";
  };

  _handleAddStory = (event) => {
    event.preventDefault();
    window.location.hash = "#/add-story";
  };

  async renderPage() {
    const url = getActiveRoute();
    const page = routes[url];

    if (page && typeof page.beforeRender === "function") {
      await page.beforeRender();
    }

    if (document.startViewTransition) {
      document.startViewTransition(async () => {
        this.#content.innerHTML = await page.render();
        await page.afterRender();
        this._setupNavigation();
      });
    } else {
      this.#content.innerHTML = await page.render();
      await page.afterRender();
      this._setupNavigation();
    }

    this._updateNavigationVisibility();
  }

  _updateNavigationVisibility() {
    const userToken = getToken(); // Menggunakan getToken dari auth-helper
    const authenticatedLinks = document.querySelectorAll(".authenticated");
    const guestLinks = document.querySelectorAll(".guest");

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
