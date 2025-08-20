import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateChargeDto {
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  token?: string; // Stripe test token

  @IsNumber()
  @Field(() => Number)
  amount: number;

  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  paymentMethodId?: string; // Optional, for future use
}
