import { Controller, UsePipes, ValidationPipe } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { EventPattern, Payload } from '@nestjs/microservices';
import { NotifyEmailDto } from './dto/notify-emil.dto';

@Controller()
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @UsePipes(new ValidationPipe())
  @EventPattern('notify-email')
  async notifyEmail(@Payload() data: NotifyEmailDto) {
    console.log('Received email notification data:', data);
    return this.notificationService.notifyEmail(data);
  }
}
