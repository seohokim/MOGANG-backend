# User API

## Post

### 로그인

POST users/

local 회원가입

```json
{
  "email": "example@example.com",
  "firstName": "길동",
  "lastName": "홍",
  "password": "example",
  "checkPassword": "example"
}
```

output

```json
{
  "ok": true,
  "statusCode": 200
}
```

만약 가입되었을 경우

```json
{
  "ok": false,
  "message": ["already-submitted"],
  "error": "Conflict",
  "statusCode": 409
}
```

checkedPassword와 password가 맞지 않는 경우

```json
{
  "ok": false,
  "message": ["password-not-match"],
  "error": "Unauthorized",
  "statusCode": 401
}
```

서버 error

```json
{
  "ok": false,
  "message": ["server-error"],
  "error": "Internal Server Error",
  "statusCode": 500
}
```
