const apiUrl = "https://68cca001716562cf5077f466.mockapi.io/api/usuarios";

document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector('form[action="dashboard.html"]');
  if (!form) return;

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const usuarioInput = form.querySelector('#usuario').value.trim();
    const senhaInput = form.querySelector('#senha').value;

    if (!usuarioInput || !senhaInput) {
      alert("Preencha usuário/email e senha.");
      return;
    }

    // Exibe pop-up de carregamento
    const loadingPopup = document.createElement("div");
    loadingPopup.textContent = "Verificando login...";
    loadingPopup.style.position = "fixed";
    loadingPopup.style.top = "50%";
    loadingPopup.style.left = "50%";
    loadingPopup.style.transform = "translate(-50%, -50%)";
    loadingPopup.style.backgroundColor = "#333";
    loadingPopup.style.color = "#fff";
    loadingPopup.style.padding = "1rem 2rem";
    loadingPopup.style.borderRadius = "8px";
    loadingPopup.style.zIndex = "9999";
    document.body.appendChild(loadingPopup);

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error("Erro ao buscar usuários");
      const usuarios = await response.json();

      // Busca por usuário ou email
      const usuario = usuarios.find(u =>
        (u.usuario === usuarioInput || u.email === usuarioInput) && u.senha === senhaInput
      );

      if (!usuario) {
        alert("Usuário ou senha inválidos.");
        return;
      }

      // Salva usuário logado
      localStorage.setItem("usuario", JSON.stringify(usuario));
      window.location.href = "dashboard.html";
    } catch (err) {
      alert("Falha ao fazer login: " + err.message);
    } finally {
      document.body.removeChild(loadingPopup);
    }
  });
});
