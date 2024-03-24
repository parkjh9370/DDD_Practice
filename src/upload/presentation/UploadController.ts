import { Request, Response } from 'express';
import { Controller, Post, UseFilters, Req, Res, HttpStatus, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiOkResponse, ApiBadRequestResponse, ApiInternalServerErrorResponse } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

import { AllExceptionsFilter } from 'src/shared/filters/AllExceptionsFilter';
import { ControllerResponseOnError } from 'src/shared/core/presentation/ControllerResponse';
import { UploadFileUseCase } from '../application/UploadFileUseCase/UploadFileUseCase';
import { UploadControllerUploadResponse } from './dto/UploadControllerUploadResponse';

@ApiTags('Upload')
@Controller('uploads')
export class UploadController {
  constructor(
    private readonly uploadFileUseCase: UploadFileUseCase, //
  ) {}

  @Post()
  @UseFilters(AllExceptionsFilter)
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: '파일 및 사진 업로드' })
  @ApiOkResponse({ type: UploadControllerUploadResponse, description: '성공' })
  @ApiBadRequestResponse({ type: ControllerResponseOnError, description: '요청 오류' })
  @ApiInternalServerErrorResponse({ type: ControllerResponseOnError, description: '서버 오류' })
  async upload(
    @UploadedFile() file: Express.Multer.File, //
    @Req() request: Request,
    @Res() response: Response,
  ) {
    const { fileUrl } = await this.uploadFileUseCase.execute({
      buffer: file.buffer,
      contentType: file.mimetype,
    });

    response.status(HttpStatus.OK).send({
      statusCode: HttpStatus.OK,
      timestamp: new Date().toISOString(),
      path: request.url,
      result: {
        fileUrl: fileUrl,
      },
    });
    try {
    } catch (error) {
      throw error;
    }
  }
}
