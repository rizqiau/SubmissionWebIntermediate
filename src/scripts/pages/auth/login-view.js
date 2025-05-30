class LoginView {
  getTemplate() {
    return `
        <section class="container">
          <h1>Login Page</h1>
          <form id="loginForm">
            <div class="form-group">
              <label for="email">Email</label>
              <input type="email" id="email" name="email" required>
            </div>
            <div class="form-group">
              <label for="password">Password</label>
              <input type="password" id="password" name="password" required>
            </div>
            <button type="submit">Login</button>
          </form>
          <p>Belum punya akun? <a href="#/register">Daftar di sini</a></p>
        </section>
      `;
  }

  get form() {
    return document.querySelector("#loginForm");
  }

  get emailInput() {
    return document.querySelector("#email");
  }

  get passwordInput() {
    return document.querySelector("#password");
  }

  bindLoginEvent(callback) {
    this.form.addEventListener("submit", (event) => {
      event.preventDefault();
      callback({
        email: this.emailInput.value,
        password: this.passwordInput.value,
      });
    });
  }

  showLoginSuccess() {
    alert("Login Berhasil!");
  }

  showLoginError(message) {
    alert(`Login Gagal: ${message}`);
  }
}

export default LoginView;
