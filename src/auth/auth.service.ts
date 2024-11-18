import { BadRequestException, Injectable } from "@nestjs/common"
import { RegisterDto } from "./dtos/register.dto"
import { UsersService } from "../users/users.service"
import { hash, verify } from "argon2"
import { JwtService } from "@nestjs/jwt"
import { ConfigService } from "@nestjs/config"
import { Response } from "express"

@Injectable()
export class AuthService {
	constructor(
		private readonly userService: UsersService,
		private readonly jwtService: JwtService,
		private readonly configService: ConfigService
	) {}

	async register({ email, password }: RegisterDto, res: Response) {
		const hashedPassword = await hash(password)

		const createdUser = await this.userService.createOne({
			email,
			hashedPassword
		})

		return await this.generateTokens(createdUser.id, res)
	}

	async validateUser(email: string, password: string) {
		const userByEmail = await this.userService.getOne({ email })

		if (!userByEmail) {
			return null
		}

		if (!userByEmail.hashedPassword) {
			throw new BadRequestException("Probably your are already has account")
		}

		const isValidPw = await verify(userByEmail.hashedPassword, password)

		if (!isValidPw) {
			return null
		}

		return userByEmail
	}

	async googleAuth(email: string, res: Response) {
		const userByEmail = await this.userService.getOne({ email })

		if (userByEmail) {
			return await this.generateTokens(userByEmail.id, res)
		}

		const createdUser = await this.userService.createOne({ email })

		return await this.generateTokens(createdUser.id, res)
	}

	async generateTokens(userId: number, res: Response) {
		const accessToken = await this.jwtService.signAsync(
			{ userId },
			{
				secret: this.configService.getOrThrow("JWT_ACCESS_SECRET"),
				expiresIn: this.configService.getOrThrow("JWT_ACCESS_EXPIRES")
			}
		)

		const refreshToken = await this.jwtService.signAsync(
			{ userId },
			{
				secret: this.configService.getOrThrow("JWT_REFRESH_SECRET"),
				expiresIn: this.configService.getOrThrow("JWT_REFRESH_EXPIRES")
			}
		)

		res.cookie("refreshToken", refreshToken, {
			httpOnly: true,
			secure: true
		})

		const token = accessToken

		return token
	}
}
