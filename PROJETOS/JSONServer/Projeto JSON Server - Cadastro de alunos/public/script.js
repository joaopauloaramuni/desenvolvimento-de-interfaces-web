// Endereço da "API" criada pelo JSON Server a partir do db.json
const API_URL = "http://localhost:3001/alunos";
 
const form = document.getElementById("form-aluno");
const inputId = document.getElementById("aluno-id");
const inputNome = document.getElementById("nome");
const inputCurso = document.getElementById("curso");
const btnSalvar = document.getElementById("btn-salvar");
const btnCancelar = document.getElementById("btn-cancelar");
const lista = document.getElementById("lista-alunos");
 
// READ (GET) - busca todos os alunos e mostra na tela
async function carregarAlunos() {
  try {
    const resposta = await fetch(API_URL);
    const alunos = await resposta.json();
 
    lista.innerHTML = "";
    alunos.forEach((aluno) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <span>
          <strong>${aluno.nome}</strong>
          <small>${aluno.curso}</small>
        </span>
        <div class="acoes">
          <button class="editar">Editar</button>
          <button class="excluir">Excluir</button>
        </div>
      `;
      li.querySelector(".editar").addEventListener("click", () => prepararEdicao(aluno));
      li.querySelector(".excluir").addEventListener("click", () => excluirAluno(aluno.id));
      lista.appendChild(li);
    });
  } catch (erro) {
    lista.innerHTML = `<li class="erro">Não foi possível conectar. O JSON Server está rodando?</li>`;
    console.error(erro);
  }
}
 
// CREATE (POST) - envia um aluno novo
async function criarAluno(aluno) {
  await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(aluno),
  });
}
 
// UPDATE (PATCH) - altera um aluno existente
async function atualizarAluno(id, aluno) {
  await fetch(`${API_URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(aluno),
  });
}
 
// DELETE - remove um aluno
async function excluirAluno(id) {
  if (!confirm("Deseja excluir este aluno?")) return;
  await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  carregarAlunos();
}
 
// Coloca os dados do aluno no formulário para editar
function prepararEdicao(aluno) {
  inputId.value = aluno.id;
  inputNome.value = aluno.nome;
  inputCurso.value = aluno.curso;
  btnSalvar.textContent = "Salvar";
  btnCancelar.hidden = false;
}
 
function limparFormulario() {
  form.reset();
  inputId.value = "";
  btnSalvar.textContent = "Adicionar";
  btnCancelar.hidden = true;
}
 
// Quando o formulário é enviado: cria ou atualiza
form.addEventListener("submit", async (evento) => {
  evento.preventDefault(); // impede a página de recarregar
 
  const aluno = {
    nome: inputNome.value.trim(),
    curso: inputCurso.value.trim(),
  };
 
  if (inputId.value) {
    await atualizarAluno(inputId.value, aluno);
  } else {
    await criarAluno(aluno);
  }
 
  limparFormulario();
  carregarAlunos();
});
 
btnCancelar.addEventListener("click", limparFormulario);
 
// Carrega a lista assim que a página abre
carregarAlunos();
