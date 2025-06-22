class RegisterView {
  getTemplate() {
    return `
      <section class="auth-section">
        <div class="auth-card">
          <h1>Register</h1>
          <form id="registerForm" class="auth-form">
            <div class="form-group">
              <label for="name">Nama</label>
              <input type="text" id="name" name="name" required placeholder="Masukkan nama Anda">
            </div>
            <div class="form-group">
              <label for="email">Email</label>
              <input type="email" id="email" name="email" required placeholder="Masukkan email Anda">
            </div>
            <div class="form-group">
              <label for="password">Password</label>
              <input type="password" id="password" name="password" required placeholder="Minimal 8 karakter">
            </div>
            <button type="submit" class="auth-button">Register</button>
          </form>
          <p class="auth-switch-link">Sudah punya akun? <a href="#/login">Login di sini</a></p>
          <div id="loading-indicator" class="loading-indicator auth-loading-indicator" style="display:none;">
            <div class="spinner"></div>
            <p>Registering...</p>
          </div>
          <div id="error-message" class="error-message auth-error-message" style="display:none;"></div>
        </div>
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

  get loadingIndicator() {
    return document.querySelector("#loading-indicator");
  }

  get errorMessage() {
    return document.querySelector("#error-message");
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

  showRegisterSuccess() {}

  showRegisterError(message) {
    if (this.errorMessage) {
      this.errorMessage.textContent = `Registrasi Gagal: ${message}`;
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

export default RegisterView;
