import {
  NOTIFICATIONS_SERVICE_NAME,
  NotificationsServiceClient,
} from '@app/common';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientGrpc } from '@nestjs/microservices';
import Stripe from 'stripe';
import { PaymentsCreateChargeDto } from './dto/payments-create-charge.dto';

@Injectable()
export class PaymentsService {
  private notificationsService: NotificationsServiceClient;
  private readonly stripe = new Stripe(
    this.configService.get('STRIPE_SECRET_KEY'),
    {},
  );

  constructor(
    private readonly configService: ConfigService,
    @Inject(NOTIFICATIONS_SERVICE_NAME)
    private readonly client: ClientGrpc,
  ) {}

  async createCharge({
    token,
    paymentMethodId,
    amount,
    email,
  }: PaymentsCreateChargeDto) {
    let paymentMethod;

    if (token) {
      // Test mode: use Stripe's test tokens
      paymentMethod = await this.stripe.paymentMethods.create({
        type: 'card',
        card: { token },
      });
    } else if (paymentMethodId) {
      // Production mode: payment method from frontend (Stripe Elements)
      paymentMethod = { id: paymentMethodId };
    } else {
      throw new Error(
        'Provide either a test token (dev) or paymentMethodId (prod)',
      );
    }

    const paymentIntent = await this.stripe.paymentIntents.create({
      payment_method: paymentMethod.id,
      amount: amount * 100,
      currency: 'usd',
      confirm: true,
      payment_method_types: ['card'],
    });

    if (!this.notificationsService) {
      this.notificationsService =
        this.client.getService<NotificationsServiceClient>(
          NOTIFICATIONS_SERVICE_NAME,
        );
      if (!this.notificationsService) {
        throw new Error('NotificationsServiceClient is not initialized');
      }
    }

    this.notificationsService
      .notifyEmail({
        email,
        text: `Your payment of $${amount} has completed successfully.`,
      })
      .subscribe(() => {});

    return paymentIntent;
  }
}
