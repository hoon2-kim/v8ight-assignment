# 📄 v8ight 사전과제

---

## 사용 스택

- NestJS, TypeScript, MySQL, TypeORM, REST-API, Jest

## 실행방법

```
yarn install

.env 입력

yarn start:dev
```

## ERD

<img width="434" alt="erd" src="https://github.com/hoon2-kim/NestJS-Hoonflearn/assets/107983013/97b07748-fabb-4522-9b87-15410a15078d">

#### 부가설명

- posts 테이블에 category 컬럼을 설정한 이유는 게시글의 카테고리가 사전과제 내용에서 3가지로 고정되어 있어 데이터를 쿼리하거나 필터링할 때 JOIN 연산이 줄어든다는 단점하에 선택하였습니다.
- 하지만 카테고리가 유연성,확장성이 필요한다면 현재 방식이 아닌 별도의 category 테이블을 만들어 관리하는 방식으로 변경이 필요합니다.

## Unit Test

<img width="203" alt="unittest" src="https://github.com/hoon2-kim/NestJS-Hoonflearn/assets/107983013/a1750e5d-06f4-4475-86c5-5b291245f3ba">
<br>
</br>
APi에 대한 58개의 유닛테스트를 작성하였습니다.

## S3 Upload

<img width="1280" alt="s33" src="https://github.com/hoon2-kim/NestJS-Hoonflearn/assets/107983013/9de4ff31-7de3-4550-828d-607747520d04">
<br>
</br>
해당 게시글에 이미지 업로드API를 통해 이미지를 업로드 시 "버킷/posts/postId"의 경로안에 저장되도록 하였습니다.
