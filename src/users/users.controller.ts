import { Body, Controller, Get, ParseIntPipe, Patch, UseGuards } from "@nestjs/common"
import { UsersService } from "./users.service"
import { CurrentUser } from "../utils/decorators/current-user.decorator"
import { UpdateUserDto } from "./dtos/update-user.dto"
import { JwtAccessGuard } from "../auth/guard/jwt-access.guard"

@UseGuards(JwtAccessGuard)
@Controller("users")
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Get()
	async getOne(@CurrentUser("id", ParseIntPipe) userId: number) {
		return await this.usersService.getOne({ id: userId })
	}

	@Patch()
	async updateOne(
		@CurrentUser("id", ParseIntPipe) userId: number,
		@Body() dto: UpdateUserDto
	) {
		return this.usersService.updateOne(userId, dto)
	}
}
