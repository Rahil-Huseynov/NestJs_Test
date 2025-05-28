import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto } from "./dto";
import * as argon from 'argon2'
@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService) { }
    async singup(dto: AuthDto) {
        const hash = await argon.hash(dto.password)
        const user = await this.prisma.user.create({
            data:{
                email:dto.email,
                hash,
            }
        })
        return user;
    }

    singin() {
        return { msg: 'Hi2' };

    }
}