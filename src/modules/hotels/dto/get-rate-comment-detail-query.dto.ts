import {
  IsNotEmpty,
  IsString
} from 'class-validator';

export class GetRateCommentDetailQuery {
  @IsNotEmpty()
  @IsString()
  code: string;
}