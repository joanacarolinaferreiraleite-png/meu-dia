const CHAVE_ATIVIDADES = "meuDiaAtividades";
const CHAVE_CONCLUIDAS = "meuDiaConcluidas";

const atividadesIniciais = [
  {
    id: "trabalho-segunda",
    nome: "Trabalho",
    tipo: "compromisso",
    dia: 1,
    inicio: "07:30",
    fim: "17:30",
    categoria: "Trabalho",
    recorrente: true
  },
  {
    id: "reuniao-banca",
    nome: "Reunião da banca eleitoral",
    tipo: "compromisso",
    data: "2026-09-14",
    inicio: "10:00",
    fim: "",
    categoria: "Reunião",
    recorrente: false
  },
  {
    id: "academia-segunda",
    nome: "Academia",
    tipo: "compromisso",
    dia: 1,
    inicio: "12:00",
    fim: "13:00",
    categoria: "Academia",
    recorrente: true
  },
  {
    id: "trabalho-terca",
    nome: "Trabalho",
    tipo: "compromisso",
    dia: 2,
    inicio: "07:30",
    fim: "17:30",
    categoria: "Trabalho",
    recorrente: true
  },
  {
    id: "academia-terca",
    nome: "Academia",
    tipo: "compromisso",
    dia: 2,
    inicio: "12:00",
    fim: "13:00",
    categoria: "Academia",
    recorrente: true
  },
  {
    id: "violao-terca",
    nome: "Aula de violão",
    tipo: "compromisso",
    dia: 2,
    inicio: "19:00",
    fim: "",
    categoria: "Aula",
    recorrente: true
  },
  {
    id: "trabalho-quarta",
    nome: "Trabalho",
    tipo: "compromisso",
    dia: 3,
    inicio: "07:30",
    fim: "17:30",
    categoria: "Trabalho",
    recorrente: true
  },
  {
    id: "tenis-quarta",
    nome: "Aula de tênis",
    tipo: "compromisso",
    dia: 3,
    inicio: "18:40",
    fim: "19:30",
    categoria: "Aula",
    recorrente: true
  },
  {
    id: "trabalho-quinta",
    nome: "Trabalho",
    tipo: "compromisso",
    dia: 4,
    inicio: "07:30",
    fim: "17:30",
    categoria: "Trabalho",
    recorrente: true
  },
  {
    id: "academia-quinta",
    nome: "Academia",
    tipo: "compromisso",
    dia: 4,
    inicio: "12:00",
    fim: "13:00",
    categoria: "Academia",
    recorrente: true
  },
  {
    id: "trabalho-sexta",
    nome: "Trabalho",
    tipo: "compromisso",
    dia: 5,
    inicio: "07:30",
    fim: "17:30",
    categoria: "Trabalho",
    recorrente: true
  },
  {
    id: "academia-sexta",
    nome: "Academia",
    tipo: "compromisso",
    dia: 5,
    inicio: "12:00",
    fim: "13:00",
    categoria: "Academia",
    recorrente: true
  },
  {
    id: "tenis-sexta",
    nome: "Aula de tênis",
    tipo: "compromisso",
    dia: 5,
    inicio: "18:40",
    fim: "19:30",
    categoria: "Aula",
    recorrente: true
  },
  {
    id: "ingles-sabado",
    nome: "Aula de inglês",
    tipo: "compromisso",
    dia: 6,
    inicio: "08:00",
    fim: "09:30",
    categoria: "Aula",
    recorrente: true
  },
  {
    id: "arrumar-violao",
    nome: "Arrumar violão",
    tipo: "pendencia",
    categoria: "Pendente",
    recorrente: false
  },
  {
    id: "vacina-chico",
    nome: "Vacina de Chico",
    tipo: "pendencia",
    categoria: "Pendente",
    recorrente: false
  }
];

let atividades = carregarAtividades();
let concluidas = carregarConcluidas();
let atividadeEmEdicao = null;

const hoje = new Date();
const diaAtual = hoje.getDay();
const dataAtual = formatarDataISO(hoje);

criarFormulario();
mostrarData();
mostrarProgramacao();

function carregarAtividades() {
  const dadosSalvos = localStorage.getItem(CHAVE_ATIVIDADES);

  if (dadosSalvos) {
    return JSON.parse(dadosSalvos);
  }

  localStorage.setItem(
    CHAVE_ATIVIDADES,
    JSON.stringify(atividadesIniciais)
  );

  return [...atividadesIniciais];
}

function carregarConcluidas() {
  return JSON.parse(
    localStorage.getItem(CHAVE_CONCLUIDAS)
  ) || {};
}

function salvarAtividades() {
  localStorage.setItem(
    CHAVE_ATIVIDADES,
    JSON.stringify(atividades)
  );
}

function salvarConcluidas() {
  localStorage.setItem(
    CHAVE_CONCLUIDAS,
    JSON.stringify(concluidas)
  );
}

function formatarDataISO(data) {
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const dia = String(data.getDate()).padStart(2, "0");

  return `${ano}-${mes}-${dia}`;
}

function mostrarData() {
  const nomeDaData = hoje.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long"
  });

  document.getElementById("data-atual").textContent = nomeDaData;
}

function selecionarAtividadesDeHoje() {
  return atividades.filter(function (atividade) {
    if (atividade.tipo === "pendencia") {
      return true;
    }

    if (atividade.recorrente) {
      return atividadeAconteceNoDia(
        atividade,
        diaAtual
      );
    }

    return atividade.data === dataAtual;
  });
}

function mostrarProgramacao() {
  const listaCompromissos = document.getElementById(
    "lista-compromissos"
  );

  const listaPendencias = document.getElementById(
    "lista-pendencias"
  );

  listaCompromissos.innerHTML = "";
  listaPendencias.innerHTML = "";

  const atividadesDeHoje = selecionarAtividadesDeHoje();

  const compromissos = atividadesDeHoje
    .filter(atividade => atividade.tipo === "compromisso")
    .sort((a, b) => a.inicio.localeCompare(b.inicio));

  const pendencias = atividadesDeHoje.filter(
    atividade => atividade.tipo === "pendencia"
  );

  document.getElementById(
    "quantidade-compromissos"
  ).textContent = compromissos.length;

  document.getElementById(
    "quantidade-pendencias"
  ).textContent = pendencias.length;

  if (compromissos.length === 0) {
    listaCompromissos.innerHTML = `
      <p class="lista-vazia">
        Nenhum compromisso para hoje.
      </p>
    `;
  }

  compromissos.forEach(function (atividade) {
    listaCompromissos.appendChild(criarItem(atividade));
  });

  if (pendencias.length === 0) {
    listaPendencias.innerHTML = `
      <p class="lista-vazia">
        Nenhuma pendência cadastrada.
      </p>
    `;
  }

  pendencias.forEach(function (atividade) {
    listaPendencias.appendChild(criarItem(atividade));
  });

  atualizarProgresso();
}

function criarItem(atividade) {
  const item = document.createElement("article");
  const chaveConclusao = obterChaveConclusao(atividade);

  item.className = "item";

  if (concluidas[chaveConclusao]) {
    item.classList.add("item-concluido");
  }

  const textoHorario =
    atividade.tipo === "pendencia"
      ? "Sem horário"
      : atividade.fim
        ? `${atividade.inicio} até ${atividade.fim}`
        : atividade.inicio;

  item.innerHTML = `
    <button
      class="botao-concluir"
      aria-label="Marcar atividade como concluída"
    >
      ✓
    </button>

    <div class="informacoes">
      <p class="nome-atividade">${escaparTexto(atividade.nome)}</p>
      <p class="horario">${textoHorario}</p>
    </div>

    <div class="acoes-item">
      <button class="botao-editar" title="Editar">✏️</button>
      <button class="botao-excluir" title="Excluir">🗑️</button>
    </div>
  `;

  item
    .querySelector(".botao-concluir")
    .addEventListener("click", function () {
      concluidas[chaveConclusao] = !concluidas[chaveConclusao];

      salvarConcluidas();
mostrarProgramacao();

if (telaPendencias) {
  mostrarPendencias();
}
    });

  item
    .querySelector(".botao-editar")
    .addEventListener("click", function () {
      abrirFormularioParaEditar(atividade);
    });

  item
    .querySelector(".botao-excluir")
    .addEventListener("click", function () {
      excluirAtividade(atividade);
    });

  return item;
}

function escaparTexto(texto) {
  const elemento = document.createElement("div");
  elemento.textContent = texto;
  return elemento.innerHTML;
}

function atualizarProgresso() {
  const atividadesDeHoje = selecionarAtividadesDeHoje();
  const total = atividadesDeHoje.length;

  const quantidadeConcluida = atividadesDeHoje.filter(
    atividade => concluidas[obterChaveConclusao(atividade)]
  ).length;

  const porcentagem =
    total === 0 ? 0 : (quantidadeConcluida / total) * 100;

  document.getElementById(
    "barra-progresso"
  ).style.width = `${porcentagem}%`;

  document.getElementById(
    "texto-progresso"
  ).textContent =
    `${quantidadeConcluida} de ${total} atividades concluídas`;

  document.getElementById(
    "mensagem-dia"
  ).textContent =
    total === 0
      ? "Seu dia está livre!"
      : "Veja sua programação de hoje";
}

function criarFormulario() {
  document.body.insertAdjacentHTML(
    "beforeend",
    `
      <button id="botao-adicionar" title="Adicionar atividade">
        +
      </button>

      <div id="fundo-modal" class="modal-escondido">
        <section class="modal">
          <div class="cabecalho-modal">
            <h2 id="titulo-modal">Nova atividade</h2>
            <button id="fechar-modal" type="button">✕</button>
          </div>

          <form id="formulario-atividade">
            <label>
              Nome da atividade
              <input
                id="campo-nome"
                type="text"
                placeholder="Ex.: Consulta médica"
                required
              >
            </label>

            <label>
              Tipo
              <select id="campo-tipo">
                <option value="compromisso">Compromisso com horário</option>
                <option value="pendencia">Pendência sem horário</option>
              </select>
            </label>

            <div id="campos-compromisso">
              <label>
                Repetição
                <select id="campo-repeticao">
                  <option value="semanal">Toda semana</option>
                  <option value="unica">Somente uma vez</option>
                </select>
              </label>

            <div id="grupo-dia-semana" class="grupo-dias-semana">
  <p class="rotulo-campo">Dias da semana</p>

  <label class="opcao-todos">
    <input id="campo-todos-dias" type="checkbox">
    Todos os dias
  </label>

  <div class="grade-dias">
    <label>
      <input
        type="checkbox"
        name="dias-semana"
        value="1"
      >
      Seg
    </label>

    <label>
      <input
        type="checkbox"
        name="dias-semana"
        value="2"
      >
      Ter
    </label>

    <label>
      <input
        type="checkbox"
        name="dias-semana"
        value="3"
      >
      Qua
    </label>

    <label>
      <input
        type="checkbox"
        name="dias-semana"
        value="4"
      >
      Qui
    </label>

    <label>
      <input
        type="checkbox"
        name="dias-semana"
        value="5"
      >
      Sex
    </label>

    <label>
      <input
        type="checkbox"
        name="dias-semana"
        value="6"
      >
      Sáb
    </label>

    <label>
      <input
        type="checkbox"
        name="dias-semana"
        value="0"
      >
      Dom
    </label>
  </div>
</div>
              </label>

              <label id="grupo-data" class="campo-escondido">
                Data
                <input id="campo-data" type="date">
              </label>

              <div class="linha-horarios">
                <label>
                  Início
                  <input id="campo-inicio" type="time">
                </label>

                <label>
                  Fim
                  <input id="campo-fim" type="time">
                </label>
              </div>

              <label>
                Categoria
                <select id="campo-categoria">
                  <option value="Trabalho">Trabalho</option>
                  <option value="Academia">Academia</option>
                  <option value="Aula">Aula</option>
                  <option value="Reunião">Reunião</option>
                  <option value="Outro">Outro</option>
                </select>
              </label>
            </div>

            <button class="botao-salvar" type="submit">
              Salvar atividade
            </button>
          </form>
        </section>
      </div>
    `
  );

  document
    .getElementById("botao-adicionar")
    .addEventListener("click", abrirFormularioNovo);

  document
    .getElementById("fechar-modal")
    .addEventListener("click", fecharFormulario);

  document
    .getElementById("campo-tipo")
    .addEventListener("change", atualizarCamposFormulario);

  document
    .getElementById("campo-repeticao")
    .addEventListener("change", atualizarCamposFormulario);
    const campoTodosOsDias = document.getElementById(
  "campo-todos-dias"
);

const camposDosDias = document.querySelectorAll(
  'input[name="dias-semana"]'
);

campoTodosOsDias.addEventListener("change", function () {
  camposDosDias.forEach(function (campo) {
    campo.checked = campoTodosOsDias.checked;
  });
});

camposDosDias.forEach(function (campo) {
  campo.addEventListener("change", function () {
    const todosMarcados = Array.from(
      camposDosDias
    ).every(item => item.checked);

    const algumMarcado = Array.from(
      camposDosDias
    ).some(item => item.checked);

    campoTodosOsDias.checked = todosMarcados;
    campoTodosOsDias.indeterminate =
      algumMarcado && !todosMarcados;
  });
});

  document
    .getElementById("formulario-atividade")
    .addEventListener("submit", salvarFormulario);

  document
    .getElementById("fundo-modal")
    .addEventListener("click", function (evento) {
      if (evento.target.id === "fundo-modal") {
        fecharFormulario();
      }
    });
}

function abrirFormularioNovo() {
  atividadeEmEdicao = null;

  document.getElementById(
    "titulo-modal"
  ).textContent = "Nova atividade";

  document.getElementById(
    "formulario-atividade"
  ).reset();

  document
  .querySelectorAll('input[name="dias-semana"]')
  .forEach(function (campo) {
    campo.checked = Number(campo.value) === diaAtual;
  });

document.getElementById(
  "campo-todos-dias"
).checked = false;

document.getElementById(
  "campo-todos-dias"
).indeterminate = false;
  document.getElementById("campo-data").value = dataAtual;

  atualizarCamposFormulario();

  document
    .getElementById("fundo-modal")
    .classList.remove("modal-escondido");
}

function abrirFormularioParaEditar(atividade) {
  atividadeEmEdicao = atividade.id;

  document.getElementById(
    "titulo-modal"
  ).textContent = "Editar atividade";

  document.getElementById("campo-nome").value = atividade.nome;
  document.getElementById("campo-tipo").value = atividade.tipo;

  if (atividade.tipo === "compromisso") {
    document.getElementById(
      "campo-repeticao"
    ).value = atividade.recorrente ? "semanal" : "unica";

   const diasDaAtividade = Array.isArray(atividade.dias)
  ? atividade.dias
  : [atividade.dia ?? diaAtual];

const camposDosDias = document.querySelectorAll(
  'input[name="dias-semana"]'
);

camposDosDias.forEach(function (campo) {
  campo.checked = diasDaAtividade.includes(
    Number(campo.value)
  );
});

const marcouTodos = Array.from(
  camposDosDias
).every(campo => campo.checked);

document.getElementById(
  "campo-todos-dias"
).checked = marcouTodos;

document.getElementById(
  "campo-todos-dias"
).indeterminate =
  diasDaAtividade.length > 1 && !marcouTodos;

    document.getElementById(
      "campo-data"
    ).value = atividade.data || dataAtual;

    document.getElementById(
      "campo-inicio"
    ).value = atividade.inicio || "";

    document.getElementById(
      "campo-fim"
    ).value = atividade.fim || "";

    document.getElementById(
      "campo-categoria"
    ).value = atividade.categoria || "Outro";
  }

  atualizarCamposFormulario();

  document
    .getElementById("fundo-modal")
    .classList.remove("modal-escondido");
}

function fecharFormulario() {
  document
    .getElementById("fundo-modal")
    .classList.add("modal-escondido");
}

function atualizarCamposFormulario() {
  const tipo = document.getElementById("campo-tipo").value;
  const repeticao = document.getElementById(
    "campo-repeticao"
  ).value;

  document.getElementById(
    "campos-compromisso"
  ).style.display =
    tipo === "compromisso" ? "block" : "none";

  document.getElementById(
    "grupo-dia-semana"
  ).classList.toggle(
    "campo-escondido",
    repeticao !== "semanal"
  );

  document.getElementById(
    "grupo-data"
  ).classList.toggle(
    "campo-escondido",
    repeticao === "semanal"
  );
}
function salvarFormulario(evento) {
  evento.preventDefault();

  const nome = document
    .getElementById("campo-nome")
    .value
    .trim();

  const tipo = document.getElementById("campo-tipo").value;

  if (!nome) {
    alert("Digite o nome da atividade.");
    return;
  }

  const indiceDaAtividade = atividades.findIndex(
    atividade => atividade.id === atividadeEmEdicao
  );

  const atividadeAnterior =
    indiceDaAtividade >= 0
      ? atividades[indiceDaAtividade]
      : {};

  const atividadeAtualizada = {
    ...atividadeAnterior,
    id: atividadeEmEdicao || `atividade-${Date.now()}`,
    nome,
    tipo
  };

  if (tipo === "pendencia") {
    atividadeAtualizada.categoria = "Pendente";
    atividadeAtualizada.recorrente = false;

    delete atividadeAtualizada.dia;
    delete atividadeAtualizada.data;
    delete atividadeAtualizada.inicio;
    delete atividadeAtualizada.fim;
  } else {
    const repeticao = document.getElementById(
      "campo-repeticao"
    ).value;

    const inicio = document.getElementById(
      "campo-inicio"
    ).value;

    const fim = document.getElementById(
      "campo-fim"
    ).value;

    if (!inicio) {
      alert("Informe o horário de início.");
      return;
    }

    atividadeAtualizada.inicio = inicio;
    atividadeAtualizada.fim = fim;
    atividadeAtualizada.categoria = document.getElementById(
      "campo-categoria"
    ).value;

    if (repeticao === "semanal") {
  const diasSelecionados = Array.from(
    document.querySelectorAll(
      'input[name="dias-semana"]:checked'
    )
  ).map(function (campo) {
    return Number(campo.value);
  });

  if (diasSelecionados.length === 0) {
    alert("Marque pelo menos um dia da semana.");
    return;
  }

  atividadeAtualizada.recorrente = true;
  atividadeAtualizada.dias = diasSelecionados;

  delete atividadeAtualizada.dia;
  
  delete atividadeAtualizada.data;
}else {
      const dataEscolhida = document.getElementById(
        "campo-data"
      ).value;

      if (!dataEscolhida) {
        alert("Escolha a data do compromisso.");
        return;
      }

      atividadeAtualizada.recorrente = false;
      atividadeAtualizada.data = dataEscolhida;

      delete atividadeAtualizada.dia;
    }
  }

  if (indiceDaAtividade >= 0) {
    atividades[indiceDaAtividade] = atividadeAtualizada;
  } else {
    atividades.push(atividadeAtualizada);
  }

  salvarAtividades();
  fecharFormulario();
  mostrarProgramacao();

  alert(
    indiceDaAtividade >= 0
      ? "Compromisso atualizado!"
      : "Atividade adicionada!"
  );

  atividadeEmEdicao = null;
}

function excluirAtividade(atividade) {
  const confirmou = confirm(
    `Deseja excluir “${atividade.nome}”?`
  );

  if (!confirmou) {
    return;
  }

  atividades = atividades.filter(
    item => item.id !== atividade.id
  );

  salvarAtividades();
mostrarProgramacao();

if (telaSemana) {
  mostrarSemana();
}

if (telaPendencias) {
  mostrarPendencias();
}
}
let elementosDaTelaHoje = [];
let telaSemana;
let telaPendencias;

configurarTelaSemana();

function configurarTelaSemana() {
  const aplicativo = document.querySelector(".aplicativo");
  const menu = document.querySelector(".menu-inferior");

  elementosDaTelaHoje = Array.from(
    document.querySelectorAll(
      ".aplicativo > .cartao-resumo, .aplicativo > section"
    )
  );

  telaSemana = document.createElement("section");
  telaSemana.id = "tela-semana";
  telaSemana.className = "tela-escondida";

  aplicativo.insertBefore(telaSemana, menu);
  telaPendencias = document.createElement("section");
telaPendencias.id = "tela-pendencias";
telaPendencias.className = "tela-escondida";

aplicativo.insertBefore(telaPendencias, menu);

  const botoesMenu = document.querySelectorAll(
    ".menu-inferior button"
  );

  botoesMenu.forEach(function (botao) {
    botao.addEventListener("click", function () {
      const telaEscolhida = botao.dataset.tela;

      botoesMenu.forEach(item => {
        item.classList.remove("menu-ativo");
      });

      botao.classList.add("menu-ativo");

      if (telaEscolhida === "semana") {
        abrirTelaSemana();
      } else if (telaEscolhida === "hoje") {
        abrirTelaHoje();
     } else if (telaEscolhida === "pendencias") {
  abrirTelaPendencias();
}
    });
  });

  document
    .getElementById("formulario-atividade")
    .addEventListener("submit", function () {
      setTimeout(mostrarSemana, 50);
    });
}

function abrirTelaHoje() {
  elementosDaTelaHoje.forEach(function (elemento) {
    elemento.style.display = "";
  });

  telaSemana.classList.add("tela-escondida");
  telaPendencias.classList.add("tela-escondida");

  document.querySelector(
    ".cabecalho h1"
  ).textContent = "Meu Dia";

  mostrarProgramacao();
}

function abrirTelaSemana() {
  elementosDaTelaHoje.forEach(function (elemento) {
    elemento.style.display = "none";
  });

  telaSemana.classList.remove("tela-escondida");
  telaPendencias.classList.add("tela-escondida");

  document.querySelector(
    ".cabecalho h1"
  ).textContent = "Minha Semana";

  mostrarSemana();
}

function mostrarSemana() {
  const dias = [
    { numero: 1, nome: "Segunda-feira", curto: "Seg" },
    { numero: 2, nome: "Terça-feira", curto: "Ter" },
    { numero: 3, nome: "Quarta-feira", curto: "Qua" },
    { numero: 4, nome: "Quinta-feira", curto: "Qui" },
    { numero: 5, nome: "Sexta-feira", curto: "Sex" },
    { numero: 6, nome: "Sábado", curto: "Sáb" },
    { numero: 0, nome: "Domingo", curto: "Dom" }
  ];

  const compromissosDaSemana = atividades.filter(
    function (atividade) {
      if (atividade.tipo !== "compromisso") {
        return false;
      }

      if (atividade.recorrente) {
        return true;
      }

      return dataEstaNaSemanaAtual(atividade.data);
    }
  );

  telaSemana.innerHTML = `
    <div class="resumo-semana">
      <h2>Resumo da semana</h2>
      <p>
       ${contarCompromissosDaSemana(compromissosDaSemana)}
        compromissos programados.
      </p>
    </div>

    <div class="calendario-container">
      <div
        id="calendario-semanal"
        class="calendario-semanal"
      ></div>

      <p class="legenda-calendario">
        Toque em uma data para ver os detalhes
      </p>
    </div>

    <div id="conteudo-semana"></div>
  `;

  const calendario = document.getElementById(
    "calendario-semanal"
  );

  const conteudo = document.getElementById(
    "conteudo-semana"
  );

  dias.forEach(function (dia) {
    const dataDoDia = obterDataDaSemana(dia.numero);
    const dataDoDiaISO = formatarDataISO(dataDoDia);

    const compromissosDoDia = compromissosDaSemana
      .filter(function (atividade) {
        if (atividade.recorrente) {
          return atividadeAconteceNoDia(
  atividade,
  dia.numero
);
        }

        return atividade.data === dataDoDiaISO;
      })
      .sort(function (a, b) {
        return a.inicio.localeCompare(b.inicio);
      });

    const botaoDia = document.createElement("button");

    botaoDia.className = "dia-calendario";
    botaoDia.type = "button";

    if (dataDoDiaISO === dataAtual) {
      botaoDia.classList.add("dia-calendario-hoje");
    }

    botaoDia.innerHTML = `
      <span class="nome-curto-dia">${dia.curto}</span>
      <span class="numero-data">${dataDoDia.getDate()}</span>
      <span class="quantidade-dia">
        ${compromissosDoDia.length}
      </span>
    `;

    botaoDia.addEventListener("click", function () {
      const destino = document.getElementById(
        `dia-semana-${dia.numero}`
      );

      destino.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

      destino.classList.add("dia-semana-destacado");

      setTimeout(function () {
        destino.classList.remove("dia-semana-destacado");
      }, 1300);
    });

    calendario.appendChild(botaoDia);

    const blocoDoDia = document.createElement("section");

    blocoDoDia.className = "dia-semana";
    blocoDoDia.id = `dia-semana-${dia.numero}`;

    const nomeDoMes = dataDoDia.toLocaleDateString(
      "pt-BR",
      {
        day: "2-digit",
        month: "long"
      }
    );

    blocoDoDia.innerHTML = `
      <div class="cabecalho-dia">
        <div>
          <h3>${dia.nome}</h3>
          <p class="detalhe-semana">${nomeDoMes}</p>
        </div>

        <span>${compromissosDoDia.length}</span>
      </div>
    `;

    if (compromissosDoDia.length === 0) {
      blocoDoDia.innerHTML += `
        <p class="dia-livre">
          Nenhum compromisso.
        </p>
      `;
    }

    compromissosDoDia.forEach(function (atividade) {
      blocoDoDia.appendChild(
        criarItemDaSemana(atividade)
      );
    });

    conteudo.appendChild(blocoDoDia);
  });
}

function obterDataDaSemana(numeroDoDia) {
  const segundaFeira = new Date(hoje);

  const ajusteParaSegunda =
    segundaFeira.getDay() === 0
      ? -6
      : 1 - segundaFeira.getDay();

  segundaFeira.setDate(
    segundaFeira.getDate() + ajusteParaSegunda
  );

  segundaFeira.setHours(12, 0, 0, 0);

  const quantidadeDeDias =
    numeroDoDia === 0
      ? 6
      : numeroDoDia - 1;

  const dataEscolhida = new Date(segundaFeira);

  dataEscolhida.setDate(
    segundaFeira.getDate() + quantidadeDeDias
  );

  return dataEscolhida;
}

function criarItemDaSemana(atividade) {
  const item = document.createElement("article");
  item.className = "item-semana";

  const horario = atividade.fim
    ? `${atividade.inicio}<br>${atividade.fim}`
    : atividade.inicio;

  item.innerHTML = `
    <div class="hora-semana">${horario}</div>

    <div>
      <p class="nome-semana">
        ${escaparTexto(atividade.nome)}
      </p>

      <p class="detalhe-semana">
        ${atividade.categoria}
      </p>
    </div>

    <div class="acoes-semana">
      <button class="editar-semana" title="Editar">
        ✏️
      </button>

      <button class="excluir-semana" title="Excluir">
        🗑️
      </button>
    </div>
  `;

  item
    .querySelector(".editar-semana")
    .addEventListener("click", function () {
      abrirFormularioParaEditar(atividade);
    });

  item
    .querySelector(".excluir-semana")
    .addEventListener("click", function () {
      const confirmou = confirm(
        `Deseja excluir “${atividade.nome}”?`
      );

      if (!confirmou) {
        return;
      }

      atividades = atividades.filter(
        item => item.id !== atividade.id
      );

      salvarAtividades();
      mostrarProgramacao();
      mostrarSemana();
    });

  return item;
}

function dataEstaNaSemanaAtual(dataInformada) {
  if (!dataInformada) {
    return false;
  }

  const data = new Date(`${dataInformada}T12:00:00`);
  const inicioDaSemana = new Date(hoje);

  const ajuste =
    inicioDaSemana.getDay() === 0
      ? -6
      : 1 - inicioDaSemana.getDay();

  inicioDaSemana.setDate(
    inicioDaSemana.getDate() + ajuste
  );

  inicioDaSemana.setHours(0, 0, 0, 0);

  const finalDaSemana = new Date(inicioDaSemana);
  finalDaSemana.setDate(finalDaSemana.getDate() + 6);
  finalDaSemana.setHours(23, 59, 59, 999);

  return data >= inicioDaSemana && data <= finalDaSemana;
}
function atividadeAconteceNoDia(
  atividade,
  numeroDoDia
) {
  const diaProcurado = Number(numeroDoDia);

  if (
    Array.isArray(atividade.dias) &&
    atividade.dias.length > 0
  ) {
    const diasConvertidos = atividade.dias.map(
      dia => Number(dia)
    );

    return diasConvertidos.includes(diaProcurado);
  }

  if (
    atividade.dia !== undefined &&
    atividade.dia !== null
  ) {
    return Number(atividade.dia) === diaProcurado;
  }

  return false;
}

function contarCompromissosDaSemana(lista) {
  return lista.reduce(function (total, atividade) {
    if (
      atividade.recorrente &&
      Array.isArray(atividade.dias)
    ) {
      return total + atividade.dias.length;
    }

    return total + 1;
  }, 0);
}

function obterChaveConclusao(atividade) {
  if (atividade.tipo === "pendencia") {
    return `pendencia-${atividade.id}`;
  }

  return `${atividade.id}-${dataAtual}`;
}

function abrirTelaPendencias() {
  elementosDaTelaHoje.forEach(function (elemento) {
    elemento.style.display = "none";
  });

  telaSemana.classList.add("tela-escondida");
  telaPendencias.classList.remove("tela-escondida");

  document.querySelector(
    ".cabecalho h1"
  ).textContent = "Minhas Pendências";

  mostrarPendencias();
}

function mostrarPendencias() {
  const todasAsPendencias = atividades.filter(
    atividade => atividade.tipo === "pendencia"
  );

  const pendentes = todasAsPendencias.filter(
    atividade => !concluidas[obterChaveConclusao(atividade)]
  );

  const finalizadas = todasAsPendencias.filter(
    atividade => concluidas[obterChaveConclusao(atividade)]
  );

  telaPendencias.innerHTML = `
    <div class="resumo-pendencias">
      <div>
        <span class="numero-resumo">${pendentes.length}</span>
        <p>A fazer</p>
      </div>

      <div>
        <span class="numero-resumo">${finalizadas.length}</span>
        <p>Concluídas</p>
      </div>
    </div>

    <div class="grupo-pendencias">
      <h2>A fazer</h2>
      <div id="pendencias-abertas" class="lista"></div>
    </div>

    <div class="grupo-pendencias">
      <h2>Concluídas</h2>
      <div id="pendencias-finalizadas" class="lista"></div>
    </div>
  `;

  const listaAbertas = document.getElementById(
    "pendencias-abertas"
  );

  const listaFinalizadas = document.getElementById(
    "pendencias-finalizadas"
  );

  if (pendentes.length === 0) {
    listaAbertas.innerHTML = `
      <p class="lista-vazia">
        Você não possui pendências.
      </p>
    `;
  }

  pendentes.forEach(function (atividade) {
    listaAbertas.appendChild(criarItem(atividade));
  });

  if (finalizadas.length === 0) {
    listaFinalizadas.innerHTML = `
      <p class="lista-vazia">
        Nenhuma pendência concluída.
      </p>
    `;
  }

  finalizadas.forEach(function (atividade) {
    listaFinalizadas.appendChild(criarItem(atividade));
  });
}