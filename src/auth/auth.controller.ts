import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Put, UseInterceptors } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto";
import { AnyFilesInterceptor } from "@nestjs/platform-express";

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('signup')
    @UseInterceptors(AnyFilesInterceptor())
    signup(@Body() dto: AuthDto) {
        return this.authService.signup(dto)
    }

    @HttpCode(HttpStatus.OK)
    @Post('signin')
    @UseInterceptors(AnyFilesInterceptor())
    signin(@Body() dto: AuthDto) {
        return this.authService.signin(dto)
    }

    @Get('users')
    getUsers() {
        return this.authService.getAllUsers();
    }

    @Put("users/:id")
    updateUser(
        @Param("id", ParseIntPipe) id: number,
        @Body() dto: Partial<AuthDto>) {
        return this.authService.putUser(id, dto)
    }

    @Delete("users/:id")
    deleteUser(@Param("id", ParseIntPipe) id: number) {
        return this.authService.deleteUser(id);
    }

    @Get('ping')
    ping() {
        return 'pong';
    }

}