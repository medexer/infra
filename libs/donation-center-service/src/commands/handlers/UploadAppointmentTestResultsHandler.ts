import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UploadTestResultsCommand } from '../impl';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AppLogger } from 'libs/common/src/logger/logger.service';
import { AppointmentStatus } from 'libs/common/src/constants/enums';
import { Appointment } from 'libs/common/src/models/appointment.model';
import modelsFormatter from 'libs/common/src/middlewares/models.formatter';
import { ConflictException, Inject, NotFoundException } from '@nestjs/common';
import { MedicalHistory } from 'libs/common/src/models/medical.history.model';
import { DonationCenterAppointmentInfo } from 'libs/common/src/models/appointment.model';

@CommandHandler(UploadTestResultsCommand)
export class UploadAppointmentTestResultsHandler
  implements
    ICommandHandler<
      UploadTestResultsCommand,
      DonationCenterAppointmentInfo
    >
{
  constructor(
    @Inject('Logger') private readonly logger: AppLogger,
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
    @InjectRepository(MedicalHistory)
    private readonly medicalHistoryRepository: Repository<MedicalHistory>,
  ) {}

  async execute(command: UploadTestResultsCommand) {
    try {
      this.logger.log(`[UPLOAD-APPOINTMENT-TEST-RESULTS-HANDLER-PROCESSING]`);

      const {appointmentId, payload, secureUser } = command;

      const appointment = await this.appointmentRepository.findOne({
        where: {
          id: appointmentId,
        },
        relations: ['donor', 'donation_center', 'donation_center.account'],
      });

      if (!appointment) {
        throw new NotFoundException('Appointment not found');
      }

      const medicalHistoryExists = await this.medicalHistoryRepository.findOne({
        where: {
          appointment: {
            id: appointmentId,
          },
        },
        relations: ['appointment'],
      });

      if (medicalHistoryExists) {
        throw new ConflictException('Medical history already exists');
      }

      const medicalHistory = await this.medicalHistoryRepository.create({
        bloodGroup: payload.bloodGroup,
        genotype: payload.genotype,
        hiv1: payload.hiv1,
        hiv2: payload.hiv2,
        hepatitisB: payload.hepatitisB,
        hepatitisC: payload.hepatitisC,
        syphilis: payload.syphilis,
        account: appointment.donor,
        appointment: appointment,
      });

      await this.medicalHistoryRepository.save(medicalHistory);

      Object.assign(appointment, {
        testResultsUploadedAt: new Date(),
        status: AppointmentStatus.COMPLETED,
      });

      const updatedAppointment =
        await this.appointmentRepository.save(appointment);

      this.logger.log(`[UPLOAD-APPOINTMENT-TEST-RESULTS-HANDLER-SUCCESS]`);

      return modelsFormatter.FormatDonationCenterAppointment(
        updatedAppointment,
      );
    } catch (error) {
      this.logger.log(`[UPDATE-APPOINTMENT-STATUS-HANDLER-ERROR] :: ${error}`);

      throw error;
    }
  }
}
