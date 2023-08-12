import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
@Injectable()
export class MailSenderService {
  private transporter: nodemailer.Transporter;

  public constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.get('EMAIL'),
        pass: this.configService.get('PASSWORD'),
      },
    });
  }

  public async sendEmail(to: string, subject: string, text: string): Promise<any> {
    const mailOptions: nodemailer.SendMailOptions = {
      from: this.configService.get('EMAIL'),
      to,
      subject,
      text,
    };
    await this.transporter.sendMail(mailOptions);
  }
}
