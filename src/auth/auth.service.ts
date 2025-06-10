import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto } from "./dto";
import * as argon from 'argon2'
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private jwt: JwtService, private config: ConfigService) { }
    async signup(dto: AuthDto) {
        const existingUser = await this.prisma.user.findUnique({
            where: { email: dto.email }
        });
        if (existingUser) {
            throw new ForbiddenException('Credentials incorrect');
        }

        const hash = await argon.hash(dto.password)
        try {
            const user = await this.prisma.user.create({
                data: {
                    email: dto.email,
                    hash,
                }
            })

            return this.signToken(user.id, user.email);
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new ForbiddenException('Credentials incorrect')
                }
            }
            throw error;
        }

    }

    async signin(dto: AuthDto) {
        const user = await this.prisma.user.findUnique({
            where: {
                email: dto.email,
            }
        })

        if (!user) throw new ForbiddenException('Credentials incorrect')
        const pwMatches = await argon.verify(user.hash, dto.password)
        if (!pwMatches) throw new ForbiddenException('Credentials incorrect')
        return this.signToken(user.id, user.email);
    }
    async signToken(
        userId: number,
        email: string
    ): Promise<{ access_token: string }> {
        const payload = {
            sub: userId,
            email
        }
        const secret = this.config.get('JWT_SECRET')
        const token = await this.jwt.signAsync(payload, {
            expiresIn: '15m',
            secret: secret,
        })

        return {
            access_token: token,
        }

    }

    async getAllUsers() {
        return this.prisma.user.findMany({
            select: {
                id: true,
                email: true,
                createdAt: true,
            }
        })
    }
    
    async putUser(userId: number, dto: Partial<AuthDto>) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId }
        })

        if (!user) {
            throw new ForbiddenException('User not found')
        }
        let updateData: any = {}

        if (dto.email) {
            updateData.email = dto.email
        }

        if (dto.password) {
            updateData.hash = await argon.hash(dto.password)
        }
        try {
            const updateUser = await this.prisma.user.update({
                where: { id: userId },
                data: updateData,
                select: {
                    id: true,
                    email: true,
                    hash: true,
                }
            })
            return updateUser
        }

        catch (error) {
            if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
                throw new ForbiddenException('Email already in use')
            }
            throw error
        }

    }
    
    async deleteUser(userId: number) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user) {
            throw new ForbiddenException('User not found');
        }

        await this.prisma.user.delete({
            where: { id: userId }
        });

        return { message: 'User deleted successfully' };
    }
}