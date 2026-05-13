import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import axios from 'axios';

@Injectable()
export class AmocrmService {
  private readonly logger = new Logger(AmocrmService.name);
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

      return await this.prisma.amoToken.upsert({
        where: { id: 1 },
        update: { 
          accessToken: access_token, 
          refreshToken: refresh_token 
        },
        create: { 
          id: 1, 
          accessToken: access_token, 
          refreshToken: refresh_token 
        },
      });
    } catch (error: any) {
      // amoCRM qaytargan xato detallarini ajratib olamiz
      const errorData = error.response?.data;
      
      // amoCRM odatda 'hint', 'title' yoki 'detail' maydonlarida aniq sababni yozadi
      const errorMessage = errorData?.hint || errorData?.title || errorData?.detail || error.message;
      
      // Server logiga to'liq xatoni yozamiz (cPanel logs/stderr.log da ko'rinadi)
      this.logger.error('amoCRM Auth xatosi detali:', JSON.stringify(errorData));

      throw new InternalServerErrorException(`amoCRM Auth xatosi: ${errorMessage}`);
    }
  }

  // 2. Tokenni bazadan olish va kerak bo'lsa yangilash (Refresh)
  async getAccessToken() {
    const token = await this.prisma.amoToken.findUnique({ where: { id: 1 } });
    if (!token) throw new Error('amoCRM ulanmagan. Avval auth qiling.');
    
    // Kelajakda bu yerda token muddatini tekshirib, avtomat Refresh qilish logikasini qo'shamiz
    return token.accessToken;
  }

  // 3. Mijoz xabarini amoCRM chatiga yuborish (Reverse path)
  async sendToAmo(socketId: string, text: string) {
    try {
        const token = await this.getAccessToken();
        const session = await this.prisma.amoChatSession.findUnique({ where: { socketId } });
        
        if (session) {
          await axios.post(`${this.baseUrl}/api/v4/chats/${session.amoChatId}/messages`, {
            text,
          }, {
            headers: { Authorization: `Bearer ${token}` }
          });
        }
    } catch (error: any) {
        this.logger.error('amoCRM xabar yuborishda xato:', error.response?.data || error.message);
    }
  }
}