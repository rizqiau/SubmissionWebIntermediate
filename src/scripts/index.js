// CSS imports
import "../styles/styles.css";

import App from "./pages/app";
import { getActiveRoute } from "./routes/url-parser";

document.addEventListener("DOMContentLoaded", async () => {
  const app = new App({
    content: document.querySelector("#main-content"),
    drawerButton: document.querySelector("#drawer-button"),
    navigationDrawer: document.querySelector("#navigation-drawer"),
  });

  const userToken = localStorage.getItem("userToken");
  const activePath = getActiveRoute();

  // If no token and not on login/register page, redirect to login
  if (!userToken && activePath !== "/login" && activePath !== "/register") {
    window.location.hash = "#/login";
  } else if (
    userToken &&
    (activePath === "/login" || activePath === "/register")
  ) {
    // If token exists and user tries to access login/register page, redirect to home
    window.location.hash = "#/";
  } else {
    // Render the page if token exists or if it's login/register page without token
    await app.renderPage();
  }

  window.addEventListener("hashchange", async () => {
    const updatedUserToken = localStorage.getItem("userToken");
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
