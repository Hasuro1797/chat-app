# Chat en Tiempo Real con NestJS, PostgreSQL, JWT y WebSockets

Este proyecto es una aplicación de chat en tiempo real desarrollada con NestJS en el backend, PostgreSQL como base de datos y WebSockets para la comunicación en tiempo real. Incluye autenticación y autorización mediante JWT (JSON Web Tokens).

## Características

- Autenticación de usuarios mediante JWT.
- Autorización para enviar mensajes solo a usuarios autenticados.
- Mensajes en tiempo real utilizando WebSockets.
- Almacenamiento de mensajes en PostgreSQL.
- Cliente Node.js para probar la funcionalidad del WebSocket.

## Tecnologías utilizadas

- [NestJS](https://nestjs.com/)
- [PostgreSQL](https://www.postgresql.org/)
- [Socket.IO](https://socket.io/)
- [JWT (JSON Web Token)](https://jwt.io/)
- [TypeORM](https://typeorm.io/)

## Requisitos previos

Antes de comenzar, asegúrate de tener instalado lo siguiente en tu máquina:

- Node.js v14+ (recomendado)
- PostgreSQL
- npm o yarn

## Configuración del entorno

1. Clona este repositorio en tu máquina local.

```bash
git clone https://github.com/Hasuro1797/chat-app.git
cd chat-app
```

2. Instala las dependencias del proyecto

```bash
npm install
```

o

```
yarn
```

3. Configura la base de datos PostgreSQL. Asegúrate de tener PostgreSQL corriendo en tu sistema. Crea una base de datos cuyo nombre tambien ira en la en archivo `.env`:

```
CREATE DATABASE [your database name];
```

4. Crea un archivo `.env` parecido al archivo `.env.template` en la raíz del proyecto y añade la configuración de la base de datos y la clave secreta de JWT:

```
PORT=3000
DATABASE_PORT=5432
DATABASE_USERNAME=username
DATABASE_PASSWORD=yourupassword
DATABASE_HOST=localhost
DATA_BASE_NAME=chatdb
JWT_SECRET=yoursecretKey
```

6. Inicia el servidor de NestJS.

```
yarn start:dev
```

El servidor debería estar corriendo en http://localhost:3000.

## Probar la funcionalidad del chat con el cliente Node.js

Este proyecto incluye un archivo client.js que actúa como cliente para interactuar con el servidor WebSocket. Para ejecutarlo:

Abre otro terminal y asegúrate de estar en el directorio raíz del proyecto.
Ejecuta el archivo client.js.

```
node scripts/client.mjs
```

El cliente se conectará al servidor WebSocket, enviará un mensaje y recibirá respuestas en tiempo real.

### Ejemplo del flujo de trabajo

1. Regístrate como un nuevo usuario a través del endpoint POST /api/auth/register.

```
curl -X POST http://localhost:3000/api/auth/register -d "username=testuser&password=testpass"
```

2. Inicia sesión con el usuario registrado para obtener un token JWT.

```
curl -X POST http://localhost:3000/api/auth/login -d "username=testuser&password=testpass"
```

3. Usa el token JWT obtenido para conectarte y enviar mensajes mediante client.mjs.
   Para probar con el client.mjs debes cambiar el usuario y la contraseña en la linea 18 del archivo con el usuario que te registraste en la base de datos:

```
const token = await authenticate([tu usuario registrado], [tu contraseña]);
```
