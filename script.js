document
  .getElementById("registration-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const login = document.getElementById("login").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const lastname = document.getElementById("lastname").value.trim();
    const firstname = document.getElementById("firstname").value.trim();
    const adresse = document.getElementById("adresse").value.trim();
    const email = document.getElementById("email").value.trim();
    const phoneNumber = document.getElementById("phoneNumber").value.trim();
    const birthDate = document.getElementById("birthDate").value.trim();

    const errorMessage = document.getElementById("error-message");

    if (
      !login ||
      !password ||
      !confirmPassword ||
      !lastname ||
      !firstname ||
      !adresse ||
      !email ||
      !phoneNumber ||
      !birthDate
    ) {
      showError("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      showError("L'adresse email n'est pas valide.");
      return;
    }

    if (password !== confirmPassword) {
      showError("Les mots de passe ne correspondent pas.");
      return;
    }

    // If everything is valid, hide the error message
    errorMessage.classList.add("hidden");

    showSummary({
      login,
      nom: lastname,
      firstname,
      adresse,
      email,
      phoneNumber: phoneNumber,
      birthDate: birthDate,
    });
  });

function showError(message) {
  const errorMessage = document.getElementById("error-message");
  errorMessage.textContent = message;
  errorMessage.classList.remove("hidden");
}

function showSummary(data) {
  document.getElementById("form-container").classList.add("hidden");
  document.getElementById("summary-container").classList.remove("hidden");

  const summaryList = document.getElementById("summary-list");
  summaryList.innerHTML = "";

  const fields = [
    ["Login", data.login],
    ["Nom", data.lastname],
    ["Prénom", data.firstname],
    ["Adresse", data.adresse],
    ["Email", data.email],
    ["Téléphone", data.phoneNumber],
    ["Date de naissance", data.birthDate],
  ];

  fields.forEach(([label, value]) => {
    const li = document.createElement("li");
    const strong = document.createElement("strong");
    strong.textContent = `${label} : `;

    li.appendChild(strong);
    li.appendChild(document.createTextNode(value));
    summaryList.appendChild(li);
  });
}
