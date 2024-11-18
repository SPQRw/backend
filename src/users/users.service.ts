import {
	BadRequestException,
	ConflictException,
	Injectable,
	NotFoundException
} from "@nestjs/common"
import { CreateUserDto } from "./dtos/create-user.dto"
import { PrismaService } from "../../prisma/prisma.service"
import { GetUserDto } from "./dtos/get-user.dto"
import { UpdateUserDto } from "./dtos/update-user.dto"
import { hash } from "argon2"

@Injectable()
export class UsersService {
	constructor(private readonly prismaService: PrismaService) {}
	async createOne({ email, hashedPassword }: CreateUserDto) {
		const userByEmail = await this.prismaService.user.findUnique({ where: { email } })

		if (userByEmail) {
			throw new ConflictException("Already exist")
		}

		const createUser = await this.prismaService.user.create({
			data: {
				email,
				hashedPassword
			}
		})

		return createUser
	}

	async getOne({ id, email }: GetUserDto) {
		if (!id && !email) {
			throw new BadRequestException("wqe")
		}

		const user = await this.prismaService.user.findFirst({
			where: { id, email }
		})

		return user
	}

	async updateOne(id: number, dto: UpdateUserDto) {
		const user = await this.getOneOrThrow(id)

		if (dto.email) {
			const userByEmail = await this.getOne({ email: dto.email })

			if (userByEmail) {
				throw new ConflictException()
			}
		}

		let hashedPassword: string = user.hashedPassword

		if (dto.password) {
			hashedPassword = await hash(dto.password)
		}

		const updatedUser = await this.prismaService.user.update({
			where: { id },
			data: {
				...dto,
				hashedPassword
			}
		})

		return updatedUser
	}

	// private
	async getOneOrThrow(id: number) {
		const user = await this.getOne({ id })

		if (!user) {
			throw new NotFoundException()
		}

		return user
	}
}
