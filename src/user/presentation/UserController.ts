import { Request, Response } from 'express';
import { Body, Controller, Post, UseFilters, Req, Res, HttpStatus, UseGuards, Get, BadRequestException, Param, Put } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiOkResponse, ApiBadRequestResponse, ApiInternalServerErrorResponse, ApiCreatedResponse, ApiNoContentResponse } from '@nestjs/swagger';

import { AllExceptionsFilter } from 'src/shared/filters/AllExceptionsFilter';
import { ControllerResponseOnError } from 'src/shared/core/presentation/ControllerResponse';
import { AdminAuthorizationGuard } from 'src/shared/guards/AdminAuthorizationGuard';
import { JwtAuthGuard } from 'src/shared/guards/JwtAuthGuard';
import { CurrentUser } from 'src/shared/decorators/UserDecorator';
import { CreateUserUseCase } from '../application/CreateUserUseCase/CreateUserUseCase';
import { FindOneUserUseCase } from '../application/FindOneUserUseCase/FindOneUserUseCase';
import { UpdateUserUseCase } from '../application/UpdateUserUseCase/UpdateUserUseCase';
import { UserControllerSignUpRequestBody } from './dto/UserControllerSignUpRequestBody';
import { UserControllerSignUpResponse } from './dto/UserControllerSignUpResponse';
import { UserControllerRequestParams } from './dto/UserControllerRequestParams';
import { UserControllerFindOneResponse } from './dto/UserControllerFindOneResponse';
import { UserControllerFindMeResponse } from './dto/UserControllerFindMeResponse';
import { UserControllerUpdateRequestBody } from './dto/UserControllerUpdateRequestBody';
import { UserControllerGetParticipatingSpaceListResponse } from './dto/UserControllerGetParticipatingSpaceListResponse';
import { UserControllerGetChatListResponse } from './dto/UserControllerGetChatListResponse';
import { UserControllerGetPostListResponse } from './dto/UserControllerGetPostListResponse';

@ApiTags('User')
@Controller('users')
@UseFilters(AllExceptionsFilter)
export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly findOneUserUseCase: FindOneUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
  ) {}

  @Post('admin/sign-up')
  @UseGuards(AdminAuthorizationGuard)
  @ApiOperation({
    summary: '관리자 회원가입',
    description: `
    ** 관리자 유저 등록 방법 ** \n
    - Header의 Key: accesskey에 해당하는 Value: {accessKey}와 함께 요청 \n
    - Body에 추가적으로 isAdminUser: true 값과 함께 요청(테스트 유저 만들 시에는 false 값)\n
    `,
  })
  @ApiCreatedResponse({ type: UserControllerSignUpResponse, description: '성공' })
  @ApiBadRequestResponse({ type: ControllerResponseOnError, description: '요청 오류' })
  @ApiInternalServerErrorResponse({ type: ControllerResponseOnError, description: '서버 오류' })
  async adminSignUp(
    @Body() body: UserControllerSignUpRequestBody,
    @Req() request: Request,
    @Res() response: Response,
  ) {
    try {
      const application = await this.createUserUseCase.execute({
        email: body.email,
        password: body.password,
        lastName: body.lastName,
        firstName: body.firstName,
        profileImageUrl: body.profileImageUrl ?? '',
        isAdminUser: body.isAdminUser,
      });

      response.status(HttpStatus.CREATED).send({
        statusCode: HttpStatus.CREATED,
        timestamp: new Date().toISOString(),
        path: request.url,
        result: {
          id: application.id,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  @Post('sign-up')
  @ApiOperation({ summary: '회원가입' })
  @ApiCreatedResponse({ type: UserControllerSignUpResponse, description: '성공' })
  @ApiBadRequestResponse({ type: ControllerResponseOnError, description: '요청 오류' })
  @ApiInternalServerErrorResponse({ type: ControllerResponseOnError, description: '서버 오류' })
  async signUp(
    @Body() body: UserControllerSignUpRequestBody,
    @Req() request: Request,
    @Res() response: Response,
  ) {
    try {
      if (body.isAdminUser) {
        throw new BadRequestException('유효한 접근이 아닙니다.');
      }

      const { email, password, lastName, firstName } = body;

      if (!email || !password || !lastName || !firstName) {
        throw new BadRequestException('필수값 정보가 누락되었습니다.');
      }

      const application = await this.createUserUseCase.execute({
        email: body.email,
        password: body.password,
        lastName: body.lastName,
        profileImageUrl: body.profileImageUrl ?? '',
        firstName: body.firstName,
      });

      response.status(HttpStatus.CREATED).send({
        statusCode: HttpStatus.CREATED,
        timestamp: new Date().toISOString(),
        path: request.url,
        result: {
          id: application.id,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  @Get(':id/search')
  @UseGuards(JwtAuthGuard('access'))
  @UseFilters(AllExceptionsFilter)
  @ApiOperation({ summary: '다른 유저 프로필 조회(이메일 제외)' })
  @ApiOkResponse({ type: UserControllerFindOneResponse, description: '성공' })
  @ApiBadRequestResponse({ type: ControllerResponseOnError, description: '요청 오류' })
  @ApiInternalServerErrorResponse({ type: ControllerResponseOnError, description: '서버 오류' })
  async findOne(
    @Param() param: UserControllerRequestParams,
    @Req() request: Request,
    @Res() response: Response,
  ) {
    try {
      if (!param.id) {
        throw new BadRequestException('필수값이 누락되었습니다.');
      }

      const { user } = await this.findOneUserUseCase.execute({
        id: Number(param.id),
      });

      response.status(HttpStatus.OK).send({
        statusCode: HttpStatus.OK,
        timestamp: new Date().toISOString(),
        path: request.url,
        result: {
          name: user.fullName,
          lastName: user.lastName,
          firstName: user.firstName,
          profileImageUrl: user.profileImageUrl,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  @Get()
  @UseGuards(JwtAuthGuard('access'))
  @UseFilters(AllExceptionsFilter)
  @ApiOperation({ summary: '내 프로필 조회' })
  @ApiOkResponse({ type: UserControllerFindMeResponse, description: '성공' })
  @ApiBadRequestResponse({ type: ControllerResponseOnError, description: '요청 오류' })
  @ApiInternalServerErrorResponse({ type: ControllerResponseOnError, description: '서버 오류' })
  async findMe(
    @CurrentUser() userId: number,
    @Req() request: Request,
    @Res() response: Response,
  ) {
    try {
      const { user } = await this.findOneUserUseCase.execute({
        id: userId,
      });

      response.status(HttpStatus.OK).send({
        statusCode: HttpStatus.OK,
        timestamp: new Date().toISOString(),
        path: request.url,
        result: {
          lastName: user.lastName,
          firstName: user.firstName,
          email: user.email,
          profileImageUrl: user.profileImageUrl,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard('access'))
  @ApiOperation({ summary: '내 프로필 수정' })
  @ApiNoContentResponse({ description: '성공' })
  @ApiBadRequestResponse({ type: ControllerResponseOnError, description: '요청 오류' })
  @ApiInternalServerErrorResponse({ type: ControllerResponseOnError, description: '서버 오류' })
  async update(
    @CurrentUser() _userId: number,
    @Body() body: UserControllerUpdateRequestBody,
    @Param() param: UserControllerRequestParams,
    @Req() request: Request,
    @Res() response: Response,
  ) {
    try {
      const { profileImageUrl, lastName, firstName } = body;

      if (!profileImageUrl || !lastName || !firstName || !param) {
        throw new BadRequestException('필수값이 누락되었습니다.');
      }

      if (_userId !== Number(param.id)) {
        throw new BadRequestException('유효하지 못한 접근입니다.');
      }

      await this.updateUserUseCase.execute({
        id: _userId,
        lastName: lastName,
        firstName: firstName,
        profileImageUrl: profileImageUrl,
      });

      response.status(HttpStatus.NO_CONTENT).send({
        statusCode: HttpStatus.NO_CONTENT,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
    } catch (error) {
      throw error;
    }
  }
}
