# Milkin-Hiring

## Requisitos

- Node.js
- MongoDB

## Configuração

Para rodar o projeto, siga os passos abaixo:

1.  **Clone o repositório:**

    ```bash
    git clone https://github.com/LuisFernando12/milk-hiring.git
    cd milk-hiring
    ```

2.  **Renomeie o arquivo `.env-template` para `.env`:**

    - Em sistemas Unix (Linux/macOS):

      ```bash
      mv .env.template .env
      ```

    - Em Windows (PowerShell):

      ```powershell
      Rename-Item -Path ".env.template" -NewName ".env"
      ```

3.  **Configure as variáveis de ambiente no arquivo `.env`:**

        ```dotenv
        PORT= # Porta na qual o projeto será executado
        MONGO_URI= '' #URI de conexão com Mongo
        MONGODB_DATABASE='' # Banco no qual deseja se conectar no Mongo
     ```

4.  **Instale as dependências:**

    No terminal, na pasta raiz do projeto, execute:

    ```bash
    npm install
    ```

5.  **Inicie o projeto:**

    Após a instalação das dependências, execute:

    ```bash
    npm run start
    ```

6.  **Acesse o projeto:**

    O projeto estará disponível no endereço:

    ```
    http://localhost:(A porta que você definiu no arquivo .env)
    ```
