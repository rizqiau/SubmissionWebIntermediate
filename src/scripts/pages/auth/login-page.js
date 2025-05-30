import LoginView from "./login-view";
import LoginPresenter from "./login-presenter";

class LoginPage {
  constructor() {
    this.#renderUI();
  }

  async render() {
    return '<div id="login-container"></div>'; // Kontainer untuk view login
  }

  async afterRender() {
    const loginContainer = document.querySelector("#login-container");
    const loginView = new LoginView();
    loginContainer.innerHTML = loginView.getTemplate();

    new LoginPresenter({
      view: loginView,
      onLoginSuccess: () => {
        window.location.hash = "#/"; // Redirect ke home setelah login berhasil
      },
      onLoginError: (message) => {
        console.error("Login failed:", message);
      },
    });
  }

  #renderUI() {
    // Kosongkan dulu. Implementasi UI ViewTransition akan di sini.
  }
}

export default LoginPage;
