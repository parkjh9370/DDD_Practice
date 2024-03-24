import { Request, Response } from 'express';
import { Body, Controller, Post, UseFilters, Req, Res, HttpStatus, UseGuards, BadRequestException, Param, Delete } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiBadRequestResponse, ApiInternalServerErrorResponse, ApiCreatedResponse, ApiNoContentResponse } from '@nestjs/swagger';

import { AllExceptionsFilter } from 'src/shared/filters/AllExceptionsFilter';
import { ControllerResponseOnError } from 'src/shared/core/presentation/ControllerResponse';
import { JwtAuthGuard } from 'src/shared/guards/JwtAuthGuard';
import { CurrentUser } from 'src/shared/decorators/UserDecorator';

import { CreateChatUseCase } from '../application/CreateChatUseCase/CreateChatUseCase';
import { CreateChatReplyUseCase } from './../application/CreateChatReplyUseCase/CreateChatReplyUseCase';
import { DeleteChatReplyUseCase } from '../application/DeleteChatReplyUseCase/DeleteChatReplyUseCase';
import { DeleteChatUseCase } from './../application/DeleteChatUseCase/DeleteChatUseCase';
import { ChatControllerCreateRequestBody } from './dto/ChatControllerCreateRequestBody';
import { ChatControllerRequestParams } from './dto/ChatControllerRequestParams';
import { ChatControllerCreateChatReplyResponse, ChatControllerCreateChatResponse } from './dto/ChatControllerCreateResponse';

@ApiTags('Chat')
@Controller('space/:spaceId/posts/:postId/chats')
export class ChatController {
  constructor(
    private readonly createChatUseCase: CreateChatUseCase,
    private readonly createChatReplyUseCase: CreateChatReplyUseCase,
    private readonly deleteChatUseCase: DeleteChatUseCase,
    private readonly deleteChatReplyUseCase: DeleteChatReplyUseCase,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard('access'))
  @UseFilters(AllExceptionsFilter)
  @ApiOperation({ summary: 'Chat 등록(생성)' })
  @ApiCreatedResponse({ type: ChatControllerCreateChatResponse, description: '성공' })
  @ApiBadRequestResponse({ type: ControllerResponseOnError, description: '요청 오류' })
  @ApiInternalServerErrorResponse({ type: ControllerResponseOnError, description: '서버 오류' })
  async createChat(
    @CurrentUser() _userId: number, //
    @Body() body: ChatControllerCreateRequestBody,
    @Param() param: ChatControllerRequestParams,
    @Req() request: Request,
    @Res() response: Response,
  ) {
    try {
      if (!body.contents || body.isAnonymous === undefined || !param.postId) {
        throw new BadRequestException('필수값이 누락되었습니다.');
      }

      const application = await this.createChatUseCase.execute({
        userId: _userId,
        postId: Number(param.postId),
        contents: body.contents,
        isAnonymous: body.isAnonymous,
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

  @Post(':id/reply')
  @UseGuards(JwtAuthGuard('access'))
  @UseFilters(AllExceptionsFilter)
  @ApiOperation({ summary: 'Chat Reply 등록(생성)' })
  @ApiCreatedResponse({ type: ChatControllerCreateChatReplyResponse, description: '성공' })
  @ApiBadRequestResponse({ type: ControllerResponseOnError, description: '요청 오류' })
  @ApiInternalServerErrorResponse({ type: ControllerResponseOnError, description: '서버 오류' })
  async createChatReply(
    @CurrentUser() _userId: number, //
    @Param() param: ChatControllerRequestParams,
    @Body() body: ChatControllerCreateRequestBody,
    @Req() request: Request,
    @Res() response: Response,
  ) {
    try {
      if (!param.id || !param.postId || !body.contents || body.isAnonymous === undefined) {
        throw new BadRequestException('필수값이 누락되었습니다.');
      }

      const application = await this.createChatReplyUseCase.execute({
        userId: _userId,
        chatId: Number(param.id),
        postId: Number(param.postId),
        contents: body.contents,
        isAnonymous: body.isAnonymous,
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

  @Delete(':id')
  @UseGuards(JwtAuthGuard('access'))
  @ApiOperation({ summary: '댓글(Chat) 삭제' })
  @ApiNoContentResponse({ description: '성공' })
  @ApiBadRequestResponse({ type: ControllerResponseOnError, description: '요청 오류' })
  @ApiInternalServerErrorResponse({ type: ControllerResponseOnError, description: '서버 오류' })
  async deleteChat(
    @CurrentUser() _userId: number, //
    @Param() param: ChatControllerRequestParams,
    @Req() request: Request,
    @Res() response: Response,
  ) {
    try {
      if (!param.id || !param.spaceId) {
        throw new BadRequestException('필수값이 누락되었습니다.');
      }

      await this.deleteChatUseCase.execute({
        userId: _userId,
        chatId: Number(param.id),
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

  @Delete('/:id/reply/:replyId')
  @UseGuards(JwtAuthGuard('access'))
  @ApiOperation({ summary: '댓글 답글(ChatReply) 삭제' })
  @ApiNoContentResponse({ description: '성공' })
  @ApiBadRequestResponse({ type: ControllerResponseOnError, description: '요청 오류' })
  @ApiInternalServerErrorResponse({ type: ControllerResponseOnError, description: '서버 오류' })
  async deleteChatReply(
    @CurrentUser() _userId: number, //
    @Param() param: ChatControllerRequestParams,
    @Req() request: Request,
    @Res() response: Response,
  ) {
    try {
      if (!param.id || !param.spaceId || !param.replyId) {
        throw new BadRequestException('필수값이 누락되었습니다.');
      }

      await this.deleteChatReplyUseCase.execute({
        userId: _userId,
        spaceId: Number(param.spaceId),
        chatReplyId: Number(param.replyId),
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
