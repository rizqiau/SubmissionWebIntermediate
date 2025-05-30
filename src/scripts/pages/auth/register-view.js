class RegisterView {
  getTemplate() {
    return `
        <section class="container">
          <h1>Register Page</h1>
          <form id="registerForm">
            <div class="form-group">
              <label for="name">Name</label>
              <input type="text" id="name" name="name" required>
            </div>
            <div class="form-group">
              <label for="email">Email</label>
              <input type="email" id="email" name="email" required>
            </div>
            <div class="form-group">
              <label for="password">Password</label>
              <input type="password" id="password" name="password" required>
            </div>
            <button type="submit">Register</button>
          </form>
          <p>Sudah punya akun? <a href="#/login">Login di sini</a></p>
        </section>
      `;
  }

  get form() {
    return document.querySelector("#registerForm");
  }

  get nameInput() {
    return document.querySelector("#name");
  }

  get emailInput() {
    return document.querySelector("#email");
  }

  get passwordInput() {
    return document.querySelector("#password");
  }

  bindRegisterEvent(callback) {
    this.form.addEventListener("submit", (event) => {
      event.preventDefault();
      callback({
        name: this.nameInput.value,
        email: this.emailInput.value,
        password: this.passwordInput.value,
      });
    });
  }

  showRegisterSuccess() {
    alert("Registrasi Berhasil! Silakan Login.");
  }

  showRegisterError(message) {
    alert(`Registrasi Gagal: ${message}`);
  }
}

export default RegisterView;
