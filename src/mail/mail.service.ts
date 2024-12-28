import { BadRequestException, Injectable } from '@nestjs/common';
import { IUser } from 'src/helpers/types/user.interface';
import { ApproveRequestDto, UpdateInfoDto } from './dto/contentInfo.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
    private jwtService: JwtService,
  ) {}
  async sendUpdateRequestNotification(user: IUser, req: UpdateInfoDto) {
    const adminEmail = 'demomailok1234@gmail.com';
    if (!user.email) {
      throw new BadRequestException(
        'Không tìm thấy email của người dùng. Không thể gửi email.',
      );
    }
    const approvalLink = `http://localhost:8080/api/v1/update-info-user/approve-update/${req.id}`;
    const emailBody = `
      <p>Sinh viên ${user.name} đã yêu cầu cập nhật thông tin.</p>
      <p>Thông tin: ${JSON.stringify(req.data)}</p>
      <a href="${approvalLink}" target="_blank">Xác nhận thông tin</a>
    `;

    await this.mailerService.sendMail({
      from: user.email,
      to: adminEmail,
      subject: 'Yêu cầu cập nhật thông tin',
      html: emailBody,
    });
  }

  generateApprovalToken(userId: number, updateInfoDto: UpdateInfoDto) {
    const payload = { userId, updateInfo: updateInfoDto };
    return this.jwtService.sign(payload, { expiresIn: '24h' });
  }

  async sendUpdateSuccessEmail(userEmail: string, userName: string) {
    const subject = 'Cập nhật thông tin thành công';
    const body = `
      <p>Xin chào ${userName},</p>
      <p>Thông tin của bạn đã được cập nhật thành công.</p>
      <p>Nếu bạn có bất kỳ thắc mắc nào, vui lòng liên hệ với bộ phận hỗ trợ.</p>
      <p>Trân trọng,</p>
      <p>Đội ngũ quản trị</p>
    `;

    try {
      await this.mailerService.sendMail({
        to: userEmail,
        subject: subject,
        html: body,
      });

      console.log(`Email đã gửi thành công đến ${userEmail}`);
    } catch (error) {
      console.error(`Gửi email thất bại: ${error.message}`);
    }
  }

  async sendMailRetryPassword(data: any) {
    return await this.mailerService.sendMail({
      to: 'nguyenvothanhhuy2002@gmail.com',
      from: '"Support Team" <support@example.com>', // override default from
      subject: 'Welcome to Nice App! Confirm your Email',
      template: 'retrypass',
      context: {
        name: data.name,
        activationCode: data.codeId,
      },
    });
  }
}
