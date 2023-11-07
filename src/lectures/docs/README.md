# Lecture API

## Lecture 생성

### POST lectures

input

```json
{
  "title": "프론트의 첫걸음",
  "author": "김땡땡",
  "skills": ["javascript", "http", "css"],
  "category": ["백엔드", "웹서버"],
  "lectureUpdatedAt": "2023/11",
  "level": "입문",
  "originPrice": 500000,
  "currentPrice": 400000,
  "description": "프론트의 본좌 김땡떙이 알려주는 초 대박 강의",
  "provider": "inflearn",
  "duration": "14:05",
  "thumbnailUrl": "https://inflearn.com",
  "score": 4.5,
  "url": "https://inflearn.com/1"
}
```

output

이미 있는 강의인 경우

```json
{
  "ok": false,
  "message": ["already-exist"],
  "error": "Conflict",
  "statusCode": 409
}
```

인터넷 에러

```json
{
  "ok": false,
  "message": ["error.toString()"],
  "error": "Internal Server Error",
  "statusCode": 500
}
```

## Lecture list 불러오기

### GET lecture

input

```json
{
  	"currentPrice": 10000, //선택 (이것보다 작은 가격 강의 가져옴)
  	"title":"프론트", //선택
  	"skills":["javascript","HTML/CSS"] //선택 (해당 스킬 하나라도 포함되어 있으면 가져옴)
  	"order": "score", // 필수, score, createdAt, currentPrice 중 하나 입력.
  	"category": ["웹 개발"] //필수 (해당 카테고리 포함된 강의 가져옴)
}
```

output

```json
{
	"ok": true,
	"lectures": [
		{
			"id": 70,
			"createdAt": "2023-11-06T05:05:01.454Z",
			"updatedAt": "2023-11-06T05:05:01.454Z",
			"provider": "inflearn",
			"title": "스프링 핵심 원리 - 고급편",
			"author": "김영한",
			"skills": [
				"Spring",
				"디자인 패턴"
			],
			"category": [
				"백엔드",
				"웹 개발"
			],
			"lectureUpdatedAt": "2023/01",
			"level": "중급이상",
			"originPrice": "121000",
			"currentPrice": "121000",
			"duration": "16:44",
			"score": 5,
			"views": 0,
			"thumbnailUrl": "https://cdn.inflearn.com/public/courses/327901/cover/d0f80fce-6877-4058-91bb-dc1ef57339a2/327901-eng.png",
			"url": "https://www.inflearn.com/course/스프링-핵심-원리-고급편",
			"likes": 0
		},
		{
			"id": 62,
			"createdAt": "2023-11-06T05:05:01.447Z",
			"updatedAt": "2023-11-06T05:05:01.447Z",
			"provider": "inflearn",
			"title": "제대로 파는 HTML CSS - by 얄코",
			"author": "얄팍한 코딩사전",
			"skills": [
				"HTML/CSS"
			],
			"category": [
				"웹 개발",
				"웹 퍼블리싱",
				"프론트엔드"
			],
			"lectureUpdatedAt": "2022/06",
			"level": "입문",
			"originPrice": "44000",
			"currentPrice": "44000",
			"duration": "11:16",
			"score": 5,
			"views": 0,
			"thumbnailUrl": "https://cdn.inflearn.com/public/courses/328592/cover/b8957940-b416-4f31-8ae1-1cd2c5b29f3a/HTML-CSS--IFL.png",
			"url": "https://www.inflearn.com/course/제대로-파는-html-css",
			"likes": 0
		},
		{...}],
	"statusCode":200
}
```

category 입력 안할 때

```json
{
  "ok": false,
  "message": ["category-not-found"],
  "error": "Bad Request",
  "statusCode": 400
}
```

order 없을 때

```json
{
  "ok": false,
  "message": ["order-not-found"],
  "error": "Bad Request",
  "statusCode": 400
}
```

조건 만족하는 lecture 없을 때

```json
{
  "ok": true,
  "message": ["not-found"],
  "statusCode": 200
}
```

서버 에러

```json
{
  "ok": false,
  "message": "${error.toString()}",
  "error": "Internal Server Error",
  "statusCode": 500
}
```

## id로 특정 Lecture 불러오기

### GET lectures/:id

input

```json
{
  "id": 300
}
```

output

```json
{
  "ok": true,
  "lecture": {
    "id": 300,
    "createdAt": "2023-11-06T05:05:02.659Z",
    "updatedAt": "2023-11-06T05:05:02.659Z",
    "provider": "inflearn",
    "title": "DOM 기본",
    "author": "김영보",
    "skills": ["DOM", "JavaScript", "HTML/CSS"],
    "category": ["프론트엔드", "웹 개발"],
    "lectureUpdatedAt": "2021/12",
    "level": "초급",
    "originPrice": "77000",
    "currentPrice": "77000",
    "duration": "24:33",
    "score": 4.4,
    "views": 0,
    "thumbnailUrl": "https://cdn.inflearn.com/public/courses/328118/cover/591c315e-b376-4486-9638-89577482ad6f/328118-eng.png",
    "url": "https://www.inflearn.com/course/dom-기본",
    "like": 0
  },
  "statusCode": 200
}
```

해당 id의 lecture가 없는 경우

```json
{
  "ok": false,
  "message": ["not-found"],
  "error": "Not Found",
  "statusCode": 404
}
```

서버 에러

```json
{
  "ok": false,
  "message": ["server-error"],
  "error": "${error}",
  "statusCode": 500
}
```

## 특정 id에 해당하는 lecture에 user like (accessToken 있어야 가능)

### GET lectures/:id/like

input

```json
{
  "lectureId": 1
}
```

like 누른 상태가 아닐 때

```json
{
	{
	"ok": true,
	"statusCode": 200
}
}
```

like 누른 상태였을 때

```json
{
  "ok": true,
  "message": ["like-eliminated"],
  "statusCode": 200
}
```

해당 id의 lecture를 찾을 수 없을 때

```json
{
  "ok": false,
  "message": ["lecture-not-found"],
  "error": "Not Found",
  "statusCode": 404
}
```
