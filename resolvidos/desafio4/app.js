"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
let apiKey;
let requestToken;
let username;
let password;
let sessionId;
let listId;
const loginButton = document.getElementById("login-button");
const searchButton = document.getElementById("search-button");
const searchContainer = document.getElementById("search-container");
const criarButton = document.getElementById("criar-lista");
loginButton === null || loginButton === void 0 ? void 0 : loginButton.addEventListener("click", () => __awaiter(void 0, void 0, void 0, function* () {
    yield criarRequestToken();
    yield logar();
    yield criarSessao();
    esconderLoginEMostrarUsuario();
}));
searchButton === null || searchButton === void 0 ? void 0 : searchButton.addEventListener("click", () => __awaiter(void 0, void 0, void 0, function* () {
    let lista = document.getElementById("lista");
    if (lista) {
        lista.outerHTML = "";
    }
    let search = document.getElementById("search");
    let query = search.value;
    let listaDeFilmes = yield procurarFilme(query);
    let listaSection = document.getElementById("search-result");
    listaSection.innerHTML = "";
    for (const item of listaDeFilmes.results) {
        let filme = new Filme(item.title, item.description, item.poster_path, item.id);
        listaSection.innerHTML += criarDomFilme(item);
    }
    console.log(listaDeFilmes);
}));
criarButton === null || criarButton === void 0 ? void 0 : criarButton.addEventListener("click", () => __awaiter(void 0, void 0, void 0, function* () {
    yield criarLista();
}));
function preencherSenha() {
    let input = document.getElementById("senha");
    password = input === null || input === void 0 ? void 0 : input.value;
    validateLoginButton();
}
function preencherLogin() {
    let input = document.getElementById("login");
    username = input === null || input === void 0 ? void 0 : input.value;
    validateLoginButton();
}
function preencherApi() {
    let input = document.getElementById("api-key");
    apiKey = input === null || input === void 0 ? void 0 : input.value;
    validateLoginButton();
}
function validateLoginButton() {
    if (password && username && apiKey) {
        loginButton.disabled = false;
    }
    else {
        loginButton.disabled = true;
    }
}
class HttpClient {
    static get({ url, method, body }) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                let request = new XMLHttpRequest();
                request.open(method, url, true);
                request.onload = () => {
                    if (request.status >= 200 && request.status < 300) {
                        resolve(JSON.parse(request.responseText));
                    }
                    else {
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
                    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                    body = JSON.stringify(body);
                }
                request.send(body);
            });
        });
    }
}
function procurarFilme(query) {
    return __awaiter(this, void 0, void 0, function* () {
        query = encodeURI(query);
        console.log(query);
        let result = yield HttpClient.get({
            url: `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}`,
            method: "GET",
        });
        return JSON.parse(JSON.stringify(result));
    });
}
function adicionarFilme(filmeId) {
    return __awaiter(this, void 0, void 0, function* () {
        let result = yield HttpClient.get({
            url: `https://api.themoviedb.org/3/movie/${filmeId}?api_key=${apiKey}&language=pt-BR`,
            method: "GET",
        });
        console.log(result);
    });
}
function criarRequestToken() {
    return __awaiter(this, void 0, void 0, function* () {
        let result = yield HttpClient.get({
            url: `https://api.themoviedb.org/3/authentication/token/new?api_key=${apiKey}`,
            method: "GET",
        });
        let response = JSON.parse(JSON.stringify(result));
        requestToken = response.request_token;
    });
}
function logar() {
    return __awaiter(this, void 0, void 0, function* () {
        yield HttpClient.get({
            url: `https://api.themoviedb.org/3/authentication/token/validate_with_login?api_key=${apiKey}`,
            method: "POST",
            body: {
                username: `${username}`,
                password: `${password}`,
                request_token: `${requestToken}`,
            },
        });
    });
}
function criarSessao() {
    return __awaiter(this, void 0, void 0, function* () {
        let result = yield HttpClient.get({
            url: `https://api.themoviedb.org/3/authentication/session/new?api_key=${apiKey}&request_token=${requestToken}`,
            method: "GET",
        });
        let response = JSON.parse(JSON.stringify(result));
        sessionId = response.session_id;
    });
}
function criarLista() {
    return __awaiter(this, void 0, void 0, function* () {
        let nomeDaLista = document.getElementById("lista-nome")
            .value;
        let descricao = document.getElementById("lista-descricao").value;
        let result = yield HttpClient.get({
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
        document.getElementById("listas").innerHTML +=
            criarDomLista(lista);
    });
}
function adicionarFilmeNaLista(filmeId, listaId) {
    return __awaiter(this, void 0, void 0, function* () {
        let result = yield HttpClient.get({
            url: `https://api.themoviedb.org/3/list/${listaId}/add_item?api_key=${apiKey}&session_id=${sessionId}`,
            method: "POST",
            body: {
                media_id: filmeId,
            },
        });
        console.log(result);
    });
}
function pegarLista() {
    return __awaiter(this, void 0, void 0, function* () {
        let result = yield HttpClient.get({
            url: `https://api.themoviedb.org/3/list/${listId}?api_key=${apiKey}`,
            method: "GET",
        });
        console.log(result);
    });
}
class Lista {
    constructor(nome, descricao, id) {
        this.nome = nome;
        this.descricao = descricao;
        this.id = id;
    }
}
class Filme {
    constructor(title, description, poster_path, id) {
        this.title = title;
        this.description = description;
        this.poster_path = poster_path;
        this.id = id;
    }
}
function criarDomLista(lista) {
    return `<div class="lista-item">
  <input type="radio" value="${lista.id}">
  <label for="${lista.id}">${lista.nome}</label>
  <button onclick="apagarLista(this.value)" value="${lista.id}">X</button>
</div>`;
}
function criarDomFilme(filme) {
    return `<article class="filme-box">
  <img src="${criarUrlImage(filme.poster_path)}">
  <p>${filme.title}</p>
  </article>`;
}
function criarUrlImage(path) {
    return `https://image.tmdb.org/t/p/w500/${path}`;
}
function esconderLoginEMostrarUsuario() {
    let loginBox = document.getElementById("login-box");
    let childrens = loginBox.childNodes;
    for (let i = 0; i < childrens.length; i++) {
        let element = childrens[i];
        element.classList.toggle("disable");
    }
}
