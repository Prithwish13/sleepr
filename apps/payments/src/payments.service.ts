import { NOTIFICATION_SERVICE } from '@app/common';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import { map } from 'rxjs';
import Stripe from 'stripe';
import { PaymentsCreateChargeDto } from './dto/payment-create-charge.dto';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly configService: ConfigService,
    @Inject(NOTIFICATION_SERVICE)
    private readonly notificationService: ClientProxy,
  ) {}

  private readonly stripe = new Stripe(
    this.configService.get('STRIPE_SECRET_KEY'),
  );

  async createCharge({ amount, email }: PaymentsCreateChargeDto) {
    // const paymentMethod = await this.stripe.paymentMethods.create({
    //   type: 'card',
    //   card: {
    //     number: card.number,
    //     exp_month: card.exp_month,
    //     exp_year: card.exp_year,
    //     cvc: card.cvc,
    //     token: card.token,
    //   },
    // });

    this.notificationService
      .emit('notify-email', {
        email,
        subject: 'Payment Successful',
        text: `Your payment of ₹${amount} has been successfully processed.`,
      })
      .pipe(
        map((response) => {
          console.log('Notification sent successfully:', response);
          return response;
        }),
      );

    const paymentIntent = this.stripe.paymentIntents.create({
      payment_method: 'pm_card_visa',
      amount: amount * 100,
      confirm: true,
      payment_method_types: ['card'],
      currency: 'INR',
      description: 'Test charge',
      shipping: {
        name: 'Jenny Rosen',
        address: {
          line1: '510 Townsend St',
          postal_code: '98140',
          city: 'San Francisco',
          state: 'CA',
          country: 'US',
        },
      },
    });

    return paymentIntent;
  }
}
