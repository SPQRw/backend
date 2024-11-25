import { Module } from "@nestjs/common"
import { AuthService } from "./auth.service"
import { AuthController } from "./auth.controller"
import { UsersModule } from "../users/users.module"
import { JwtModule } from "@nestjs/jwt"
import { localStrategy } from "./strategies/local.strategy"
import { JwtRefreshStrategy } from "./strategies/jwt-refresh.strategy"
import { GoogleStrategy } from "./strategies/ google.strategy"
import { JwtAccessStrategy } from "./strategies/jwt-access.strategy"

@Module({
	imports: [UsersModule, JwtModule.register({})],
	controllers: [AuthController],
	providers: [
		AuthService,
		localStrategy,
		JwtRefreshStrategy,
		GoogleStrategy,
		JwtAccessStrategy
	]
})
export class AuthModule {}
