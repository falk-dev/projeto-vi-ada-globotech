
// TODO Trocar o token no site do CRUDCRUD
const apiUrl = "https://crudcrud.com/api/66160e6ad6214c97913534093fb32516/usuarios";

document.addEventListener("DOMContentLoaded", function () {
   const form = document.querySelector("form");
   if (!form) return;

   form.addEventListener("submit", async function (e) {
      e.preventDefault();

      // Limpa mensagens de erro anteriores
      form.querySelectorAll(".error-message").forEach((el) => {
         el.textContent = "";
         el.style.display = "none";
      });

      // Coleta valores
      const nome = form.querySelector('input[name="nome"]').value.trim();
      const usuario = form.querySelector('input[name="usuario"]').value.trim();
      const email = form.querySelector('input[name="email"]').value.trim();
      const senha = form.querySelector('input[name="senha"]').value;
      const confirmar = form.querySelector('input[name="confirmar"]').value;
      const termos = form.querySelector('input[name="termos"]').checked;

      let valido = true;

      // Validação nome
      if (!nome || nome.length < 5) {
         const el = form.querySelector("#nome-error");
         el.textContent = "Informe o nome completo (mínimo 5 caracteres).";
         el.style.display = "block";
         valido = false;
      }

      // Validação usuário
      if (!usuario || !/^[A-Za-z0-9_.-@]{4,20}$/.test(usuario)) {
         const el = form.querySelector("#usuario-error");
         el.textContent = "Usuário deve ter 4-20 caracteres: apenas letras, números e o caractere _ (sublinhado).";
         el.style.display = "block";
         valido = false;
      }

      // Validação email
      if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
         const el = form.querySelector("#email-error");
         el.textContent = "Digite um e-mail válido.";
         el.style.display = "block";
         valido = false;
      }

      // Validação senha
      if (!senha || senha.length < 6) {
         const el = form.querySelector("#senha-error");
         el.textContent = "Senha deve ter no mínimo 6 caracteres.";
         el.style.display = "block";
         valido = false;
      }

      // Validação confirmação de senha
      if (confirmar !== senha || !confirmar) {
         const el = form.querySelector("#confirmar-error");
         el.textContent = "As senhas não conferem.";
         el.style.display = "block";
         valido = false;
      }

      // Validação termos
      if (!termos) {
         alert("Você deve aceitar os termos de uso.");
         valido = false;
      }

      if (!valido) return;

      // Exibe pop-up de carregamento
      const loadingPopup = document.createElement("div");
      loadingPopup.textContent = "Cadastrando usuário...";
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
         await fetch(apiUrl, {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({ nome, usuario, email, senha })
         })
         .then(response => {
            if (!response.ok) throw new Error("Erro ao cadastrar usuário");
            // Sincronização: buscar o usuário cadastrado
            return fetch(apiUrl)
               .then(res => res.json())
               .then(usuarios => {
                  // Aqui você pode sincronizar dados, exibir ou salvar no localStorage
                  // Exemplo: salvar o último usuário cadastrado
                  const novoUsuario = usuarios.find(u => u.email === email);
                  if (novoUsuario) {
                     localStorage.setItem("usuario", JSON.stringify(novoUsuario));
                  }
               });
         })
         .then(() => {
            document.body.removeChild(loadingPopup);
            alert("Usuário cadastrado com sucesso!");
            form.reset();
            setTimeout(() => {
               window.location.href = "dashboard.html";
            }, 500);
         })
         .catch(err => {
            document.body.removeChild(loadingPopup);
            alert("Falha ao cadastrar usuário: " + err.message);
         });
      }
   });
});
