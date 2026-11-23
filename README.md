# Controle de Estoque – Boas Práticas

Aplicação web para controle de estoque de uma pequena empresa, desenvolvida pela **Equipe 09** no Projeto Integrador da disciplina **Boas Práticas de Desenvolvimento de Software** (Senac).

A aplicação substitui o controle manual ou em planilhas por uma solução simples, que roda direto no navegador, sem instalação e sem banco de dados externo.

## Funcionalidades

**Produtos**
- Cadastrar produto com código único, nome, categoria, quantidade inicial, estoque mínimo e preço.
- Consultar todos os produtos cadastrados e pesquisar por nome ou código.
- Editar os dados cadastrais de um produto. A quantidade não pode ser alterada na edição, para que o saldo só mude por movimentações registradas.
- Excluir produto. Produtos com movimentações não podem ser excluídos, para preservar o histórico.
- Indicação de **estoque baixo** quando a quantidade atinge ou fica abaixo do estoque mínimo definido.

**Movimentações**
- **Entrada:** soma a quantidade informada ao saldo do produto.
- **Saída:** subtrai a quantidade informada, sem permitir saldo negativo.
- **Ajuste:** define um novo saldo final, registrando a diferença em relação ao saldo anterior.

**Históricos**
- Histórico de movimentações com data/hora, código, tipo, quantidade/diferença, saldo anterior e saldo posterior, com filtro por código do produto.
- Histórico de alterações cadastrais, para que toda edição de produto fique registrada.

## Como executar

1. Baixe ou clone este repositório.
2. Abra o arquivo `index.html` em um navegador atualizado (Chrome, Edge ou Firefox).

Não é necessário instalar nada nem rodar um servidor. Os dados ficam salvos no próprio navegador e continuam disponíveis ao recarregar a página.

## Como usar

A tela inicial tem três opções. Ao clicar em uma delas, o conteúdo correspondente aparece logo abaixo:

| Opção | O que faz |
|---|---|
| **Cadastrar produto** | Formulário de cadastro. Campos com `*` são obrigatórios. Também é usado para editar um produto. |
| **Verificar estoque** | Lista de produtos com pesquisa, botões de editar e excluir e o histórico de alterações. |
| **Entradas e saídas** | Formulário para registrar entrada, saída ou ajuste e o histórico de movimentações. |

As mensagens de erro e de sucesso aparecem dentro do próprio formulário, logo acima dos botões.

## Regras de negócio principais

- O código do produto é obrigatório e não pode se repetir.
- O nome é obrigatório e não pode conter apenas espaços.
- Quantidade e estoque mínimo são números inteiros não negativos (padrão 0). Preço é decimal não negativo (padrão 0,00).
- Entrada e saída exigem quantidade inteira maior que zero. A saída não pode ser maior que o saldo disponível.
- O ajuste aceita qualquer saldo final inteiro maior ou igual a zero.
- A atualização do saldo e o registro no histórico são gravados juntos. Se a gravação falhar, os dados voltam ao estado anterior e a operação não é apresentada como concluída.

## Tecnologias

- **HTML5** – estrutura da página.
- **CSS3** – layout e estilos. A troca entre as telas é feita só com CSS (seletor `:target`).
- **JavaScript** – regras de negócio, validações e interação com a página.
- **LocalStorage** – armazenamento dos dados no navegador, nas chaves `produtos`, `movimentacoes` e `alteracoes`.

## Estrutura do projeto

```
controle-estoque-boas-praticas/
├── index.html          página única da aplicação
├── css/
│   └── style.css       estilos da página
├── js/
│   └── script.js       regras, validações e armazenamento
├── documentacao/       documentos do projeto
└── README.md
```

## Documentação

Na pasta `documentacao/`:

- **Levantamento de Informações Básicas do Projeto** – levantamento inicial e dicionário de dados.
- **Projeto Integrador – Equipe 09** – especificação funcional, regras de negócio, modelo de dados e plano de testes (documento de referência oficial).
- **Relatório – Casos de testes** – resultado da execução dos casos de teste.
- **Massa de Dados para Teste** – dados de exemplo usados nos testes.

## Limitações conhecidas

- Os dados ficam apenas no navegador e no computador em que foram cadastrados. Limpar os dados do navegador apaga as informações.
- Não há login, controle de permissões nem uso simultâneo por várias pessoas.
- O LocalStorage não é um banco de dados transacional. A gravação coordenada reduz o risco de inconsistência, mas não oferece as mesmas garantias de um banco de dados.

## Equipe

| Integrante | Participação |
|---|---|
| Felipe | Levantamento de informações e dicionário de dados |
| Natália | Documentação, plano e relatório de testes |
| Lucas e Amanda | Interface (HTML e CSS) |
| Larissa e Thomaz | Lógica da aplicação (JavaScript) |
