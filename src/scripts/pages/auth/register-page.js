import RegisterView from "./register-view";
import RegisterPresenter from "./register-presenter";

class RegisterPage {
  constructor() {
    this.#renderUI();
  }

  async render() {
    return '<div id="register-container"></div>';
  }

  async afterRender() {
    const registerContainer = document.querySelector("#register-container");
    const registerView = new RegisterView();
    registerContainer.innerHTML = registerView.getTemplate();

    new RegisterPresenter({
      view: registerView,
      onRegisterSuccess: () => {
        window.location.hash = "#/login";
      },
      onRegisterError: (message) => {
        console.error("Registration failed:", message);
      },
    });
  }

  #renderUI() {}
}

export default RegisterPage;
