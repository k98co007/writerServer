# writerServer

NestJS 요약

Server frame work – NestJS

DB – MySQL 8.x

ORM – TypeORM

HTTP API Test Tool – CURL 

Ex) curl -X GET http://localhost:3000/users

NestJS 설치

Nodejs 설치

NestJS 설치 – npm I -g @nestjs/cli

프로젝트 생성 - Nest new project-name

서버 구동 – npm run start:dev

구동 확인 – 브라우저 localhost:3000 확인

포트 변경 – main.ts 의 listen 포트를 변경

컨트롤러 생성 – nest g co Users

가드 생성 – nest g gu Guard

모듈 생성 – nest g mo 모듈네임

서비스 생성 – nest g s 서비스네임

라이브러리 생성 – nest g lib 라이브러리 네임

CRUD 생성 – nest g res CRUD 네임 ( entity, dto 까지 자동 생성 됨 )

예제

@Get()
findAll(@Res() res){
const users = this.userService.findAll();
return res.status(200).send(users);
}

@HttpCode(202)
@Patch(‘:id’)
Update(@Param(‘id’) id: string, @Body() updateUserDto: UpdateUserDto) {
return this.userService.update(+id, updateUserDto);
}

Curl 출력 보기 ( Json 은 JQ 유틸 사용 ) 

http://stedolan.github.io/jq 

Curl -X GET http://localhost:3000/users/0 | jq

헤더 변경 예제

@Get()
findAll(@Res() res){
const users = this.userService.findAll();
return res.header().send(users);
}

Curl 에서 헤더 확인

Curl http://localhost:3000/users/1 -v

라우팅 매개변수 예제

@Delete(‘:userId/memo/:memoId’)
deleteUserMemo(
@Param(‘userId’) userId: string,
@Param(‘memoId’) memoId: string,
){
return ‘userId: ${userId}, memoId: ${memoId}’;
}

하위 도메인 라우팅 예제

@controller({ host: ‘api.example.com’})
export class ApiController{
@Get()
index(): string {
  return ‘hello, API’;
}
}

로컬호스트 하위 도메인 설정 방법

/etc/hosts
…
127.0.0.1 api.localhost
127.0.0.1 v1.api.localhost

하위 도메인 API 버저닝

@Controller({ host: ‘:version.api.localhost’})
export class ApiController{
@Get()
index(@HostParam(‘version’) version: string): string{
  return ‘Hello, API ${version}’;
}
}

DTO 예제

export class CreateUserDto{
readonly name: string;
readonly email: string;
readonly password: string;
}

@Post()
create(@Body() createUserDto: CreateUserDto){
const { name, email } = createUserDto;
return ‘user name: ${name} email:${email}’;
}

Curl -X POST http://localhost:3000/users -H “content-type: application/json” -d ‘{“name”: “name exam”, “email”: “email@gmail.com”}’

Controller 예제

@Controller('users')
export class UsersController {
constructor(private usersService: UsersService) { }

@Post()
  async createUser(@Body() dto: CreateUserDto): Promise<void> {
    const { name, email, password } = dto;
    await this.usersService.createUser(name, email, password);
}

  @Post('/email-verify')
  async verifyEmail(@Query() dto: VerifyEmailDto): Promise<string> {
    console.log(dto);
    return;
  }

  @Post('/login')
  async login(@Body() dto: UserLoginDto): Promise<string> {
    console.log(dto);
    return;
  }

  @Get('/:id')
  async getUserInfo(@Param('id') userId: string): Promise<UserInfo> {
    console.log(userId);
    return;
  }
}

토큰용 uuid 라이브러리 설치

npm i uuid
npm i –-save-dev @types/uuid

uuid 예제

import * as uuid from 'uuid';
const signupVerifyToken = uuid.v1();

전역 모듈 – DB, Helper, Logger 같은 전역모듈, 루트 모듈에서 한번만 등록해야 함

@Global()
@Module({
providers:[ CommonService],
exports: [ CommonService]
})
export class CommonModule{}

dotenv 설치

npm i -–save dotenv
npm i -–save-dev @types/dotenv

.development.env
DATABASE_HOST=local
.stage.env
DATABASE_HOST=stage.dextto.com
.production.env
DATABASE_HOST=prod.dextto.com
.env는 .gitignore에 추가 할 것. 
.env는 DB 시크릿키 같은 것 저장됨

NODE_ENV

Package.json 
"start:dev": "npm run prebuild && NODE_ENV=development nest start --watch",

dotenv.config({
path: path.resolve(
(process.env.NODE_ENV === 'production') ? '.production.env'
: (process.env.NODE_ENV === 'stage') ? '.stage.env' : '.development.env'
)
});

process.env.DATABASE_HOST;

NestJS는 NODE_ENV 대신 Config 사용함

npm i -–save @nestjs/config

@Module({
  imports: [ConfigModule.forRoot({
    envFilePath: (process.env.NODE_ENV === 'production') ? '.production.env'
      : (process.env.NODE_ENV === 'stage') ? '.stage.env' : '.development.env'
  })],
  controllers: [AppController],
  providers: [AppService],
})

import { ConfigServer } from ‘@nestjs/config’;
this.configService.get(‘DATABASE_HOST’);

파이프 예제

@Get(‘:id’)
findOne(@Param(‘id’, ParseIntPipe) id: number){
  return this.usersService.findOne(id);
}

쿼리 매개변수 예제

url : http://localhost:3000/v1/users?offset=2&limit=10
@Get()
findAll(
@Query(‘offset’, new DefaultValuePipe(0), ParseIntPipe) offset: number,
@Query(‘limit’, new DefaultValuePipe(10), PaseIntPipe) limit: number,
){
  return this.usersService.findAll();
}

유효성검사 파이프

mpm i –-save class-validator class-transformer

import { IsString, MinLength, MaxLength, IsEmail } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(2)
@MaxLength(30)
@Transform(params=>params.value.trim())
  readonly name: string;

  @IsEmail()
email: string;

@Matches(/^[A-Za-z\d!@#$%^&*()]{8,30}$/)
Readonly password: string;
}

전역 유효성 검사 파이프

import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true,}))
  await app.listen(3000);
}
bootstrap();

MySQL docker 설치

Docker run –name mysql-local -p 3306:3306/tcp -e MYSQL_ROOT_PASSWORD=testsecret -d mysql:8

docker 확인

docker ps

DB 클라이언트 툴 DBeaver.io

MySQL 8.0 부터는 퍼블릭키 등록을 허용해줘야 함

Config -> connection settings -> Driver properties -> allowPublicKeyRetrieval = TRUE
DB 생성시 charset utf8mb4 , collation utf8mb4_unicode_ci

TypeORM 으로 DB 연결

npm i typeorm@0.3.7 @nestjs/typeorm@9.0.0 mysql2

@Module({
  imports: [
    UsersModule,
TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DATABASE_HOST, // 'localhost',
      port: 3306,
      username: process.env.DATABASE_USERNAME, // 'root',
      password: process.env.DATABASE_PASSWORD, // 'testsecret',
      database: 'test',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: process.env.DATABASE_SYNCHRONIZE === 'true', // 시작할 때마다 DB 초기화 옵션
      migrations: [__dirname + '/**/migrations/*.js'],
      migrationsTableName: 'migrations',
    }),
  ],
  controllers: [],
  providers: [],
})

DB 엔터티 예제 – 테이블의 정의

import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('User')
export class UserEntity {
  @PrimaryColumn()
  id: string;

  @Column({ length: 30 })
  name: string;

  @Column({ length: 60 })
  email: string;

  @Column({ length: 30 })
  password: string;

  @Column({ length: 60 })
  signupVerifyToken: string;
}

DB 사용 예제

import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
@InjectRepository(UserEntity) private usersRepository: Repository<UserEntity>, private dataSource: DataSource,
) { }

  async createUser(name: string, email: string, password: string) {
    const signupVerifyToken = uuid.v1();
await this.saveUserUsingTransaction(name, email, password, signupVerifyToken);
}

private async saveUserUsingTransaction(name: string, email: string, password: string, signupVerifyToken: string) {
    await this.dataSource.transaction(async manager => {
      const user = new UserEntity();
      user.id = ulid();
      user.name = name;
      user.email = email;
      user.password = password;
      user.signupVerifyToken = signupVerifyToken;
      await manager.save(user);
})
}

랜덤스트링 생성 라이브러리

npm i ulid 

DB 셀렉트 예제

private async checkUserExists(emailAddress: string): Promise<boolean> {
    const user = await this.usersRepository.findOne({
      where: {
        email: emailAddress
      }
    });

    return user !== null;
}

DB 마이그레이션 – 추가 검토 필요

Typeorm cli 실행을 위해 ts-node 패키지 설치

npm i -g ts-node

NestJS 는 인증을 가드를 이용 권장

