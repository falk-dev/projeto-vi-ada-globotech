// js/dashboard.js — versão para MockAPI, mantendo seu layout

const BASE = "https://68cca001716562cf5077f466.mockapi.io/api";
const URLS = {
  users: `${BASE}/usuarios`,
  lists: `${BASE}/listas`,
  tasks: `${BASE}/tarefas`,
};

document.addEventListener("DOMContentLoaded", initDashboard);

async function initDashboard() {
  const user = getCurrentUser();

  console.log({ user });
  // if (!user?.id) {
  //   window.location.href = "index.html";
  //   return;
  // }

  const grid = document.querySelector(".dashboard-lists");
  if (!grid) return;

  grid.innerHTML = `<p style="grid-column:1/-1; text-align:center;">Carregando suas listas...</p>`;

  try {
    console.log("tonhao");

    console.log(user);
    console.log(user.id);
    const lists = await apiGet(`${URLS.lists}?usuarioId=${encodeURIComponent(user.id)}&sortBy=createdAt&order=desc`);

    if (!lists.length) {
      grid.innerHTML = `
        <div style="grid-column:1/-1; text-align:center; color:#6B7280;">
          <p>Nenhuma lista encontrada.</p>
          <a class="btn primary" href="nova-lista.html">CRIAR LISTA</a>
        </div>`;
      return;
    }

    const cards = await Promise.all(
      lists.map(async (l) => {
        const counts = await getCountsForList(l.id);
        return renderListCard(l, counts);
      })
    );

    grid.innerHTML = "";
    cards.forEach((c) => grid.appendChild(c));
  } catch (err) {
    grid.innerHTML = `<p style="grid-column:1/-1; color:#b00020; text-align:center;">Erro ao carregar: ${err.message}</p>`;
  }
}

async function getCountsForList(listId) {
  const tasks = await apiGet(`${URLS.tasks}?listaId=${encodeURIComponent(listId)}&sortBy=createdAt&order=desc`);
  const total = tasks.length;
  const concluidas = tasks.filter((t) => !!t.done).length;
  const pendentes = total - concluidas;
  return { total, pendentes, concluidas };
}

async function apiGet(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`GET falhou (${r.status})`);
  return r.json();
}

function getCurrentUser() {
  localStorage.setItem('usuario', JSON.stringify({ "nome": "Alice Ochoa", "usuario": "aliceochoa", "email": "alice.ochoa@outlook.com", "senha": "123456", "id": "1" }));

  try {
    let raw = localStorage.getItem("usuario");
    raw = raw ? JSON.parse(raw) : null;
    if (raw !== null) return raw;
    return users;
  } catch {
    return null;
  }
}

function renderListCard(list, counts) {
  const artigo = document.createElement("article");
  artigo.className = "card dashboard-list-card";
  artigo.dataset.total = counts.total;
  artigo.dataset.pendentes = counts.pendentes;
  artigo.dataset.concluidas = counts.concluidas;
  artigo.dataset.prioridade = list.priority || "baixa";

  const prio = list.priority || "baixa";

  artigo.innerHTML = `
    <span class="badge badge--prio ${prioClass(prio)}">${prioLabel(prio)}</span>

    <h2 class="dashboard-list-card__title">
      <a href="lista.html?id=${list.id}">${esc(list.title || "Lista sem título")}</a>
    </h2>

    <div class="badges-inline">
      <a class="meta-link" href="lista.html?id=${list.id}#todas"><strong>${counts.total}</strong> tarefas</a>
      <span class="dot">·</span>
      <a class="meta-link" href="lista.html?id=${list.id}#pendentes"><strong>${counts.pendentes}</strong> pendentes</a>
      <span class="dot">·</span>
      <a class="meta-link" href="lista.html?id=${list.id}#concluidas"><strong>${counts.concluidas}</strong> concluídas</a>
    </div>

    <p class="dashboard-list-card__desc">${esc(list.description || "")}</p>

    <a class="btn secondary" href="lista.html?id=${list.id}">VER LISTA</a>
  `;

  return artigo;
}

function prioClass(p) {
  if (p === "alta") return "badge--alta";
  if (p === "media") return "badge--media";
  return "badge--baixa";
}
function prioLabel(p = "baixa") {
  return p.charAt(0).toUpperCase() + p.slice(1);
}
function esc(s) {
  return String(s ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
