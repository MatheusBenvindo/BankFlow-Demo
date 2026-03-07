# Arquitetura Publica - BankFlow Queue System

Este documento descreve a arquitetura em nivel de blocos para o repositorio publico.

## Objetivo

Apresentar como os modulos se conectam em ambiente real sem expor codigo-fonte proprietario (`.cs`, `.sln`, regras internas e segredos).

## Diagrama de blocos

```mermaid
flowchart LR
  T[Totem de Autoatendimento]\n(Emissao de senha) --> API[SenhasAPI .NET 9]
  API --> HUB[SignalR Hub]
  HUB --> TV[Painel TV]
  HUB --> AD[Atendente Desktop\nWebView2 + Toast]
  HUB --> AW[Atendente Web\nFallback]
  API --> DB[(SQLite + EF Core)]
  API --> GW[Gerenciamento Web]\n(MVC + BI)
  GW --> BI[Painel BI]\n(Ranking + Volumetria)
  API --> PX[Proxy Seguro de Noticias]
  PX --> TV
```

## Fluxo operacional resumido

1. Cliente gera senha no Totem.
2. API persiste e publica evento no Hub.
3. Atendente recebe demanda (desktop/web), chama e finaliza.
4. Painel TV exibe chamada publica em tempo real.
5. BI consolida indicadores operacionais para gestao.

## Escopo do repositorio publico

1. README de negocio e tecnologia.
2. Assets visuais (prints de paineis).
3. Documentacao de arquitetura.
4. Demo simulada HTML/JS para GitHub Pages.

## Nao incluso no repositorio publico

1. Codigo-fonte funcional do backend.
2. Solucao/projetos internos (`.sln`, `.csproj`, `.cs`).
