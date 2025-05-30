class LoginView {
  getTemplate() {
    return `
      <section class="auth-section">
        <div class="auth-card">
          <h1>Login</h1>
          <form id="loginForm" class="auth-form">
            <div class="form-group">
              <label for="email">Email</label>
              <input type="email" id="email" name="email" required placeholder="Masukkan email Anda">
            </div>
            <div class="form-group">
              <label for="password">Password</label>
              <input type="password" id="password" name="password" required placeholder="Masukkan password Anda">
            </div>
            <button type="submit" class="auth-button">Login</button>
          </form>
          <p class="auth-switch-link">Belum punya akun? <a href="#/register">Daftar di sini</a></p>
          <div id="loading-indicator" class="loading-indicator auth-loading-indicator" style="display:none;">
            <div class="spinner"></div>
            <p>Authenticating...</p>
          </div>
          <div id="error-message" class="error-message auth-error-message" style="display:none;"></div>
        </div>
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

  get loadingIndicator() {
    return document.querySelector("#loading-indicator");
  }

  get errorMessage() {
    return document.querySelector("#error-message");
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

  showLoginSuccess() {}

  showLoginError(message) {
    if (this.errorMessage) {
      this.errorMessage.textContent = `Login Gagal: ${message}`;
      this.errorMessage.style.display = "block";
    }
  }

  showLoading() {
    if (this.loadingIndicator) {
      this.loadingIndicator.style.display = "flex";
      this.errorMessage.style.display = "none";
      this.form.querySelector(".auth-button").disabled = true;
    }
  }

  hideLoading() {
    if (this.loadingIndicator) {
      this.loadingIndicator.style.display = "none";
      this.form.querySelector(".auth-button").disabled = false;
    }
  }
}

export default LoginView;
