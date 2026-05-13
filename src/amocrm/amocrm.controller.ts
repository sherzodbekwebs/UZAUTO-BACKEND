import { Controller, Post, Body, Get, Query, Logger } from '@nestjs/common';
import { AmocrmService } from './amocrm.service';
import { ChatGateway } from './chat.gateway';
import { PrismaService } from '../prisma/prisma.service';

@Controller('amocrm')
export class AmocrmController {
    private readonly logger = new Logger(AmocrmController.name);

    constructor(
        private readonly amocrmService: AmocrmService,
        private readonly chatGateway: ChatGateway,
        private readonly prisma: PrismaService,
    ) { }

    // amoCRM-dan keladigan operator javobini qabul qilish
    @Post('webhook')
    async handleAmoWebhook(@Body() body: any) {
        try {
            this.logger.log('amoCRM-dan webhook keldi');

            // amoCRM Webhook strukturasi bo'yicha ma'lumotlarni ajratamiz
            // Eslatma: Struktura amoCRM sozlamalariga qarab biroz farq qilishi mumkin
            const messageText = body.message?.text || body.text;
            const amoChatId = body.chat_id || body.message?.chat_id;

            if (!amoChatId || !messageText) return { status: 'ignored' };

            // 1. Bazadan ushbu Chat qaysi mijozga (Socket) tegishli ekanini topamiz
            const session = await this.prisma.amoChatSession.findFirst({
                where: { amoChatId: String(amoChatId) },
                orderBy: { createdAt: 'desc' }
            });

            if (session) {
                // 2. Socket.io orqali Front-endga yuboramiz
                this.chatGateway.server.to(session.socketId).emit('operator_message', {
                    text: messageText,
                    sender: 'operator',
                    time: new Date()
                });
                return { status: 'delivered' };
            }

            return { status: 'session_not_found' };
        } catch (error: any) { // : any qo'shildi
            this.logger.error('Webhook xatosi: ' + error.message);
            return { status: 'error' };
        }
    }

    // Birinchi marta ulanish uchun (OAuth2 Callback)
    // Manzil: https://api.uzautotrailer.uz/amocrm/callback
    @Get('callback')
    async callback(@Query('code') code: string) {
        if (code) {
            await this.amocrmService.initialAuth(code);
            return 'amoCRM muvaffaqiyatli ulandi! Endi bu oynani yopishingiz mumkin.';
        }
        return 'Kod topilmadi.';
    }
}