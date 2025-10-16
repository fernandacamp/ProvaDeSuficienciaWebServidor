
# 📋 Sistema de Controle de Feedback – Prova de Suficiência

Este projeto é um **sistema de controle de feedback** desenvolvido em **Node.js com TypeScript**, sem uso de frameworks, com armazenamento de dados em **PostgreSQL**.  
O sistema permite coletar sugestões, bugs ou reclamações dos usuários, além de gerenciar feedbacks via painel protegido por autenticação.

---

## 🚀 Tecnologias Utilizadas

- Node.js
- TypeScript
- PostgreSQL
- npm (gerenciador de pacotes)
- EJS para templates de interface
- Bootstrap 5 para interface responsiva
- Rotas personalizadas sem frameworks
- MVC (Controllers, Services, Views)

---

## ✅ Pré-requisitos

Antes de rodar o projeto, certifique-se de ter instalado:

### 🐘 PostgreSQL 
- Instale PostgreSQL (versão 12 ou superior recomendada) 
- Crie um banco de dados chamado `feedbacks_db`  
- Utilize o script SQL abaixo para criar a tabela necessária

### 🟢 Node.js + npm
- Node.js (versão 18.x ou superior recomendada)  
- npm (Node Package Manager) será instalado automaticamente com o Node.js  

### 🟦 TypeScript
- Instale TypeScript globalmente:
```bash
npm install -g typescript
```
- Instale ts-node para rodar arquivos TypeScript diretamente:
```bash
npm install -g ts-node
```

---

## 📦 Clonar o projeto

Clone o repositório:

```bash
git clone https://github.com/CzR21/exame_suficiencia.git
cd exame_suficiencia
```

---

## 🔧 Configurar arquivo `.env`

Configure as variáveis de ambiente no arquivo `.env` com os dados do seu banco PostgreSQL e a porta em que rodará a aplicação:

```
DB_HOST=localhost
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_NAME=feedbacks_db
DB_PORT=5432
PORT=3000
```

---

## 📦 Instalar dependências

Dentro da pasta do projeto, execute:

```bash
npm install
```

Para iniciar a aplicação:

```bash
npm run dev
```

Abra no navegador(com a porta definida no arquivo .env):

```
http://localhost:PORT
```

---

## 🔐 Autenticação

- A **única rota pública** é `/`, com o formulário de envio de feedback.  
- As demais rotas são protegidas por autenticação simples:  
  - **Usuário:** `admin`  
  - **Senha:** `123456`  
- Caso não autenticado, será exibido um formulário de login.

---

## 📦 Funcionalidades e Rotas

| Rota | Método | Descrição |
|------|--------|-----------|
| `/` | GET | Exibe formulário de envio de feedback (público) |
| `/feedbacks` | GET | Lista todos os feedbacks (autenticado) |
| `/feedbacks/{id}` | GET | Exibe detalhes de um feedback (autenticado) |
| `/feedback/cadastrar` | POST | Cadastra novo feedback |
| `/feedback/atualizar` | PUT | Atualiza status de um feedback (autenticado) |
| `/logout` | GET | Faz logout do sistema e redireciona para login |

---

## 🧾 Modelo da Tabela (SQL)

```sql
CREATE TYPE public.status_feedback AS ENUM
    ('recebido', 'em análise', 'em desenvolvimento', 'finalizado');

ALTER TYPE public.status_feedback
    OWNER TO postgres;

CREATE TYPE public.tipo_feedback AS ENUM
    ('bug', 'sugestão', 'reclamação', 'feedback');

ALTER TYPE public.tipo_feedback
    OWNER TO postgres;


CREATE TABLE IF NOT EXISTS feedbacks (
    id SERIAL PRIMARY KEY,
    titulo TEXT NOT NULL,
    descricao TEXT NOT NULL,
    tipo tipo_feedback NOT NULL,
    status status_feedback NOT NULL DEFAULT 'recebido'
);
```

---

## 📝 Observações

- A interface é simples, funcional e responsiva, utilizando **Bootstrap 5**.  
- Paleta de cores personalizada para botões, alertas e cards.  
- Formulários de envio e atualização de feedbacks redirecionam automaticamente para a lista.  
- Sistema segue o padrão **MVC** e foi desenvolvido **sem frameworks**.  

---

## 💻 Estrutura do Projeto

```
src/
 ├─ controllers/  
 ├─ enum/     
 ├─ models/         
 ├─ public/             
 ├─ services/             
 ├─ utils/        
 ├─ views/      
 └─ index.ts          
 └─ routes.ts     
```
