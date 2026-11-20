# ♿ CaminhoLivre Mobile

**Tecnologia a serviço da acessibilidade urbana.**

O **CaminhoLivre** é um aplicativo mobile desenvolvido para contribuir com a acessibilidade e a inclusão nas cidades. A plataforma permite que cidadãos identifiquem barreiras urbanas, registrem denúncias, consultem estabelecimentos acessíveis e compartilhem informações que ajudam outras pessoas a se deslocarem com mais autonomia e segurança.

O projeto é voltado especialmente para pessoas com deficiência, idosos, pessoas com mobilidade reduzida e cidadãos que desejam contribuir para cidades mais inclusivas.

## 🎯 Objetivo

Facilitar o acesso a informações sobre acessibilidade urbana por meio de uma plataforma colaborativa, conectando cidadãos a dados sobre problemas de infraestrutura, estabelecimentos e condições de circulação.

## 🚀 Funcionalidades

- **Autenticação:** cadastro, login e logout integrados à API Java com JWT.
- **Sessão persistente:** armazenamento seguro das informações de autenticação com Expo SecureStore.
- **CRUD de denúncias:** cadastro, listagem, consulta, edição e exclusão de problemas de acessibilidade.
- **Mapa interativo:** visualização geográfica de denúncias e estabelecimentos cadastrados.
- **Localização:** acesso à posição do usuário mediante autorização.
- **Estabelecimentos acessíveis:** consulta de informações de acessibilidade dos locais cadastrados.
- **Avaliações:** cadastro, consulta, edição e exclusão de avaliações de estabelecimentos, com notas de 1 a 5.
- **Alertas comunitários:** acompanhamento de denúncias abertas, em andamento e resolvidas.
- **Análise por IA:** apresentação dos resultados de análise das denúncias quando disponibilizados pelo backend.
- **Perfil:** consulta das informações da conta e encerramento da sessão.
- **Navegação protegida:** acesso às funcionalidades internas condicionado à autenticação.

## 🛠️ Tecnologias utilizadas

### Aplicativo mobile

- React Native
- Expo
- TypeScript
- Expo Router
- Axios
- Expo SecureStore
- Expo Location
- React Native Maps
- Expo Vector Icons

### Integração com backend

O aplicativo consome uma API REST desenvolvida em Java com:

- Spring Boot
- Spring Security e JWT
- Spring Data JPA
- PostgreSQL
- Spring AI

### Distribuição

- Expo EAS Build
- Firebase App Distribution

## 📁 Estrutura do projeto

```text
CaminhoLivreMobile/
├── app/
│   ├── _layout.tsx
│   ├── index.tsx
│   ├── (auth)/
│   │   ├── _layout.tsx
│   │   ├── login.tsx
│   │   └── cadastro.tsx
│   └── (app)/
│       ├── _layout.tsx
│       ├── index.tsx
│       ├── mapa.tsx
│       ├── estabelecimentos.tsx
│       ├── alertas.tsx
│       ├── perfil.tsx
│       ├── denuncias/
│       │   ├── index.tsx
│       │   ├── nova.tsx
│       │   └── [id].tsx
│       └── avaliacoes/
│           ├── index.tsx
│           └── [id].tsx
├── src/
│   ├── api/
│   ├── components/
│   ├── contexts/
│   ├── hooks/
│   ├── services/
│   ├── styles/
│   └── types/
├── app.json
├── eas.json
├── package.json
└── README.md
```

## ⚙️ Pré-requisitos

Para executar o projeto, é necessário ter:

- Node.js e npm
- VS Code ou outro editor
- Expo Go ou emulador Android compatível
- API Java CaminhoLivre em execução
- Acesso ao banco PostgreSQL utilizado pelo backend

## 📦 Instalação

### 1. Clonar o repositório

```bash
git clone https://github.com/SEU-USUARIO/CaminhoLivreMobile.git
cd CaminhoLivreMobile
```

Substitua `SEU-USUARIO` pelo seu usuário do GitHub.

### 2. Instalar as dependências

```bash
npm install
```

### 3. Configurar a API

Crie um arquivo `.env` na raiz do projeto:

```env
EXPO_PUBLIC_API_URL=http://10.0.2.2:8080
```

O endereço acima é um exemplo para o emulador Android.

Para utilizar um celular físico, configure um endereço de API acessível pelo dispositivo. Para distribuição externa, recomenda-se um endpoint HTTPS público.

### 4. Executar o aplicativo

```bash
npx expo start
```

Abra o aplicativo no emulador ou no dispositivo de desenvolvimento.

## 🔐 Autenticação e segurança

O aplicativo utiliza autenticação JWT fornecida pela API Java.

Após o login, o token é armazenado utilizando Expo SecureStore e enviado nas requisições autenticadas por meio do cabeçalho:

```http
Authorization: Bearer TOKEN_JWT
```

O acesso às telas internas é protegido pela autenticação.

As permissões de criação, edição e exclusão de registros devem ser validadas também pelo backend.

## 🔗 Principais endpoints da API

| Método | Endpoint | Descrição |
|---|---|---|
| POST | `/api/auth/cadastro` | Cadastro de usuário |
| POST | `/api/auth/login` | Login |
| GET | `/api/denuncias` | Listar denúncias |
| POST | `/api/denuncias` | Cadastrar denúncia |
| GET | `/api/denuncias/{id}` | Consultar denúncia |
| PUT | `/api/denuncias/{id}` | Atualizar denúncia |
| DELETE | `/api/denuncias/{id}` | Excluir denúncia |
| GET | `/api/estabelecimentos` | Listar estabelecimentos |
| GET | `/api/avaliacoes` | Listar avaliações |
| POST | `/api/avaliacoes` | Cadastrar avaliação |
| PUT | `/api/avaliacoes/{id}` | Atualizar avaliação |
| DELETE | `/api/avaliacoes/{id}` | Excluir avaliação |

Alguns endpoints de criação recebem parâmetros adicionais, conforme o contrato da API.

## 📱 Distribuição Android

O projeto utiliza Expo EAS Build para gerar versões instaláveis.

Para gerar um APK de testes:

```bash
eas build --platform android --profile preview
```

Após a geração, o APK pode ser enviado ao Firebase App Distribution para distribuição aos testadores autorizados.

## ♿ Acessibilidade e evolução

O CaminhoLivre busca facilitar o acesso a informações urbanas relevantes para pessoas com diferentes necessidades de mobilidade.

As informações exibidas no mapa são colaborativas e podem mudar com o tempo. O mapa atual apresenta denúncias e estabelecimentos cadastrados, mas ainda não calcula rotas acessíveis verificadas.

Entre as possibilidades de evolução estão o cálculo de rotas acessíveis, notificações push, filtros geográficos e melhorias na validação dos dados colaborativos.

## 📄 Licença

Projeto desenvolvido para fins acadêmicos.

A licença de distribuição do código-fonte poderá ser definida pelos responsáveis pelo projeto.
