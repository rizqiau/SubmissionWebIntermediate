import RegisterView from "./register-view";
import RegisterPresenter from "./register-presenter";

class RegisterPage {
  constructor() {
    this.#renderUI();
  }

  async render() {
    return '<div id="register-container"></div>'; // Kontainer untuk view register
  }

  async afterRender() {
    const registerContainer = document.querySelector("#register-container");
    const registerView = new RegisterView();
    registerContainer.innerHTML = registerView.getTemplate();

    new RegisterPresenter({
      view: registerView,
      onRegisterSuccess: () => {
        window.location.hash = "#/login"; // Redirect ke login setelah register berhasil
      },
      onRegisterError: (message) => {
        console.error("Registration failed:", message);
      },
    });
  }

  #renderUI() {
    // Kosongkan dulu. Implementasi UI ViewTransition akan di sini.
  }
}

export default RegisterPage;
