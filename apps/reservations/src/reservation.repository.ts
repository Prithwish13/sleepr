import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from '@app/common/database';
import { ReservationDocument } from './models/reservation.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ReservationRepository extends AbstractRepository<ReservationDocument> {
  protected logger: Logger;

  constructor(
    @InjectModel(ReservationDocument.name)
    private readonly reservationModel: Model<ReservationDocument>,
  ) {
    super(reservationModel);
    this.logger = new Logger(ReservationRepository.name);
  }
}
