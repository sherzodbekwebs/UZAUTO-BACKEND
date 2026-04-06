import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) { }

    async login(dto: any) {
        if (!dto.username || !dto.password) {
            throw new UnauthorizedException('Login va parolni kiriting');
        }

        const admin = await this.prisma.admin.findUnique({
            where: { username: dto.username },
        });

        if (!admin || !(await bcrypt.compare(dto.password, admin.password))) {
            throw new UnauthorizedException('Login yoki parol xato');
        }

        // 🛡️ Payloadga rolni qo'shamiz
        const payload = { 
            sub: admin.id, 
            username: admin.username, 
            role: admin.role 
        };

        return {
            access_token: this.jwtService.sign(payload),
            role: admin.role,      // 👈 Frontend uchun muhim!
            username: admin.username // 👈 Header uchun muhim!
        };
    }

    // TEST UCHUN: Birinchi adminni yaratish funksiyasi
    async createFirstAdmin(dto: any) {
        const hashedPassword = await bcrypt.hash(dto.password, 10);
        return this.prisma.admin.create({
            data: {
                username: dto.username,
                password: hashedPassword,
                role: dto.role || 'admin', // 👈 MANA SHU YER TUZATILDI!
            },
        });
    }
}