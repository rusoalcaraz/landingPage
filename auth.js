// ====== Base URL por ambiente ======
// En dev: http://localhost:4002
// En prod: https://www.wachopify.com.mx
const BASE_URL =
  location.hostname === "localhost" ||
  location.hostname === "127.0.0.1"
    ? "http://localhost:4002"
    : "https://www.wachopify.com.mx";

// ====== Helpers ======
const q = (s) => document.querySelector(s);
const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// ====== LOGIN (paso 1: email) ======
(function setupLoginEmail() {
  const form = q("#form-email");
  if (!form) return;

  const emailInput = q("#email");
  const emailHelp = q("#emailHelp");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = (emailInput.value || "").trim();
    if (!isValidEmail(email)) {
      emailHelp?.classList.remove("hidden");
      return;
    }
    emailHelp?.classList.add("hidden");
    // Ejecuta reCAPTCHA invisible: callback -> onRecaptchaSuccessEmail
    grecaptcha.execute();
  });

  // reCAPTCHA callback para el paso 1
  window.onRecaptchaSuccessEmail = async function (token) {
    try {
      const email = (emailInput.value || "").trim();
      const r = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          step: "start",
          email,
          recaptchaToken: token,
        }),
        credentials: "include",
      });
      const data = await r.json();
      if (!r.ok)
        throw new Error(data.message || "No se pudo continuar");

      // Mostrar formulario de contraseña
      const formEmail = q("#form-email");
      const formPass = q("#form-password");
      q("#emailDisplay").textContent = email;
      q("#emailHidden").value = email;
      formEmail.classList.add("hidden");
      formPass.classList.remove("hidden");
    } catch (e) {
      alert(e.message || "Error al validar el correo.");
    } finally {
      grecaptcha.reset();
    }
  };
})();

// ====== LOGIN (paso 2: password) ======
(function setupLoginPassword() {
  const form = q("#form-password");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    grecaptcha.execute(); // callback -> onRecaptchaSuccessPassword
  });

  window.onRecaptchaSuccessPassword = async function (token) {
    try {
      const email = q("#emailHidden").value;
      const password = q("#password").value;

      const r = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          step: "password",
          email,
          password,
          recaptchaToken: token,
        }),
        credentials: "include",
      });
      const data = await r.json();
      if (!r.ok)
        throw new Error(data.message || "Credenciales inválidas");

      // Redirige a tu app (ajusta ruta)
      location.href = "/app";
    } catch (e) {
      alert(e.message || "No pudimos iniciar sesión.");
    } finally {
      grecaptcha.reset();
    }
  };
})();

// ====== REGISTRO ======
(function setupRegister() {
  const form = q("#form-register");
  if (!form) return;

  const emailInput = q("#email");
  const emailHelp = q("#regEmailHelp");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = (emailInput.value || "").trim();
    if (!isValidEmail(email)) {
      emailHelp?.classList.remove("hidden");
      return;
    }
    emailHelp?.classList.add("hidden");
    grecaptcha.execute(); // callback -> onRecaptchaSuccessRegister
  });

  window.onRecaptchaSuccessRegister = async function (token) {
    try {
      const body = {
        name: q("#name").value,
        email: q("#email").value,
        password: q("#password").value,
        recaptchaToken: token,
      };

      const r = await fetch(`${BASE_URL}/auth/registro`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        credentials: "include",
      });
      const data = await r.json();
      if (!r.ok)
        throw new Error(data.message || "Error al registrar");

      alert("Cuenta creada. Ahora inicia sesión.");
      location.href = "/login.html";
    } catch (e) {
      alert(e.message || "No pudimos crear la cuenta.");
    } finally {
      grecaptcha.reset();
    }
  };
})();

// ====== reCAPTCHA error genérico ======
window.onRecaptchaError = function () {
  alert(
    "No pudimos verificar que no eres un robot. Intenta de nuevo."
  );
};

// ====== Google Identity Services (login/registro con Google) ======
window.onGoogleCredential = async function (response) {
  try {
    const r = await fetch(`${BASE_URL}/auth/google`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ credential: response.credential }),
      credentials: "include",
    });
    const data = await r.json();
    if (!r.ok) throw new Error(data.message || "Error con Google");
    location.href = "/app";
  } catch (e) {
    alert(e.message || "No pudimos continuar con Google.");
  }
};
