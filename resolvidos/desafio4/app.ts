let apiKey: string;
let requestToken: string;
let username: string;
let password: string;
let sessionId: string;
let listId: number;

const loginButton = document.getElementById(
  "login-button"
) as HTMLButtonElement;
const searchButton = document.getElementById(
  "search-button"
) as HTMLButtonElement;
const searchContainer = document.getElementById(
  "search-container"
) as HTMLDivElement;
const criarButton = document.getElementById("criar-lista") as HTMLButtonElement;

loginButton?.addEventListener("click", async () => {
  await criarRequestToken();
  await logar();
  await criarSessao();
  esconderLoginEMostrarUsuario();
});

searchButton?.addEventListener("click", async () => {
  let lista = document.getElementById("lista");
  if (lista) {
    lista.outerHTML = "";
  }
  let search = document.getElementById("search") as HTMLInputElement;
  let query = search.value;
  let listaDeFilmes = await procurarFilme(query);
  let listaSection = document.getElementById("search-result") as HTMLElement;
  listaSection.innerHTML = "";
  for (const item of listaDeFilmes.results) {
    let filme = new Filme(item.title, item.description, item.poster_path, item.id);
    listaSection.innerHTML += criarDomFilme(item);
  }
  console.log(listaDeFilmes);
});

criarButton?.addEventListener("click", async () => {
  await criarLista();
});

function preencherSenha() {
  let input = document.getElementById("senha") as HTMLInputElement;
  password = input?.value;
  validateLoginButton();
}

function preencherLogin() {
  let input = document.getElementById("login") as HTMLInputElement;
  username = input?.value;
  validateLoginButton();
}

function preencherApi() {
  let input = document.getElementById("api-key") as HTMLInputElement;
  apiKey = input?.value;
  validateLoginButton();
}

function validateLoginButton() {
  if (password && username && apiKey) {
    loginButton.disabled = false;
  } else {
    loginButton.disabled = true;
  }
}

class HttpClient {
  static async get({ url, method, body }: any) {
    return new Promise((resolve, reject) => {
      let request = new XMLHttpRequest();
      request.open(method, url, true);

      request.onload = () => {
        if (request.status >= 200 && request.status < 300) {
          resolve(JSON.parse(request.responseText));
        } else {
          reject({
            status: request.status,
            statusText: request.statusText,
          });
        }
      };
      request.onerror = () => {
        reject({
          status: request.status,
          statusText: request.statusText,
        });
      };

      if (body) {
        request.setRequestHeader(
          "Content-Type",
          "application/json;charset=UTF-8"
        );
        body = JSON.stringify(body);
      }
      request.send(body);
    });
  }
}

async function procurarFilme(query: string) {
  query = encodeURI(query);
  console.log(query);
  let result = await HttpClient.get({
    url: `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}`,
    method: "GET",
  });
  return JSON.parse(JSON.stringify(result));
}

async function adicionarFilme(filmeId: number) {
  let result = await HttpClient.get({
    url: `https://api.themoviedb.org/3/movie/${filmeId}?api_key=${apiKey}&language=pt-BR`,
    method: "GET",
  });
  console.log(result);
}

async function criarRequestToken() {
  let result = await HttpClient.get({
    url: `https://api.themoviedb.org/3/authentication/token/new?api_key=${apiKey}`,
    method: "GET",
  });
  let response = JSON.parse(JSON.stringify(result));
  requestToken = response.request_token;
}

async function logar() {
  await HttpClient.get({
    url: `https://api.themoviedb.org/3/authentication/token/validate_with_login?api_key=${apiKey}`,
    method: "POST",
    body: {
      username: `${username}`,
      password: `${password}`,
      request_token: `${requestToken}`,
    },
  });
}

async function criarSessao() {
  let result = await HttpClient.get({
    url: `https://api.themoviedb.org/3/authentication/session/new?api_key=${apiKey}&request_token=${requestToken}`,
    method: "GET",
  });

  let response = JSON.parse(JSON.stringify(result));
  sessionId = response.session_id;
}

async function criarLista() {
  let nomeDaListaElement = document.getElementById("lista-nome") as HTMLInputElement;
  let nomeDaLista = nomeDaListaElement.value;
  let descricaoElement = document.getElementById("lista-descricao") as HTMLInputElement;
  let descricao = descricaoElement.value;

  let result = await HttpClient.get({
    url: `https://api.themoviedb.org/3/list?api_key=${apiKey}&session_id=${sessionId}`,
    method: "POST",
    body: {
      name: nomeDaLista,
      description: descricao,
      language: "pt-br",
    },
  });
  let response = JSON.parse(JSON.stringify(result));
  let lista = new Lista(nomeDaLista, descricao, response.id);
  let listaContainer = document.getElementById("lista-result") as HTMLElement;
  listaContainer.innerHTML += criarDomLista(lista);
}

async function adicionarFilmeNaLista(filmeId: number, listaId: number) {
  let result = await HttpClient.get({
    url: `https://api.themoviedb.org/3/list/${listaId}/add_item?api_key=${apiKey}&session_id=${sessionId}`,
    method: "POST",
    body: {
      media_id: filmeId,
    },
  });
  console.log(result);
}

async function pegarLista() {
  let result = await HttpClient.get({
    url: `https://api.themoviedb.org/3/list/${listId}?api_key=${apiKey}`,
    method: "GET",
  });
  console.log(result);
}

class Lista {
  nome: string;
  descricao: string;
  id: number;

  constructor(nome: string, descricao: string, id: number) {
    this.nome = nome;
    this.descricao = descricao;
    this.id = id;
  }
}

class Filme {
  title: string;
  description: string;
  poster_path: string;
  id: number;
  constructor(title: string, description: string, poster_path: string, id: number) {
    this.title = title;
    this.description = description;
    this.poster_path = poster_path;
    this.id = id;
  }
}

function criarDomLista(lista: Lista) {
  return `<div class="lista-item">
  <input type="radio" value="${lista.id}">
  <label for="${lista.id}">${lista.nome}</label>
  <button onclick="apagarLista(this.value)" value="${lista.id}">X</button>
</div>`;
}

function criarDomFilme(filme: Filme) {
  return `<article class="filme-box">
  <img src="${criarUrlImage(filme.poster_path)}">
  <p>${filme.title}</p>
  </article>`;
}

function criarUrlImage(path: string) {
  return `https://image.tmdb.org/t/p/w500/${path}`;
}

function esconderLoginEMostrarUsuario() {
  let inputUserName = document.getElementById('login') as HTMLElement;
  let inputPassword = document.getElementById('senha') as HTMLElement;
  let inputApiKey = document.getElementById('api-key') as HTMLElement;
  let textUserName = document.getElementById('username') as HTMLParagraphElement;

  inputPassword.classList.toggle('disable');
  inputUserName.classList.toggle('disable');
  inputApiKey.classList.toggle('disable');
  loginButton.classList.toggle('disable');
  textUserName.classList.toggle('disable');

  textUserName.textContent = username;
}
