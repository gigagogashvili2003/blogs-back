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

      // auth: {
      //   type: 'OAuth2',
      //   user: this.configService.get('EMAIL'),

      //   clientSecret: this.configService.get('OAUTH_CLIENT_SECRET'),
      //   clientId: this.configService.get('OAUTH_CLIENT_ID'),
      //   refreshToken: this.configService.get('OAUTH_REFRESH_TOKEN'),
      //   accessToken: this.configService.get('OAUTH_ACCESS_TOKEN'),
      // },
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
