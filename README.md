# TypeScript RESTful API example with Express.js, JWT, Authorization Roles, TypeORM

## Steps to run this project:

1. Run `npm i` command
2. Setup database settings inside `ormconfig.json` file
3. Run `npm start` command

## Run in production

1. Run `npm build` command
2. Run `npm prod` command

## Database migration

- Generate/update tables from entities: `npm run typeorm:cli -- migration:generate -n NameOfMigration`
- Create new migration: `npm run typeorm:cli -- migration:create -n NameOfMigration`

## Usages

### Login

`POST` `http://localhost:3000/auth/login`

```json
{
  "email": "test@example.com",
  "password": "123456"
}
```

Get token from response and set to request header with `auth` key

`HEADER`

```json
{
  "auth": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImVtYWlsIjoiZW1haWxAYWFhLmNjY2MiLCJpYXQiOjE1NjQzODQyMzksImV4cCI6MTU2NDM4NzgzOX0.dW8JEjDK9_5XQIneTMQdktlUMDu-2_TcEYOUQMgn9LQ"
}
```

### Get list users

`GET` `http://localhost:3000/user/`

### Create new user

`POST` `http://localhost:3000/user/`

```json
{
  "email": "new_user@example.com",
  "password": "123456",
  "first_name": "New",
  "last_name": "User",
  "role": "admin",
  "age": 21
}
```

### Update a user

`PATCH` `http://localhost:3000/user/:USER_ID`

```json
{
  "first_name": "Updated",
  "last_name": "User",
  "password": "654321",
  "role": "user",
  "age": 12
}
```

### Delete a user

`DELETE` `http://localhost:3000/user/:USER_ID`

## References:

- https://medium.com/javascript-in-plain-english/creating-a-rest-api-with-jwt-authentication-and-role-based-authorization-using-typescript-fbfa3cab22a4
- https://medium.com/@bojanmajed/standard-json-api-response-format-c6c1aabcaa6d
