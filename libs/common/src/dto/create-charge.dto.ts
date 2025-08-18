import { IsNumber, IsOptional, IsString } from 'class-validator';
import { CreateChargeMessage } from '../types';

export class CreateChargeDto implements Omit<CreateChargeMessage, 'email'> {
  @IsString()
  token: string; // Stripe test token

  @IsNumber()
  amount: number;

  @IsString()
  @IsOptional()
  paymentMethodId?: string; // Optional, for future use
}
