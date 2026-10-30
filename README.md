<!-- course-navigation:start -->
<p>
  <a href="https://github.com/MatheusBenvindo/MatheusBenvindo/blob/main/CURSOS.md#projetos"><img alt="Índice de materiais" src="https://img.shields.io/badge/MATERIAIS-Projetos-005DAA?style=flat-square" /></a>
</p>

[← Catálogo de cursos e projetos](https://github.com/MatheusBenvindo/MatheusBenvindo/blob/main/CURSOS.md) · [Perfil](https://github.com/MatheusBenvindo)

<!-- course-navigation:end -->

# BankFlow Queue System

Sistema de gestão de filas projetado para operação local em agência, com foco em custo total de propriedade, continuidade de atendimento e inteligência operacional.

## O Problema

Em ambiente real, o contrato de sistema de senhas alugado custava em torno de `R$ 6.000/ano` e entregava pouco para a rotina da agência:

1. Dependência de fornecedor para qualquer ajuste.
2. Baixa visibilidade gerencial sobre produtividade e gargalos.
3. Segurança inconsistente por exposição desnecessária de dados fora da rede local.

O BankFlow foi desenhado para inverter essa conta: trocar despesa recorrente por infraestrutura própria com previsibilidade técnica e financeira.

## Economia e Retorno

Modelo alvo do projeto:

1. Investimento único em totem e setup local.
2. Payback estimado em `12 meses`.
3. Licenciamento recorrente zerado após implantação.

Resultado prático: redução de custo anual, mais controle sobre o ambiente e maior autonomia para evolução.

## Funcionalidades e Possibilidades do Projeto

O BankFlow opera como um ecossistema integrado. Cada módulo atende uma etapa do fluxo da agência.

1. Totem de autoatendimento.
2. Painel TV para chamadas públicas em tempo real.
3. Painel do atendente em desktop nativo com WebView2.
4. Painel do atendente via navegador para contingência.
5. Painel administrativo para gestão operacional, configuração de videos/pagina totem tv (com opção de incluir api de noticias ou de não usar as mesmas, podendo escolher na configuração e garantindo uma pré visualização ao administrador, com opção de colocar mais de 1 video diretamente pelo painel de gerenciamento), configuração da plataforma.
6. Módulo de BI para acompanhamento de desempenho.
7. Camada de segurança para autenticação e proteção de integrações.

## Destaque Técnico: Barra Flutuante no Desktop (WebView2)

O operador não precisa ficar preso a uma aba do navegador.

1. A barra flutuante fica disponível no desktop durante as demais rotinas do caixa.
2. O alerta de demanda é entregue por `Windows Toast` quando entra nova senha na fila.
3. O fluxo reduz troca de contexto e evita chamadas perdidas por distração de interface.
4. Em estações legadas, o painel web assume o mesmo ciclo operacional.

## BI Estratégico para Gestores

O BI foi desenhado para operação, não para relatório estático.

1. Ranking de performance por atendente/guichê.
2. Volumetria por faixa horária para leitura de picos.
3. Visão de gargalos em tempo real para ajuste de escala.
4. Histórico para apoiar decisão de equipe e horário.

## Robustez de Infraestrutura

![Totem e infraestrutura local](IMAGENS%20LINKEDIN-README/Captura%20de%20tela%202026-03-06%20223454.png)

Arquitetura orientada a ambiente local:

1. API e painel administrativo na mesma rede corporativa.
2. Comunicação em tempo real via SignalR.
3. Persistência local com SQLite + EF Core.
4. Separação de camadas para operação, gestão e visualização.

## Curadoria de Imagens

Uso recomendado no repositorio publico (README):

1. `IMAGENS LINKEDIN-README/Captura de tela 2026-03-06 225333.png` para status/saude da operacao.
2. `IMAGENS LINKEDIN-README/Captura de tela 2026-03-06 223454.png` para totem e robustez da infraestrutura.

![Status e saude da operacao](IMAGENS%20LINKEDIN-README/Captura%20de%20tela%202026-03-06%20225333.png)

Uso recomendado no post de LinkedIn:

1. `IMAGENS LINKEDIN-README/Captura de tela 2026-03-06 223528.png` como capa de impacto (Painel TV).
2. `IMAGENS LINKEDIN-README/Captura de tela 2026-03-06 230403.png` como evidencia de BI e decisao gerencial.

![Painel TV - capa de impacto](IMAGENS%20LINKEDIN-README/Captura%20de%20tela%202026-03-06%20223528.png)

![BI e decisao gerencial](IMAGENS%20LINKEDIN-README/Captura%20de%20tela%202026-03-06%20230403.png)

Acervo adicional do fluxo operacional:

1. `IMAGENS LINKEDIN-README/Captura de tela 2026-03-07 170023.png` para notificacao Toast no desktop.

![Notificacao Toast no desktop](IMAGENS%20LINKEDIN-README/Captura%20de%20tela%202026-03-07%20170023.png)

## Tabela de Comparacao: Custo x Personalizacao x Seguranca

| Criterio | Solucao Alugada | BankFlow Queue System |
|---|---|---|
| Custo anual | ~R$ 6.000/ano | R$ 0 de licenca recorrente |
| Modelo financeiro | Opex continuo | Capex com payback de 12 meses |
| Personalizacao | Limitada ao fornecedor | Ajustes conforme operacao local |
| Controle de dados | Dependente de terceiros | Dados sob governanca da empresa |
| Evolucao tecnica | Roadmap externo | Evolucao interna orientada ao negocio |

## Stack Tecnica

1. `.NET 9` com ASP.NET Core.
2. `SignalR` para eventos em tempo real.
3. `WebView2` para experiencia desktop nativa.
4. `SQLite` + `Entity Framework Core` para persistencia resiliente.

## Repositorio e Demo

1. Este repositorio publico (`bankflow-system`) e uma vitrine tecnica e de negocio.
2. O codigo-fonte funcional do backend (`.cs`, `.sln`, regras internas) permanece no repositorio privado.
3. `demo_simulada`: simulacao estatica para apresentacao visual do fluxo real em GitHub Pages.
4. `ARQUITETURA_PUBLICA.md`: diagrama de blocos da comunicacao Totem -> API -> Hub -> Paineis.

## Estrutura recomendada do repositorio publico

1. `README.md` com pitch tecnico e visao de negocio.
2. `IMAGENS LINKEDIN-README/` com evidencias visuais de robustez (TV, BI, toast, totem, status).
3. `ARQUITETURA_PUBLICA.md` com fluxo de componentes sem exposicao de codigo.
4. `demo_simulada/` com paineis separados e sincronizados para demonstracao.

---

Desenvolvido em contexto academico e aplicado a um problema operacional real de custo, eficiencia e seguranca.


## Navegação dos materiais

| Pasta ou arquivo | Acesso |
|---|---|
| ARQUITETURA_PUBLICA.md | [Abrir arquivo](./ARQUITETURA_PUBLICA.md) |
| IMAGENS LINKEDIN-README | [Abrir pasta](./IMAGENS%20LINKEDIN-README) |
| IMGS | [Abrir pasta](./IMGS) |
| assets | [Abrir pasta](./assets) |
| atendente-web.html | [Abrir arquivo](./atendente-web.html) |
| atendente.html | [Abrir arquivo](./atendente.html) |
| gerenciamento.html | [Abrir arquivo](./gerenciamento.html) |
| index.html | [Abrir arquivo](./index.html) |
| painel-tv.html | [Abrir arquivo](./painel-tv.html) |
| sim-core.js | [Abrir arquivo](./sim-core.js) |
| sim-style.css | [Abrir arquivo](./sim-style.css) |
| status.html | [Abrir arquivo](./status.html) |
| totem.html | [Abrir arquivo](./totem.html) |

