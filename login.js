// LISTA ACCOUNT AUTORIZZATI (LI CREI TU)
const users = [
  {
    email: "cliente1@email.com",
    password: "GenFatture123"
  },
  {
    email: "marcoagretto5@gmail.com",
    password: "Mar06agr_"
  }
{
  email: "nuovo@email.com",
  password: "PasswordCheDecidiTu"
}

];

// FUNZIONE LOGIN
function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const error = document.getElementById("error");

  const user = users.find(
    u => u.email === email && u.password === password
  );

  if (user) {
    // Salvo accesso
    localStorage.setItem("loggedIn", "true");
    localStorage.setItem("userEmail", email);

    // Vado al generatore
    window.location.href = "dashboard.html";
  } else {
    error.textContent = "Credenziali non valide";
  }
}
