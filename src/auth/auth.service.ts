import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService){}
    singup() {
        return { msg: 'Hi1' };
    }

    singin() {
        return { msg: 'Hi2' };

    }
}