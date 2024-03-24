import { Request, Response } from 'express';
import { Body, Controller, Post, UseFilters, Req, Res, HttpStatus, UseGuards, Get, Query, BadRequestException, Param, Put, Delete } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiOkResponse, ApiBadRequestResponse, ApiInternalServerErrorResponse, ApiCreatedResponse, ApiNoContentResponse } from '@nestjs/swagger';

import { AllExceptionsFilter } from 'src/shared/filters/AllExceptionsFilter';
import { JwtAuthGuard } from 'src/shared/guards/JwtAuthGuard';
import { ControllerResponseOnError } from 'src/shared/core/presentation/ControllerResponse';
import { CurrentUser } from 'src/shared/decorators/UserDecorator';
import { CreateSpaceUseCase } from '../application/CreateSpaceUseCase/CreateSpaceUseCase';
import { ParticipateInSpaceUseCase } from '../application/ParticipateInSpaceUseCase/ParticipateInSpaceUseCase';
import { UpdateSpaceUserRightsUseCase } from '../application/UpdateSpaceUserRightsUseCase/UpdateSpaceUserRightsUseCase';
import { DeleteSpaceUseCase } from '../application/DeleteSpaceUseCase/DeleteSpaceUseCase';
import { UpdateSpaceCreateUserUseCase } from '../application/UpdateSpaceCreateUserUseCase/UpdateSpaceCreateUserUseCase';
import { DeleteSpaceRoleUseCase } from '../application/DeleteSpaceRoleUseCase/DeleteSpaceRoleUseCase';
import { FindSpacePostsUseCase } from '../application/FindSpacePostsUseCase/FindSpacePostsUseCase';
import { FindOneSpaceUseCase } from '../application/FindOneSpaceUseCase/FindOneSpaceUseCase';
import { SpaceControllerRequestParams } from './dto/SpaceControllerRequestParams';
import { SpaceControllerCreateRequestBody } from './dto/SpaceControllerCreateRequestBody';
import { SpaceControllerParticipateRequestBody } from './dto/SpaceControllerParticipateRequestBody';
import { SpaceControllerRequestQuery } from './dto/SpaceControllerRequestQuery';
import { SpaceControllerGetPostsResponse } from './dto/SpaceControllerGetPostsResponse';
import { SpaceControllerCreateResponse } from './dto/SpaceControllerCreateResponse';

@ApiTags('Space')
@Controller('spaces')
@UseFilters(AllExceptionsFilter)
export class SpaceController {
  constructor(
    private readonly createSpaceUseCase: CreateSpaceUseCase, //
    private readonly participateInSpaceUseCase: ParticipateInSpaceUseCase,
    private readonly updateSpaceUserRightsUseCase: UpdateSpaceUserRightsUseCase,
    private readonly updateSpaceCreateUserUseCase: UpdateSpaceCreateUserUseCase,
    private readonly deleteSpaceUseCase: DeleteSpaceUseCase,
    private readonly deleteSpaceRoleUseCase: DeleteSpaceRoleUseCase,
    private readonly findSpacePostsUseCase: FindSpacePostsUseCase,
    private readonly findOneSpaceUseCase: FindOneSpaceUseCase,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard('access'))
  @UseFilters(AllExceptionsFilter)
  @ApiOperation({ summary: 'Space 생성' })
  @ApiCreatedResponse({ type: SpaceControllerCreateResponse, description: '성공' })
  @ApiBadRequestResponse({ type: ControllerResponseOnError, description: '요청 오류' })
  @ApiInternalServerErrorResponse({ type: ControllerResponseOnError, description: '서버 오류' })
  async create(
    @CurrentUser() _userId: number, //
    @Body() body: SpaceControllerCreateRequestBody,
    @Req() request: Request,
    @Res() response: Response,
  ) {
    try {
      const { name, logoImageUrl, roles } = body;

      if (!name || !logoImageUrl || !roles) {
        throw new BadRequestException('필수값이 누락되었습니다.');
      }

      const application = await this.createSpaceUseCase.execute({
        userId: _userId,
        name: name,
        logoImageUrl: logoImageUrl,
        roles: roles,
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

  @Put(':id/participants')
  @UseGuards(JwtAuthGuard('access'))
  @UseFilters(AllExceptionsFilter)
  @ApiOperation({ summary: 'Space 참가' })
  @ApiNoContentResponse({ description: '성공' })
  @ApiBadRequestResponse({ type: ControllerResponseOnError, description: '요청 오류' })
  @ApiInternalServerErrorResponse({ type: ControllerResponseOnError, description: '서버 오류' })
  async participate(
    @CurrentUser() _userId: number, //
    @Param() param: SpaceControllerRequestParams,
    @Body() body: SpaceControllerParticipateRequestBody,
    @Req() request: Request,
    @Res() response: Response,
  ) {
    try {
      if (!body.accessCode || !body.role) {
        throw new BadRequestException('필수값이 누락되었습니다.');
      }

      await this.participateInSpaceUseCase.execute({
        userId: _userId,
        spaceId: Number(param.id),
        accessCode: body.accessCode,
        role: body.role,
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

  @Get(':id/posts')
  @UseGuards(JwtAuthGuard('access'))
  @UseFilters(AllExceptionsFilter)
  @ApiOperation({ summary: 'Space(공간)내 Post(게시글) 조회' })
  @ApiOkResponse({ type: SpaceControllerGetPostsResponse, description: '성공' })
  @ApiBadRequestResponse({ type: ControllerResponseOnError, description: '요청 오류' })
  @ApiInternalServerErrorResponse({ type: ControllerResponseOnError, description: '서버 오류' })
  async getPosts(
    @CurrentUser() _userId: number, //
    @Param() param: SpaceControllerRequestParams, //
    @Req() request: Request,
    @Res() response: Response,
  ) {
    try {
      if (!param.id) {
        throw new BadRequestException('필수값이 누락되었습니다.');
      }

      const application = await this.findSpacePostsUseCase.execute({
        userId: _userId,
        spaceId: Number(param.id),
      });

      response.status(HttpStatus.OK).send({
        statusCode: HttpStatus.OK,
        timestamp: new Date().toISOString(),
        path: request.url,
        result: application.spacePosts,
      });
    } catch (error) {
      throw error;
    }
  }

  @Put(':id/grant-role/users/:userId')
  @UseGuards(JwtAuthGuard('access'))
  @ApiOperation({
    summary: '공간(Space) 구성원 권한 변경',
    description: '소유자 및 관리자 역할을 가진 경우 공간 구성원의 권한을 변경할 수 있다.',
  })
  @ApiNoContentResponse({ description: '성공' })
  @ApiBadRequestResponse({ type: ControllerResponseOnError, description: '요청 오류' })
  @ApiInternalServerErrorResponse({ type: ControllerResponseOnError, description: '서버 오류' })
  async updateSpaceUserRights(
    @CurrentUser() _userId: number, //
    @Param() param: SpaceControllerRequestParams,
    @Query() query: SpaceControllerRequestQuery,
    @Req() request: Request,
    @Res() response: Response,
  ) {
    const { id, userId } = param;
    const { rights } = query;

    if (!id || !userId || !rights) {
      throw new BadRequestException('필수값이 누락되었습니다.');
    }

    if (rights !== '1') {
      throw new BadRequestException('유효하지 못한 접근입니다.');
    }

    await this.updateSpaceUserRightsUseCase.execute({
      userId: _userId,
      spaceId: Number(id),
      toUpdateUserId: Number(userId),
      rights: true,
    });

    response.status(HttpStatus.NO_CONTENT).send({
      statusCode: HttpStatus.NO_CONTENT,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
    try {
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard('access'))
  @ApiOperation({ summary: '공간(Space) 삭제' })
  @ApiNoContentResponse({ description: '성공' })
  @ApiBadRequestResponse({ type: ControllerResponseOnError, description: '요청 오류' })
  @ApiInternalServerErrorResponse({ type: ControllerResponseOnError, description: '서버 오류' })
  async deleteSpace(
    @CurrentUser() _userId: number, //
    @Param() param: SpaceControllerRequestParams,
    @Req() request: Request,
    @Res() response: Response,
  ) {
    if (!param.id) {
      throw new BadRequestException('필수값이 누락되었습니다.');
    }

    await this.deleteSpaceUseCase.execute({
      userId: _userId,
      spaceId: Number(param.id),
    });

    response.status(HttpStatus.NO_CONTENT).send({
      statusCode: HttpStatus.NO_CONTENT,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
    try {
    } catch (error) {
      throw error;
    }
  }

  @Put(':id/assign-owner/users/:userId')
  @UseGuards(JwtAuthGuard('access'))
  @ApiOperation({
    summary: '공간(Space) 구성원 소유자 임명',
    description: '소유자 및 관리자 역할을 가진 경우 공간 구성원의 소유자로 임명할 수 있다.',
  })
  @ApiNoContentResponse({ description: '성공' })
  @ApiBadRequestResponse({ type: ControllerResponseOnError, description: '요청 오류' })
  @ApiInternalServerErrorResponse({ type: ControllerResponseOnError, description: '서버 오류' })
  async updateSpaceCreateUser(
    @CurrentUser() _userId: number, //
    @Param() param: SpaceControllerRequestParams,
    @Req() request: Request,
    @Res() response: Response,
  ) {
    const { id, userId } = param;

    if (!id || !userId) {
      throw new BadRequestException('필수값이 누락되었습니다.');
    }

    await this.updateSpaceCreateUserUseCase.execute({
      userId: _userId,
      spaceId: Number(id),
      toUpdateUserId: Number(userId),
    });

    response.status(HttpStatus.NO_CONTENT).send({
      statusCode: HttpStatus.NO_CONTENT,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
    try {
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id/space-role')
  @UseGuards(JwtAuthGuard('access'))
  @ApiOperation({ summary: '공간(Space) 역할 삭제' })
  @ApiNoContentResponse({ description: '성공' })
  @ApiBadRequestResponse({ type: ControllerResponseOnError, description: '요청 오류' })
  @ApiInternalServerErrorResponse({ type: ControllerResponseOnError, description: '서버 오류' })
  async deleteSpaceRole(
    @CurrentUser() _userId: number, //
    @Param() param: SpaceControllerRequestParams,
    @Query() query: SpaceControllerRequestQuery,
    @Req() request: Request,
    @Res() response: Response,
  ) {
    if (!param.id || !query.role) {
      throw new BadRequestException('필수값이 누락되었습니다.');
    }

    await this.deleteSpaceRoleUseCase.execute({
      userId: _userId,
      spaceId: Number(param.id),
      role: query.role,
    });

    response.status(HttpStatus.NO_CONTENT).send({
      statusCode: HttpStatus.NO_CONTENT,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
    try {
    } catch (error) {
      throw error;
    }
  }
}
