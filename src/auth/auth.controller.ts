import { Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('singup')
    singin() {
        return this.authService.singin()
    }

    @Post('singin')
    singup() {
        return this.authService.singup()
    }
}