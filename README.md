# wunderwelt-a_api

## Preparando ambiente
Executar o comando abaixo para instalra as dependencias
```bash
yarn
```

## Instação do Docker

```bash
sudo apt update
sudo apt remove docker docker-engine docker.io
sudo apt install docker.io
```
Agora com o Docker instalado, vamos habilitar para que seu serviço seja iniciado automaticamente com o sistema:
```bash
sudo systemctl start docker
sudo systemctl enable docker
```
Para garantir que o Docker foi instalado da forma correta, execute no terminal:
```bash
sudo docker version
```
Você precisará executar todos comandos do Docker utilizando o sudo, mas caso queira executa-los sem o sudo, utilize [esse guia](https://docs.docker.com/engine/install/linux-postinstall/#manage-docker-as-a-non-root-user).

## Instação do Docker Compose
Rode o seguinte comando para instalar o Docker Compose:
```bash
Rode o seguinte comando para instalar o Docker Compose:
```
Aplique as permissões necessárias ao binário:
```bash
sudo chmod +x /usr/local/bin/docker-compose
```
Após isso, rode o comando `docker-compose --version` para assegurar que a instalação foi um sucesso. Caso retorne algum erro (mesmo reiniciando o terminal), crie um link simbólico para `usr/bin` com o seguinte comando:

```bash
sudo ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose
```

Por fim, teste novamente com o comando `docker-compose --version` para checar se está tudo funcionando.

## Criando container Docker para o Postgres
```bash
sudo docker run --name praktika -e POSTGRES_PASSWORD=praktika -p 5432:5432 -d postgres
```
Para verificar se o Docker está executando, utilize o comando abaixo:
```bash
sudo docker ps
```

Para verificar todos os containers instalados `sudo docker ps -a`

Para verificar o log do container `sudo docker logs <id_do_container>`

Quando reiniciar a máquina, executar o comando `sudo docker start <id_container ou nome_container>`

## Criando container Docker para o Redis
Para criar o container, execute o comando abaixo
```bash
sudo docker run --name redis -p 6379:6379 -d -t redis:alpine
```
Quando reiniciar a máquina, executar o comando `sudo docker start redis`

## Criando container Docker para o MongoDB
```bash
sudo docker run --name mongo-praktika -p 27017:27017 -d -t mongo
```
Quando reiniciar a máquina, executar o comando `sudo docker start mongo-praktika`

## Criar banco de dados
Acessar a imagem docker pelo software de sua preferencia. Atualmente utilizamos o [DBeaver](https://dbeaver.io/download/).
Crie o database `praktika`.

## Iniciando projeto
Renomeio o arquivo `.env.example` para `.env`

Realize uma cópia do arquivo `ormconfig.example.json` com o nome de `ormconfig.json`.
Execute o comando `yarn typeorm migration:run` para criar as tabelas do banco de dados.
Execute os comandos abaixo para popular algumas tabelas
```bash
yarn seed:admin
yarn seed:parameters
yarn seed:products
```

Para iniciar o projeto, execute o comando `yarn dev`

## Conectar utilizando banco de produção
Primeiro é necessário identificar qual o IP publico. Para isso acesse o site [whatismyip](https://www.whatismyip.com/) ou execute o comando abaixo:
```bash
wget -O - -q https://checkip.amazonaws.com
```
Feito isso, acessar a DigitalOcean e adicionar o IP na lista de acesso do banco de dados.
Realizar o download do CA e configurar a conexão no DBeaver, ou qualquer outro software de sua preferencia.
Feito isso, configurar o arquivo ormconfig.json com as devidas credenciais.