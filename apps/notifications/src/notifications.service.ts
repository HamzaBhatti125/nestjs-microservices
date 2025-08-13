import { Injectable } from '@nestjs/common';
import { NotifyEmailDto } from './dto/notify-email.dto';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class NotificationsService {
  constructor(private readonly configService: ConfigService) {}

  private createTransporter() {
    // First try OAuth2, if that fails, try App Password method
    try {
      return nodemailer.createTransport({
        service: 'gmail',
        auth: {
          type: 'OAuth2',
          user: this.configService.get('SMTP_USER'),
          clientId: this.configService.get('GOOGLE_OAUTH_CLIENT_ID'),
          clientSecret: this.configService.get('GOOGLE_OAUTH_CLIENT_SECRET'),
          refreshToken: this.configService.get('GOOGLE_OAUTH_REFRESH_TOKEN'),
        },
        // Add timeout settings for Docker environment
        // connectionTimeout: 60000, // 60 seconds
        // greetingTimeout: 30000, // 30 seconds
        // socketTimeout: 60000, // 60 seconds
      });
    } catch (error) {
      console.error('Failed to create OAuth2 transporter:', error.message);
      // Fallback to basic auth if OAuth2 fails
      return nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: this.configService.get('SMTP_USER'),
          pass: this.configService.get('SMTP_PASSWORD'), // App Password
        },
        connectionTimeout: 60000,
        greetingTimeout: 30000,
        socketTimeout: 60000,
      });
    }
  }

  async notifyEmail({ email, text }: NotifyEmailDto) {
    try {
      const transporter = this.createTransporter();

      const mailOptions = {
        from: this.configService.get('SMTP_USER'),
        to: email,
        subject: 'Sleepr Notification',
        text: text || 'You have a new notification from Sleepr!',
      };

      console.log('Attempting to send email to:', email);
      const result = await transporter.sendMail(mailOptions);
      console.log('Email sent successfully:', result.messageId);
      return result;
    } catch (error) {
      console.error('Failed to send email:', error.message);
      throw error;
    }
  }
}
