import { Injectable, UnauthorizedException } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { PassportStrategy } from "@nestjs/passport"
import { ExtractJwt, Strategy } from "passport-jwt"
import { UsersService } from "../../users/users.service"
import { JwtPayload } from "../../utils/types/jwt-payload"

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(Strategy, "jwt-access") {
	constructor(
		private readonly configService: ConfigService,
		private readonly userService: UsersService
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: configService.getOrThrow("JWT_ACCESS_SECRET")
		})
	}

	async validate({ userId }: JwtPayload) {
		const user = await this.userService.getOne({ id: userId })

		if (!user) {
			throw new UnauthorizedException()
		}

		return user
	}
}
