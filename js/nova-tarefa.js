const apiUrl = "https://68cca001716562cf5077f466.mockapi.io/api/tarefas";

document.addEventListener("DOMContentLoaded", function () {

  const form = document.querySelector('form');
  if (!form) return;

  // Pega o id da lista da URL
  function getUrlParameter(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    const regex = new RegExp("[\?&]" + name + "=([^&#]*)");
    const results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
  }
  const listaId = getUrlParameter('id');

  form.addEventListener("submit", async function criarTarefa(e) {
    e.preventDefault();

    const titulo = form.querySelector('input[name="titulo"]').value.trim();
    const prioridade = form.querySelector('select[name="prioridade"]').value.trim();
    const descricao = form.querySelector('textarea[name="descricao"]').value.trim();

    const loadingPopup = document.createElement("div");
    loadingPopup.textContent = "Cadastrando tarefa...";
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
      if (!listaId) throw new Error("Lista não encontrada");
      const endpoint = `https://68cca001716562cf5077f466.mockapi.io/api/listas/${listaId}/tarefas`;
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ titulo, prioridade, descricao, concluida: false }),
      });

      if (!response.ok) throw new Error("Erro ao cadastrar tarefa");

      alert("Tarefa cadastrada com sucesso!");
      form.reset();

      setTimeout(() => {
        window.location.href = `lista.html?id=${listaId}`;
      }, 500);
    } catch (err) {
      alert("Falha ao cadastrar tarefa: " + err.message);
    } finally {
      document.body.removeChild(loadingPopup);
    }
  });
});
