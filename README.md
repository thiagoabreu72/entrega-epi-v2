# EntregaEpi

Este projeto foi gerado na versão 9.1.15. [Angular CLI](https://github.com/angular/angular-cli) .

Tem o objetivo de contemplar a geração de RM (Requisições de Mercadorias) no ERP do cliente através da plataforma Senior X.

## Anotações importantes

Adicionar a biblioteca '@seniorsistemas/senior-platform-data' via npm;
Importar "user" no service da aplicação: import { user } from '@seniorsistemas/senior-platform-data';
Criar uma variável token para receber as informações do login.
Adicionar a chamada do método no construtor do service da aplicação: 

user
      .getToken()
      .then((data) => {
        this.token = data;
      })
      .catch((error) => {
        alert(
          'Não foi possível obter token. Verifique se a tela está sendo acessada pela plataforma Senior X.'
        );
      });

Posteriormente, injetar o service no componente principal.
No package.json, adicionar o comando "ng serve --host localhost.senior.com.br --disable-host-check --ssl --port 443" em script > start .
Iniciar o projeto com npm start e com o Senior X logado em outra aba.

## Notas de versão 
23/04/2025: 
  * implementado ajustes na exibição de mensagens.
  * alterado requisições para que consuma informações dos webservices via conectores Senior.
  * alterado visual para uma interface mais intuitiva.