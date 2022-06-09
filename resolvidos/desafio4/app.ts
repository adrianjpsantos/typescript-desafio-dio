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

loginButton?.addEventListener("click", async () => {
  await criarRequestToken();
  await logar();
  await criarSessao();
});

searchButton?.addEventListener("click", async () => {
  let lista = document.getElementById("lista");
  if (lista) {
    lista.outerHTML = "";
  }
  let search = document.getElementById("search") as HTMLInputElement;
  let query = search.value;
  let listaDeFilmes = await procurarFilme(query);
  let ul = document.createElement("ul");
  ul.id = "lista";
  for (const item of listaDeFilmes.results) {
    let li = document.createElement("li");
    li.appendChild(document.createTextNode(item.title));
    ul.appendChild(li);
  }
  console.log(listaDeFilmes);
  searchContainer.appendChild(ul);
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

async function criarLista(nomeDaLista: string, descricao: string) {
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

  (document.getElementById('listas') as HTMLElement).innerHTML += criarDomLista(lista);
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

class Lista{
  nome: string;
  descricao: string;
  id: number;
  
  constructor(nome: string,descricao:string,id:number) {
    this.nome = nome;
    this.descricao = descricao;
    this.id = id;
  }
}

function criarDomLista(lista:Lista) {
  return `<div class="lista-item">
  <input type="radio" value="${lista.id}">
  <label for="${lista.id}">${lista.nome}</label>
  <button onclick="apagarLista(this.value)" value="${lista.id}">X</button>
</div>`;
}

