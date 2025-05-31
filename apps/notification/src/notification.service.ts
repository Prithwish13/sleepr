import { Injectable } from '@nestjs/common';
import { NotifyEmailDto } from './dto/notify-emil.dto';
import { Resend } from 'resend';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class NotificationService {
  constructor(private readonly configService: ConfigService) {}
  private readonly transporter = new Resend(
    this.configService.get<string>('RESEND_MAIL_KEY'),
  );
  async notifyEmail({ email, subject, text }: NotifyEmailDto) {
    const { data, error } = await this.transporter.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: [email],
      subject: subject || 'Welcome to Sleepr',
      html: `<strong>${text}</strong>`,
    });
    if (error) {
      throw new Error('Failed to send email');
    }
    return data;
  }
}
