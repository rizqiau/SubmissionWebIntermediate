import RegisterView from "./register-view";
import RegisterPresenter from "./register-presenter";

class RegisterPage {
  #view = null;
  constructor() {}

  async render() {
    return '<div id="register-container"></div>';
  }

  async afterRender() {
    const registerContainer = document.querySelector("#register-container");
    this.#view = new RegisterView();
    registerContainer.innerHTML = this.#view.getTemplate();

    new RegisterPresenter({
      view: this.#view,
      onRegisterSuccess: () => {
        alert("Registrasi Berhasil! Silakan Login.");
        window.location.hash = "#/login";
      },
      onRegisterError: (message) => {
        console.error("Registration failed:", message);
      },
    });
  }
}

export default RegisterPage;
