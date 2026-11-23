# BankFlow: sistema de filas para agências

Sistema de senhas e atendimento que roda na rede local da agência, sem depender de fornecedor. Este repositório é a vitrine pública: traz uma demonstração navegável e a arquitetura. O código do back-end fica em um repositório privado.

**Demonstração:** https://matheusbenvindo.github.io/BankFlow-Demo/

![Painel de TV com as chamadas](IMAGENS%20LINKEDIN-README/Captura%20de%20tela%202026-03-06%20223528.png)

## Por que existe

A agência pagava cerca de R$ 6.000 por ano por um sistema de senhas alugado que dava pouca informação gerencial, dependia do fornecedor para qualquer ajuste e expunha dados fora da rede local.

O BankFlow troca essa despesa recorrente por um investimento único em totem e instalação local, com retorno estimado em 12 meses.

| | Sistema alugado | BankFlow |
|---|---|---|
| Custo anual | cerca de R$ 6.000 | sem licença recorrente |
| Ajustes | dependem do fornecedor | feitos conforme a operação |
| Dados | com terceiros | na rede da empresa |

## Módulos

1. Totem de autoatendimento para retirar a senha.
2. Painel de TV com as chamadas em tempo real.
3. Painel do atendente em aplicativo desktop (WebView2), com barra flutuante e aviso do Windows quando entra senha nova.
4. Painel do atendente pelo navegador, para máquinas antigas ou contingência.
5. Painel administrativo: guichês, vídeos e notícias da TV (com pré-visualização) e configurações gerais.
6. Indicadores de atendimento: ranking por atendente e guichê, volume por faixa de horário e gargalos do momento.

![Indicadores de atendimento](IMAGENS%20LINKEDIN-README/Captura%20de%20tela%202026-03-06%20230403.png)

![Aviso no desktop quando entra uma senha](IMAGENS%20LINKEDIN-README/Captura%20de%20tela%202026-03-07%20170023.png)

## Arquitetura

API e painéis na mesma rede da agência, com eventos em tempo real por SignalR e dados em SQLite. O fluxo Totem → API → Hub → Painéis está em [`ARQUITETURA_PUBLICA.md`](ARQUITETURA_PUBLICA.md).

![Totem e infraestrutura local](IMAGENS%20LINKEDIN-README/Captura%20de%20tela%202026-03-06%20223454.png)

![Status da operação](IMAGENS%20LINKEDIN-README/Captura%20de%20tela%202026-03-06%20225333.png)

**Tecnologias:** .NET 9 com ASP.NET Core, SignalR, WebView2, SQLite e Entity Framework Core.

## O que tem neste repositório

- `index.html` e as páginas `totem`, `painel-tv`, `atendente`, `atendente-web`, `gerenciamento` e `status`: a demonstração, com dados simulados em `sim-core.js`.
- `ARQUITETURA_PUBLICA.md`: diagrama de blocos sem código interno.
- `IMAGENS LINKEDIN-README/` e `IMGS/`: capturas do sistema real.

---

Faz parte do [índice de materiais e projetos](https://github.com/MatheusBenvindo/MatheusBenvindo/blob/main/CURSOS.md#projetos) de Matheus Ribeiro.
