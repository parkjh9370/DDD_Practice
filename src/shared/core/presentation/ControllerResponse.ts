import { ApiProperty } from '@nestjs/swagger';

export class ControllerResponseErrorObject {
  @ApiProperty({
    name: 'message',
    description: 'An error message',
    required: true,
  })
  message: string;

  @ApiProperty({
    name: 'stack',
    type: Array,
    description: 'An error stack (local environment only)',
    required: true,
  })
  stack: string[];

  @ApiProperty({
    name: 'incidentReported',
    type: Boolean,
    description: 'An error incident has reported',
    required: true,
  })
  incidentReported: boolean;

  @ApiProperty({
    name: 'incidentReportedTo',
    type: String,
    description: 'A channel where error incident has been reported',
    required: false,
  })
  incidentReportedTo: string;
}

export class ControllerResponse {
  @ApiProperty({
    name: 'statusCode',
    description: 'HTTP status code',
    required: true,
  })
  statusCode: number;

  @ApiProperty({
    name: 'timestamp',
    description: 'Response timestamp (ISO)',
    required: true,
  })
  timestamp: string;

  @ApiProperty({
    name: 'path',
    description: 'Requested path',
    required: true,
  })
  path: string;
}

export class ControllerResponseOnError extends ControllerResponse {
  @ApiProperty({
    type: ControllerResponseErrorObject,
  })
  error: ControllerResponseErrorObject;
}
