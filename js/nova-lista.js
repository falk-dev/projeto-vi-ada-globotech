const apiUrl = "https://68cca001716562cf5077f466.mockapi.io/api/listas";

document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector('form');

  if (!form) return;

  form.addEventListener("submit", async function criarLista(e) {
    e.preventDefault();

    // Coleta valores do formulário
    const nomeLista = form.querySelector('#nomeListaInput').value.trim();
    const permitirEdicao = form.querySelector('input[name="permitir-edicao"]').checked;
    const compartilhar = form.querySelector('input[name="compartilhar"]').checked;

    // Coleta os itens da lista (inputs sem ID específico)
    const itemInputs = form.querySelectorAll('input[type="text"]:not(#nomeListaInput)');
    const itens = [];
    itemInputs.forEach(input => {
      const valor = input.value.trim();
      if (valor) {
        itens.push(valor);
      }
    });

    // Validação básica
    if (!nomeLista) {
      alert("Por favor, digite o nome da lista.");
      form.querySelector('#nomeListaInput').focus();
      return;
    }
    if (nomeLista.length < 3) {
      alert("O nome da lista deve ter pelo menos 3 caracteres.");
      form.querySelector('#nomeListaInput').focus();
      return;
    }
    if (itens.length === 0) {
      alert("Por favor, adicione pelo menos um item à lista.");
      return;
    }

    // Exibe pop-up de carregamento
    const loadingPopup = document.createElement("div");
    loadingPopup.textContent = "Criando lista...";
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
      // Cria a lista sem o array de itens
      const usuario = localStorage.getItem("usuario");
      const usuarioId = usuario ? JSON.parse(usuario).id : "1";
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          titulo: nomeLista,
          permitirEdicao: permitirEdicao,
          compartilhar: compartilhar,
          dataCriacao: new Date().toISOString(),
          usuarioId: String(usuarioId)
        }),
      });

      if (!response.ok) throw new Error("Erro ao criar lista");
      const listaCriada = await response.json();

      // Cria cada tarefa individualmente no endpoint /tarefas
      for (const texto of itens) {
        await fetch("https://68cca001716562cf5077f466.mockapi.io/api/tarefas", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            titulo: texto,
            descricao: "",
            prioridade: "baixa",
            concluida: false,
            listaId: listaCriada.id
          })
        });
      }

      alert("Lista criada com sucesso!");
      form.reset();

      // Salva usuário logado no localStorage (exemplo: id fixo)
      if (!localStorage.getItem("usuario")) {
        localStorage.setItem("usuario", JSON.stringify({ id: 1, nome: "Usuário Teste" }));
      }

      // Redireciona após pequeno atraso
      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 500);
    } catch (err) {
      alert("Falha ao criar lista: " + err.message);
    } finally {
      document.body.removeChild(loadingPopup);
    }
  });

  // Adiciona funcionalidade para pressionar Enter nos campos de item
  const itemInputs = form.querySelectorAll('input[type="text"]:not(#nomeListaInput)');
  itemInputs.forEach((input, index) => {
    input.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        // Move para o próximo campo ou submete o formulário se for o último
        if (index < itemInputs.length - 1) {
          itemInputs[index + 1].focus();
        } else {
          form.querySelector('button[type="submit"]').click();
        }
      }
    });
  });

  // Adiciona funcionalidade para o campo nome da lista
  const nomeListaInput = form.querySelector('#nomeListaInput');
  if (nomeListaInput) {
    nomeListaInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        // Move para o primeiro campo de item
        itemInputs[0].focus();
      }
    });
  }
});
