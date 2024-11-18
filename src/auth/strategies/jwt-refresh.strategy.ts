import { Injectable, UnauthorizedException } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { PassportStrategy } from "@nestjs/passport"
import { Request } from "express"
import { Strategy } from "passport-local"
import { JwtPayload } from "../../utils/types/jwt-payload"
import { UsersService } from "../../users/users.service"

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, "jwt-refresh") {
	constructor(
		private readonly configService: ConfigService,
		private readonly userService: UsersService
	) {
		super({
			jwtFromRequest: (req: Request) => {
				return req.cookies["refreshToken"]
			},
			ignoreExpirations: false,
			secretOrKey: configService.getOrThrow("JWT_REFRESH_SECRET")
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
