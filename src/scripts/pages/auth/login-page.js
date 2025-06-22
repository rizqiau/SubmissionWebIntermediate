import LoginView from "./login-view";
import LoginPresenter from "./login-presenter";

class LoginPage {
  #view = null;
  constructor() {}

  async render() {
    return '<div id="login-container"></div>';
  }

  async afterRender() {
    const loginContainer = document.querySelector("#login-container");
    this.#view = new LoginView();
    loginContainer.innerHTML = this.#view.getTemplate();

    new LoginPresenter({
      view: this.#view,
      onLoginSuccess: () => {
        window.location.hash = "#/";
      },
      onLoginError: (message) => {
        console.error("Login failed:", message);
      },
    });
  }
}

export default LoginPage;
