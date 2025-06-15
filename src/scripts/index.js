import "../styles/styles.css";

import App from "./pages/app";
import { getActiveRoute } from "./routes/url-parser";
import { getToken } from "./data/auth-helper";
import { removeToken } from "./data/auth-helper";

document.addEventListener("DOMContentLoaded", async () => {
  const app = new App({
    content: document.querySelector("#main-content"),
    drawerButton: document.querySelector("#drawer-button"),
    navigationDrawer: document.querySelector("#navigation-drawer"),
  });

  const mainContent = document.querySelector("#main-content");
  const skipLink = document.querySelector(".skip-link");

  if (skipLink && mainContent) {
    skipLink.addEventListener("click", function (event) {
      event.preventDefault();
      skipLink.blur();

      mainContent.focus();
      mainContent.scrollIntoView();
    });
  }

  const userToken = getToken();
  const activePath = getActiveRoute();

  if (!userToken && activePath !== "/login" && activePath !== "/register") {
    window.location.hash = "#/login";
  } else if (
    userToken &&
    (activePath === "/login" || activePath === "/register")
  ) {
    window.location.hash = "#/";
  } else {
    await app.renderPage();
  }

  window.addEventListener("hashchange", async () => {
    const updatedUserToken = getToken();
    const currentActivePath = getActiveRoute();

    if (
      !updatedUserToken &&
      currentActivePath !== "/login" &&
      currentActivePath !== "/register"
    ) {
      window.location.hash = "#/login";
    } else if (
      updatedUserToken &&
      (currentActivePath === "/login" || currentActivePath === "/register")
    ) {
      window.location.hash = "#/";
    } else {
      await app.renderPage();
    }
  });
});
