import { Request, Response } from 'express';
import { Body, Controller, Post, UseFilters, Req, Res, HttpStatus, UseGuards, BadRequestException, Param, Delete, Get } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiBadRequestResponse, ApiInternalServerErrorResponse, ApiCreatedResponse, ApiNoContentResponse, ApiOkResponse } from '@nestjs/swagger';

import { JwtAuthGuard } from 'src/shared/guards/JwtAuthGuard';
import { AllExceptionsFilter } from 'src/shared/filters/AllExceptionsFilter';
import { CreatePostUseCase } from '../application/CreatePostUseCase/CreatePostUseCase';
import { DeletePostUseCase } from '../application/DeletePostUseCase/DeletePostUseCase';
import { FindPostChatsUseCase } from '../application/FindPostChatsUseCase/FindPostChatsUseCase';
import { ControllerResponseOnError } from 'src/shared/core/presentation/ControllerResponse';
import { PostControllerCreateRequestBody } from './dto/PostControllerCreateRequestBody';
import { CurrentUser } from 'src/shared/decorators/UserDecorator';
import { PostControllerRequestParams } from './dto/PostControllerRequestParams';
import { PostControllerCreateResponse } from './dto/PostControllerCreateResponse';
import { PostControllerGetChatListResponse } from './dto/PostControllerGetChatListResponse';

@ApiTags('Post')
@Controller('space/:spaceId/posts')
export class PostController {
  constructor(
    private readonly createPostUseCase: CreatePostUseCase, //
    private readonly findPostChatsUseCase: FindPostChatsUseCase,
    private readonly deletePostUseCase: DeletePostUseCase,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard('access'))
  @UseFilters(AllExceptionsFilter)
  @ApiOperation({ summary: 'Post 등록(생성)' })
  @ApiCreatedResponse({ type: PostControllerCreateResponse, description: '성공' })
  @ApiBadRequestResponse({ type: ControllerResponseOnError, description: '요청 오류' })
  @ApiInternalServerErrorResponse({ type: ControllerResponseOnError, description: '서버 오류' })
  async create(
    @CurrentUser() _userId: number, //
    @Body() body: PostControllerCreateRequestBody,
    @Param() param: PostControllerRequestParams,
    @Req() request: Request,
    @Res() response: Response,
  ) {
    try {
      const { name, type, contents, isAnonymous, fileUrls } = body;
      const { spaceId } = param;

      if (!name || !type || !contents || isAnonymous === undefined) {
        throw new BadRequestException('필수값이 누락되었습니다.');
      }

      const application = await this.createPostUseCase.execute({
        userId: _userId,
        spaceId: Number(spaceId),
        name: name,
        type: type,
        contents: contents,
        isAnonymous: isAnonymous,
        fileUrls: fileUrls,
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

  @Get(':id/chats')
  @UseGuards(JwtAuthGuard('access'))
  @UseFilters(AllExceptionsFilter)
  @ApiOperation({ summary: 'Post(게시글) 내 댓글 조회' })
  @ApiOkResponse({ type: PostControllerGetChatListResponse, description: '성공' })
  @ApiBadRequestResponse({ type: ControllerResponseOnError, description: '요청 오류' })
  @ApiInternalServerErrorResponse({ type: ControllerResponseOnError, description: '서버 오류' })
  async getChatList(
    @CurrentUser() _userId: number, //
    @Param() param: PostControllerRequestParams,
    @Req() request: Request,
    @Res() response: Response,
  ) {
    try {
      if (!param.spaceId || !param.id) {
        throw new BadRequestException('필수값이 누락되었습니다.');
      }

      const application = await this.findPostChatsUseCase.execute({
        userId: _userId,
        id: Number(param.id),
        spaceId: Number(param.spaceId),
      });

      response.status(HttpStatus.OK).send({
        statusCode: HttpStatus.OK,
        timestamp: new Date().toISOString(),
        path: request.url,
        result: application.postChats,
      });
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard('access'))
  @ApiOperation({ summary: '게시글(Post) 삭제' })
  @ApiNoContentResponse({ description: '성공' })
  @ApiBadRequestResponse({ type: ControllerResponseOnError, description: '요청 오류' })
  @ApiInternalServerErrorResponse({ type: ControllerResponseOnError, description: '서버 오류' })
  async deletePost(
    @CurrentUser() _userId: number, //
    @Param() param: PostControllerRequestParams,
    @Req() request: Request,
    @Res() response: Response,
  ) {
    try {
      if (!param.id || !param.spaceId) {
        throw new BadRequestException('필수값이 누락되었습니다.');
      }

      await this.deletePostUseCase.execute({
        userId: _userId,
        postId: Number(param.id),
        spaceId: Number(param.spaceId),
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
