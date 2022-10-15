const url = "https://jsonplaceholder.typicode.com/posts";

const loadingElement = document.getElementById("loading");
const postsContainer = document.getElementById("posts-container");

const postPage = document.getElementById("post");
const postContainer = document.getElementById("post-container");
const commentsContainer = document.getElementById("comments-container");

const commentForm = document.getElementById("comment-form");
const emailInput = document.getElementById("email");
const bodyInput = document.getElementById("body");

// pegando id da url.

// acessando os parametros que estão na URL.
const urlSearchParams = new URLSearchParams(window.location.search);
const postId = urlSearchParams.get("id");
// console.log(postId);

// pegar todos os posts
async function getAllPosts() {
  const response = await fetch(url);
  // console.log(response);

  // recebendo a resposta e transformando em um array de objetos (json)
  const data = await response.json();
  console.log(data);

  loadingElement.classList.add("hide");

  // iterando nos dados do json
  data.map((post) => {
    // criando elementos que irão apresentar na tela.
    const div = document.createElement("div");
    const title = document.createElement("h2");
    const body = document.createElement("p");
    const link = document.createElement("a");

    // adicionando os dados ao elemento.
    title.innerText = post.title;
    body.innerText = post.body;
    link.innerText = "Ler";
    link.setAttribute("href", `/post.html?id=${post.id}`);

    // adicionando elementos na div de cada post
    div.appendChild(title);
    div.appendChild(body);
    div.appendChild(link);

    // adicionando div do post na div principal
    postsContainer.appendChild(div);
  });
}

// pegando os posts individualmente

async function getPost(id) {
  // executando as duas requests ao mesmo tempo.
  const [responsePost, responseComments] = await Promise.all([
    fetch(`${url}/${id}`),
    fetch(`${url}/${id}/comments`),
  ]);

  // extraindo os dados em array de objetos
  const dataPost = await responsePost.json();
  const dataComments = await responseComments.json();

  loadingElement.classList.add("hide");
  postPage.classList.remove("hide");

  // preenchendo conteúdos
  const title = document.createElement("h1");
  const body = document.createElement("p");

  title.innerText = dataPost.title;
  body.innerText = dataPost.body;

  postContainer.appendChild(title);
  postContainer.appendChild(body);

  // iterando em cada comentário do post e apresentando na div.
  dataComments.map((comment) => {
    createComment(comment);
  });
}

// criar comentário e adicionar ao array
function createComment(comment) {
  // criando elementos do comentário
  const div = document.createElement("div");
  const email = document.createElement("h3");
  const commentBody = document.createElement("p");

  // adicionando os dados do comentário aos elementos.
  email.innerText = comment.email;
  commentBody.innerText = comment.body;

  div.appendChild(email);
  div.appendChild(commentBody);

  // adicionando dados na div principal dos comentários.
  commentsContainer.appendChild(div);
}

// postar um comentário

async function postComment(comment) {
  // definindo headers do POST.
  const response = await fetch(`${url}/${postId}/comments`, {
    method: "POST",
    body: comment,
    headers: {
      "Content-type": "application/json",
    },
  });

  const data = await response.json();

  // criando e adicionando novo comentário.
  createComment(data);
}

if (postId) {
  getPost(postId);

  // adicionar evento do formulário de comentário.
  commentForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // montando novo comentário
    let comment = {
      email: emailInput.value,
      body: bodyInput.value,
    };

    comment = JSON.stringify(comment);
    postComment(comment);

    emailInput.value = "";
    bodyInput.value = "";
  });
} else {
  getAllPosts();
}
