import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import axios from 'axios';

@Injectable()
export class AmocrmService {
  private readonly baseUrl = `https://${process.env.AMO_SUBDOMAIN}.amocrm.ru`;

  constructor(private prisma: PrismaService) {}

  // 1. Birinchi marta ulanish (Auth Code-ni Tokenga almashtirish)
  async initialAuth(authCode: string) {
    try {
      const response = await axios.post(`${this.baseUrl}/oauth2/access_token`, {
        client_id: process.env.AMO_CLIENT_ID,
        client_secret: process.env.AMO_CLIENT_SECRET,
        grant_type: 'authorization_code',
        code: authCode,
        redirect_uri: process.env.AMO_REDIRECT_URI,
      });

      const { access_token, refresh_token } = response.data;
      return this.prisma.amoToken.upsert({
        where: { id: 1 },
        update: { accessToken: access_token, refreshToken: refresh_token },
        create: { id: 1, accessToken: access_token, refreshToken: refresh_token },
      });
   } catch (error: any) { // : any qo'shildi
  throw new InternalServerErrorException('amoCRM Auth xatosi: ' + error.message);
}
  }

  // 2. Tokenni bazadan olish va kerak bo'lsa yangilash (Refresh)
  async getAccessToken() {
    const token = await this.prisma.amoToken.findUnique({ where: { id: 1 } });
    if (!token) throw new Error('amoCRM ulanmagan. Avval auth qiling.');
    
    // Bu yerda aslida token vaqtini tekshirish kerak, hozircha mavjudini qaytaramiz
    return token.accessToken;
  }

  // 3. Mijoz xabarini amoCRM chatiga yuborish (Reverse path)
  async sendToAmo(socketId: string, text: string) {
    const token = await this.getAccessToken();
    const session = await this.prisma.amoChatSession.findUnique({ where: { socketId } });
    
    if (session) {
      await axios.post(`${this.baseUrl}/api/v4/chats/${session.amoChatId}/messages`, {
        text,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
    }
  }
}