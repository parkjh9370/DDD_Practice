import { Request, Response } from 'express';
import { Body, Controller, Post, UseFilters, Req, Res, HttpStatus, UseGuards, Get } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiOkResponse, ApiBadRequestResponse, ApiInternalServerErrorResponse } from '@nestjs/swagger';

import { config } from 'src/config/config';
import { AllExceptionsFilter } from 'src/shared/filters/AllExceptionsFilter';
import { ControllerResponseOnError } from 'src/shared/core/presentation/ControllerResponse';
import { CurrentUser } from 'src/shared/decorators/UserDecorator';
import { JwtAuthGuard } from 'src/shared/guards/JwtAuthGuard';
import { SignInUseCase } from '../application/SignInUseCase/SignInUseCase';
import { IssueTokenUseCase } from '../application/IssueTokenUseCase/IssueTokenUseCase';
import { UserControllerSignInResponse } from './dto/AuthControllerSignInResponse';
import { AuthControllerSignInRequestBody } from './dto/AuthControllerSignInRequestBody';
import { AuthControllerReIssuanceTokenResponse } from './dto/AuthControllerReIssuanceTokenResponse';

@ApiTags('Auth')
@Controller('auth')
@UseFilters(AllExceptionsFilter)
export class AuthController {
  constructor(
    private readonly signInUseCase: SignInUseCase,
    private readonly issueTokenUseCase: IssueTokenUseCase,
  ) {}

  @Post('sign-in')
  @ApiOperation({ summary: '로그인' })
  @ApiOkResponse({ type: UserControllerSignInResponse, description: '성공' })
  @ApiBadRequestResponse({ type: ControllerResponseOnError, description: '요청 오류' })
  @ApiInternalServerErrorResponse({ type: ControllerResponseOnError, description: '서버 오류' })
  async signIn(
    @Body() body: AuthControllerSignInRequestBody, //
    @Req() request: Request,
    @Res() response: Response,
  ) {
    try {
      const { email, password } = body;

      const { accessToken, refreshToken } = await this.signInUseCase.execute({
        email: email,
        password: password,
      });

      if (config.NODE_ENV === 'production') {
        // NOTE: 배포 환경에서 각 domain값 세팅해주기
        response.setHeader('set-Cookie', `refreshToken=${refreshToken}; path=/; domain=.mybacksite.com; SameSite=None; Secure; httpOnly`);
        response.setHeader('Access-Control-Allow-Origin', 'https://myfrontsite.com');
      } else {
        response.setHeader('set-Cookie', `refreshToken=${refreshToken}; path=/;`);
      }

      response.status(HttpStatus.OK).send({
        statusCode: HttpStatus.OK,
        timestamp: new Date().toISOString(),
        path: request.url,
        result: {
          accessToken: accessToken,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  @Get('re-issuance/token')
  @UseGuards(JwtAuthGuard('refresh'))
  @ApiOperation({ summary: '토큰 재발급' })
  @ApiOkResponse({ type: AuthControllerReIssuanceTokenResponse, description: '성공' })
  @ApiBadRequestResponse({ type: ControllerResponseOnError, description: '요청 오류' })
  @ApiInternalServerErrorResponse({ type: ControllerResponseOnError, description: '서버 오류' })
  async reIssuanceToken(
    @CurrentUser() _userId: number,
    @Req() request: Request,
    @Res() response: Response,
  ) {
    const { token: accessToken } = await this.issueTokenUseCase.execute({
      userId: _userId,
      secretKey: config.JWT.ACCESS_KEY,
      expiredIn: config.JWT.ACCESS_KEY_EXPIRED_IN,
    });

    response.status(HttpStatus.OK).send({
      statusCode: HttpStatus.OK,
      timestamp: new Date().toISOString(),
      path: request.url,
      result: {
        userId: _userId,
        accessToken: accessToken,
      },
    });
    try {
    } catch (error) {
      throw error;
    }
  }
}
