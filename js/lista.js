document.addEventListener("DOMContentLoaded", function () {
   const tasksContainer = document.querySelector(".card__tasks");
   const taskCountElement = document.querySelector(".card__meta strong");
   const pendingCountElement = document.querySelector(".card__meta small");
   const completedCountElement = document.querySelector(".card__meta small + small");

   function getUrlParameter(name) {
      name = name.replace(/[[\]]/g, "\\$&");
      const regex = new RegExp("[?&]" + name + "=([^&#]*)");
      const results = regex.exec(location.search);
      return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
   }

   const listId = getUrlParameter('id');
   if (!listId) {
      console.log("Nenhum ID de lista fornecido na URL. Exibindo a lista estática.");
      return;
   }

   const apiBase = "https://68cca001716562cf5077f466.mockapi.io/api";

   async function fetchListAndTasks() {
      try {
         // Busca os dados da lista
         const listResponse = await fetch(`${apiBase}/listas/${listId}`);
         if (!listResponse.ok) throw new Error("Lista não encontrada");
         const listData = await listResponse.json();

         // Busca as tarefas da lista
         const tasksResponse = await fetch(`${apiBase}/listas/${listId}/tarefas`);
         if (!tasksResponse.ok) throw new Error("Tarefas não encontradas");
         const tasks = await tasksResponse.json();

         const completedTasks = tasks.filter(task => task.concluida).length;
         const pendingTasks = tasks.length - completedTasks;

         // Atualiza o cabeçalho com os dados da API
         document.querySelector(".card__title").textContent = listData.titulo || listData.nome || "Lista sem título";
         document.querySelector(".card__description").textContent = listData.descricao || "Sem descrição";
         taskCountElement.textContent = `${tasks.length} tarefas`;
         pendingCountElement.textContent = `${pendingTasks} pendentes`;
         completedCountElement.textContent = `${completedTasks} concluídas`;

         // Limpa as tarefas estáticas antes de adicionar as tarefas da API
         tasksContainer.innerHTML = "";

         // Adiciona as tarefas da API
         tasks.forEach(task => {
            const li = document.createElement("li");
            li.classList.add("card__task");
            li.innerHTML = `
               <div class="card__task-info">
                  <input type="checkbox" name="task-${task.id}" id="task-${task.id}" ${task.concluida ? 'checked' : ''}>
                  <label for="task-${task.id}" class="card__name">${esc(task.titulo)}</label>
                  <span class="card__deadline">${esc(task.descricao)}</span>
                  <span class="card__owner">Prioridade: ${esc(task.prioridade)}</span>
               </div>
               <div class="card__task-action">
                  <span class="card__label card__label--${task.prioridade?.toLowerCase() || 'low'}">${esc(task.prioridade)}</span>
                  <img width="30" height="30" src="https://img.icons8.com/windows/100/trash.png" alt="trash" />
               </div>
            `;
            tasksContainer.appendChild(li);
         });

      } catch (error) {
         console.error("Erro:", error);
         alert("Não foi possível carregar a lista. Tente novamente mais tarde.");
      }
   }

   fetchListAndTasks();
});

function esc(s) {
  return String(s ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}