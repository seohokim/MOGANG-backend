# Auth API

## 로그인

### POST auth/login

local 로그인

```json
{
  "email": "example@example.com",
  "password": "example"
}
```

로그인 성공

```json
{
  "ok": true,
  "accessToken": "ACCESSTOKEN",
  "statusCode": 200
}
```

로그인 실패 (유저 없음)

```json
{
	"ok": false,
	"message": ["user-not-found"],
	"error": "Not Found"
	"statusCode": 404
}
```

로그인 실패 (비밀번호 불일치)

```json
{
  "ok": false,
  "message": ["password-not-match"],
  "error": "Unauthorized",
  "statusCode": 401
}
```

로그인 실패 (서버 오류)

```json
{
  "ok": false,
  "message": ["server-error"],
  "error": "Internal Server Error",
  "statusCode": 500
}
```
