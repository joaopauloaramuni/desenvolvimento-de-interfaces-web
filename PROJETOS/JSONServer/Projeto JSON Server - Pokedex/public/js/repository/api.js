import { API_TIMEOUT, API_URL } from "../config/appConfig.js";

/** Erro de uma chamada ao json-server. status = 0 quando o servidor nem respondeu. */
export class ApiError extends Error {
  constructor(mensagem, status = 0) {
    super(mensagem);
    this.name = "ApiError";
    this.status = status;
  }
}

/**
 * fetch() para o json-server: monta a URL, envia/recebe JSON, aplica um tempo
 * máximo de espera e transforma qualquer falha em ApiError com mensagem em português.
 */
export async function api(caminho, { method = "GET", body } = {}) {
  const controle = new AbortController();
  const timer = setTimeout(() => controle.abort(), API_TIMEOUT);

  let resposta;
  try {
    resposta = await fetch(`${API_URL}${caminho}`, {
      method,
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
      signal: controle.signal,
    });
  } catch (e) {
    const motivo = e.name === "AbortError" ? "o json-server demorou para responder" : "o json-server não respondeu";
    throw new ApiError(`Sem conexão com ${API_URL}: ${motivo}. Ele está rodando (npm start)?`);
  } finally {
    clearTimeout(timer);
  }

  if (!resposta.ok) {
    throw new ApiError(`O json-server respondeu ${resposta.status} em ${method} ${caminho}.`, resposta.status);
  }

  // DELETE no json-server devolve {} (ou nada): sem corpo, devolve null.
  const texto = await resposta.text();
  return texto ? JSON.parse(texto) : null;
}
