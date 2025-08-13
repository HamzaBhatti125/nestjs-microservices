import { Type } from 'class-transformer';
import {
  IsDefined,
  IsNotEmptyObject,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CardDto } from './card.dto';

export class CreateChargeDto {
  @IsDefined()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => CardDto)
  @IsOptional()
  card?: CardDto;

  @IsString()
  @IsOptional()
  token?: string; // Stripe test token

  @IsNumber()
  amount: number;

  @IsString()
  @IsOptional()
  paymentMethodId?: string; // Optional, for future use
}
