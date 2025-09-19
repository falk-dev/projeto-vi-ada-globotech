const apiUrl = "https://68cca001716562cf5077f466.mockapi.io/api/tarefas";

document.addEventListener("DOMContentLoaded", function () {

  const form = document.querySelector('form');

  if (!form) return;

  form.addEventListener("submit", async function criarTarefa(e) {
    e.preventDefault();

    // Coleta valores
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
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ titulo, prioridade, descricao, concluida: false, listaId: 1 }),
      });

      if (!response.ok) throw new Error("Erro ao cadastrar tarefa");

      alert("Tarefa cadastrada com sucesso!");
      form.reset();

      // Redireciona após pequeno atraso
      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 500);
    } catch (err) {
      alert("Falha ao cadastrar tarefa");
    } finally {
      document.body.removeChild(loadingPopup);
    }
  })
});
