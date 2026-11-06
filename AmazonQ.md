# Projeto AWS - Contexto e análise técnica

## Visão geral

**Nome do pacote:** `angular-tarefas`  
**Versão:** `1.0.0`  
**Descrição:** aplicação de teste para o curso AWS  
**Repositório:** https://github.com/wesleydeveloper25/projetoaws

O projeto é uma aplicação web de gerenciamento de tarefas usada como base
prática para o curso de AWS. A interface permite criar, editar, concluir e
excluir tarefas. No estado atual, os dados são mantidos somente em memória no
navegador; não existe backend ou persistência em banco de dados neste
repositório.

## Análise técnica

### Arquitetura identificada

- **Frontend:** Angular 19.2 com componentes standalone.
- **Linguagem:** TypeScript 5.7, compilado para ES2022.
- **Componentes visuais:** Angular Material 19.2 e tema Indigo/Pink.
- **Estado da aplicação:** `BehaviorSubject` do RxJS, encapsulado no
  `TarefaService`.
- **Persistência:** lista inicial em memória; os dados são perdidos ao
  recarregar a página.
- **Build e desenvolvimento:** Angular CLI com o application builder; o
  servidor de desenvolvimento usa Vite internamente.
- **Infraestrutura local:** não há Dockerfile, Compose, servidor HTTP próprio ou
  configuração de API no projeto.

### Stack e responsabilidades

#### Frontend

- `AppComponent` exibe a lista de tarefas pendentes e as ações do usuário.
- `TarefaDialogComponent` usa Reactive Forms e valida nome, data e status.
- `TarefaService` implementa as operações locais de listar, criar, atualizar e
  excluir.
- `Tarefa` define o modelo com `id`, `nome`, `status` e `data`.
- Angular Material fornece toolbar, cards, diálogos, botões, chips, ícones e
  snackbar.

#### Configuração

- `angular.json` define os alvos de build e serve, além dos budgets de produção.
- `tsconfig.json` mantém modo estrito e validação estrita dos templates Angular.
- `src/styles.scss` carrega o tema global e os estilos básicos da aplicação.
- `src/main.ts` inicializa a aplicação com `bootstrapApplication` e suporte a
  animações assíncronas.

### Estrutura atual

```text
/
├── src/
│   ├── app/
│   │   ├── components/tarefa-dialog/  # Formulário de tarefa
│   │   ├── models/                    # Interfaces e tipos
│   │   ├── services/                  # Estado e operações das tarefas
│   │   └── app.component.ts           # Tela principal
│   ├── index.html
│   ├── main.ts
│   └── styles.scss
├── utils/scripts/                     # Automação e operações auxiliares AWS
├── .kiro/                             # Agentes e configurações MCP
├── angular.json
├── package.json
├── package-lock.json
├── tsconfig.json
└── rodar_app_local_unix.sh
```

### Integração e operações AWS

O frontend não chama diretamente APIs da AWS. A integração existente está
concentrada nos scripts operacionais em `utils/scripts/`, que usam a AWS CLI
para:

- validar VPC default, subnet da `us-east-1a`, Security Group e role do SSM;
- iniciar uma instância EC2 `t3.micro` com perfil de instância para SSM;
- abrir túnel SSM para um endpoint do ElastiCache/Redis;
- instalar o Session Manager Plugin;
- gerar credenciais temporárias com STS;
- configurar e iniciar sessões SSM.

Esses scripts dependem de recursos previamente criados na conta AWS, da região
`us-east-1`, da AWS CLI e, em alguns casos, de `jq`. Os valores de instância,
endpoint e outros identificadores ainda aparecem como placeholders em scripts
que precisam ser parametrizados antes de uso.

### Como executar

```bash
npm install
npm start
```

Para gerar o build de produção:

```bash
npm run build
```

O servidor de desenvolvimento é fornecido pelo Angular CLI. O script
`rodar_app_local_unix.sh` atualmente referencia caminhos e comandos de uma
estrutura anterior (`client`), portanto não deve ser considerado o procedimento
principal até ser atualizado.

### Pontos de atenção

1. **Persistência:** tarefas são mantidas somente em memória. Para uso
   multiusuário ou persistente, será necessário criar uma API e um banco,
   além de integrar o serviço Angular via `HttpClient`.
2. **Scripts AWS:** vários valores são fixos, incluindo região, AMI, nomes de
   recursos e portas. Recomenda-se usar parâmetros, variáveis de ambiente ou
   AWS Systems Manager Parameter Store.
3. **Rede:** o script de validação espera uma regra de entrada na porta 3001
   aberta para `0.0.0.0/0`. Isso é inadequado para produção; deve-se restringir
   CIDRs e separar acesso público de tráfego interno.
4. **Credenciais:** o script de STS imprime credenciais temporárias no terminal
   e oferece exportação para arquivo. Nunca versionar a saída nem armazená-la
   em `.env` compartilhado.
5. **AMI e região:** a AMI usada para iniciar a EC2 é específica da região e
   pode deixar de ser válida. O valor deve ser parametrizado e validado antes
   do provisionamento.
6. **Testes:** não há script de testes configurado no `package.json`. A
   aplicação deve ter testes unitários para o serviço e para o formulário antes
   de evoluir a integração com a AWS.
7. **Observabilidade:** não há configuração de logs, métricas ou health check
   da aplicação frontend. Esses recursos devem ser definidos quando houver
   publicação em AWS.

### Próximos passos recomendados

1. Corrigir o script de execução local para usar `npm install` e `npm start` na
   raiz atual.
2. Definir o alvo de hospedagem do frontend, como S3 com CloudFront, e o
   processo de build/deploy.
3. Caso seja necessária persistência, separar a API do frontend e substituir o
   estado em memória por chamadas autenticadas a um serviço AWS.
4. Parametrizar os scripts de infraestrutura e revisar as permissões IAM e as
   regras de Security Group com o princípio do menor privilégio.
