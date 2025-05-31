import { Inject, Injectable } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationRepository } from './reservation.repository';
import { PAYMENT_SERVICE, UserDto } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { map } from 'rxjs';

@Injectable()
export class ReservationService {
  constructor(
    private readonly reservationRepository: ReservationRepository,
    @Inject(PAYMENT_SERVICE) private readonly paymentService: ClientProxy,
  ) {}

  async create(
    createReservationDto: CreateReservationDto,
    { _id: userId, email }: UserDto,
  ) {
    return this.paymentService
      .send('create-charge', { ...createReservationDto.charge, email })
      .pipe(
        map((response) => {
          console.log('Payment response:', response);
          return this.reservationRepository.create({
            ...createReservationDto,
            userId,
          });
        }),
      );
  }

  // async create(createReservationDto: CreateReservationDto, userId: string) {
  //   return this.paymentService
  //     .send('create-charge', {
  //       ...createReservationDto.charge,
  //     })
  //     .pipe(
  //       map((res) => {
  //         return this.reservationRepository.create({
  //           ...createReservationDto,
  //           invoiceId: res.id,
  //           // timestamp: new Date(),
  //           userId,
  //         });
  //       }),
  //     );
  // }

  // async create(createReservationDto: CreateReservationDto, userId: string) {
  //   try {
  //     const paymentResponse = await lastValueFrom(
  //       this.paymentService.send('create-charge', createReservationDto.charge),
  //     );

  //     return await this.reservationRepository.create({
  //       ...createReservationDto,
  //       userId,
  //       invoiceId: paymentResponse.id,
  //     });
  //   } catch (error) {
  //     // Handle payment or reservation creation errors
  //     // You can throw a custom exception or log the error
  //     throw error;
  //   }
  // }

  async findAll() {
    return this.reservationRepository.find({});
  }

  async findOne(id: string) {
    return this.reservationRepository.findOne({ _id: id });
  }

  async update(id: string, updateReservationDto: UpdateReservationDto) {
    return this.reservationRepository.findOneAndUpdate(
      { _id: id },
      { $set: updateReservationDto },
    );
  }

  async remove(id: string) {
    return this.reservationRepository.findOneAndDelete({ _id: id });
  }
}
