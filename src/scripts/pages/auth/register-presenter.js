import { registerUser } from "../../data/api"; //

class RegisterPresenter {
  #view = null;
  #onRegisterSuccess = null;
  #onRegisterError = null;

  constructor({ view, onRegisterSuccess, onRegisterError }) {
    this.#view = view;
    this.#onRegisterSuccess = onRegisterSuccess;
    this.#onRegisterError = onRegisterError;

    this.#view.bindRegisterEvent(this._register.bind(this));
  }

  async _register(data) {
    try {
      const response = await registerUser(data); //
      if (response.error) {
        this.#view.showRegisterError(response.message);
        if (this.#onRegisterError) {
          this.#onRegisterError(response.message);
        }
      } else {
        this.#view.showRegisterSuccess();
        if (this.#onRegisterSuccess) {
          this.#onRegisterSuccess();
        }
      }
    } catch (error) {
      console.error("Error during registration:", error);
      this.#view.showRegisterError("Terjadi kesalahan saat registrasi.");
      if (this.#onRegisterError) {
        this.#onRegisterError("Terjadi kesalahan saat registrasi.");
      }
    }
  }
}

export default RegisterPresenter;
