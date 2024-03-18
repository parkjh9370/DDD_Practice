## DDD_Practice

### 1. 모듈 설치

> Requirements: node version = 18.16.0

```bash
nvm use 18.16.0
yarn install
```

</br>

### 2. 서버 실행

#### <U> 1) 개발 환경 </U>

```bash
docker-compose -f docker-compose.local.yaml up
```

</br>

#### <U> 2) 배포 환경 </U>

```bash
docker-compose -f docker-compose.local_prod.yaml up
```