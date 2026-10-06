# Cadastro de Alunos — CRUD com JSON Server

Projeto de exemplo que mostra como fazer um **CRUD completo** (criar, listar, editar e excluir) usando só **HTML, CSS e JavaScript puro** no front-end e o **[JSON Server](https://github.com/typicode/json-server)** como uma API REST falsa, gerada a partir de um arquivo `db.json`.

A ideia é praticar `fetch` e os métodos HTTP (`GET`, `POST`, `PATCH`, `DELETE`) sem precisar escrever um back-end de verdade.

## Funcionalidades

- Listar todos os alunos cadastrados
- Adicionar um aluno novo (nome e curso)
- Editar um aluno existente
- Excluir um aluno (com confirmação)
- Mensagem de erro na tela quando o JSON Server não está rodando

## Estrutura do projeto

```
Projeto JSON Server - Cadastro de alunos/
├── db.json            # "Banco de dados" lido e alterado pelo JSON Server
└── public/
    ├── index.html     # Página com o formulário e a lista
    ├── script.js      # Lógica do CRUD com fetch
    └── style.css      # Estilos da página
```

## Pré-requisitos

- [Node.js](https://nodejs.org/) **22.12 ou superior** (exigido pela versão atual do JSON Server)

Para conferir a versão instalada:

```bash
node -v
```

## Como rodar

1. Abra o terminal na pasta do projeto (onde está o `db.json`).
2. Suba o JSON Server na porta **3001**:

   ```bash
   npx json-server db.json --port 3001
   ```

3. Abra no navegador: **http://localhost:3001**

O JSON Server já serve automaticamente os arquivos da pasta `public/`, então a página e a API ficam no mesmo endereço. Para parar o servidor, use `Ctrl + C` no terminal.

> **Por que a porta 3001?** O `script.js` aponta para `http://localhost:3001/alunos`. Se quiser usar outra porta, altere a constante `API_URL` no início do `script.js` também.

## Endpoints da API

O JSON Server cria as rotas a partir das chaves do `db.json`. Como o arquivo tem a chave `alunos`, temos:

| Método   | Rota            | O que faz                   | Usado em            |
|----------|-----------------|-----------------------------|---------------------|
| `GET`    | `/alunos`       | Lista todos os alunos       | `carregarAlunos()`  |
| `GET`    | `/alunos/:id`   | Busca um aluno pelo id      | —                   |
| `POST`   | `/alunos`       | Cria um aluno novo          | `criarAluno()`      |
| `PATCH`  | `/alunos/:id`   | Altera campos de um aluno   | `atualizarAluno()`  |
| `DELETE` | `/alunos/:id`   | Remove um aluno             | `excluirAluno()`    |

Exemplo de aluno salvo no `db.json`:

```json
{
  "id": "3",
  "nome": "Carla Mendes",
  "curso": "Mobile"
}
```

O `id` é gerado automaticamente pelo JSON Server ao criar um registro novo, então não é preciso enviá-lo no `POST`.

## Como o código funciona

- Ao abrir a página, `carregarAlunos()` faz um `GET` e monta a lista.
- O mesmo formulário serve para **criar** e **editar**: existe um campo escondido (`aluno-id`). Se ele estiver vazio, o envio faz um `POST`; se tiver um id, faz um `PATCH`.
- Ao clicar em **Editar**, os dados do aluno vão para o formulário e o botão muda para **Salvar**. O botão **Cancelar** limpa o formulário.
- Depois de qualquer alteração, a lista é recarregada para refletir o que está no `db.json`.

## Observações

- Todas as alterações feitas pela página são gravadas diretamente no `db.json`. Se quiser voltar ao estado inicial, guarde uma cópia do arquivo antes de testar.
- A chave `$schema` no `db.json` é adicionada pelo próprio JSON Server e pode ser ignorada.
- O JSON Server é feito para estudo e protótipos, não para produção.

## Tecnologias

- HTML5, CSS3 e JavaScript (ES6+)
- Fetch API
- JSON Server
