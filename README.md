# Documentação técnica — Davison Queiroz

## Visão Geral

### Oque o sistema faz
O usuário informa os dados para envio de proposta no forms, assim como anexa o documento para envio. Ao selecionar o botão de envio de proposta é verificado se todos os campos obrigatórios do forms foram preenchidos. Os dados são extraidos,o front-end enviará os dados para o back-end, que criará o card no pipefy. Feito a criação do card( e exibido o ID do card criado ao usuário), solicitado a Url para envio do documento, realizado o envio do documento e alterado o status do card. A aba referente a consulta de status é selecionada e realizado requisição do status do card. No intervalo de 3 minutos, a cada 5 segundos será feito uma request na rota de Status. Se dentro desse periodo não retornar "Aprovado" ou "Reprovado" , será gerado um botão para refazer a solicitação. Caso seja retornado um dos valores citados, será gerado o resultado com as informações da proposta e o resultado final.

## Diagrama de Fluxo

```mermaid
flowchart TD
    A[Usuário acessa a aplicação] --> B[Preenche os dados da proposta]
    B --> C[Anexa documento PDF]
    C --> D[Envia a proposta]
    D --> E[Front-end envia dados ao back-end]
    E --> F[Back-end cria card no Pipefy]
    F --> G[Pipefy retorna o ID do card]
    G --> H[Solicita URL para upload]
    H --> I[Envia o PDF]
    I --> J[Atualiza documento do card]
    J --> K[Move card para análise]
    K --> L[Consulta o status]
    L --> M{Status final?}
    M -->|Não| N[Aguarda 5 segundos]
    N --> L
    M -->|Aprovado| O[Exibe proposta aprovada]
    M -->|Reprovado| P[Exibe proposta reprovada]
    L --> Q{Tempo excedido?}
    Q -->|Sim| R[Permite repetir consulta]
    R --> L
```

## Oque faria diferente com mais tempo

- Sistema de login
- Menu para navegação
- Validação de CNPJ e CPF com base no radio button e validação do documento em si
- Histórico de propostas
- front-end mais trabalhado
- Validação de valores passados nos campos do Forms
- Opção de edição e reenvio de proposta

## Uso de IA

IA foi utilizada como apoio durante o desenvolvimento para:

- Definir a arquitetura da aplicação e a separação entre front-end, back-end e integração com o Pipefy.
- Orientar referente ao funcionamento e criação das consultas GraphQL
- Revisar o código e identificar erros de digitação, importações, exportações e problemas de estrutura.
- Sugerir melhorias de validação e organização do código.
- Auxiliar e orientar na compreensão de tópicos onde não havia muita clareza.
