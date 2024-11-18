import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	ParseIntPipe,
	Patch,
	Post,
	UseGuards
} from "@nestjs/common"
import { TasksService } from "./tasks.service"
import { Task } from "@prisma/client"
import { CreateTaskDto } from "./dtos/create-task.dto"
import { UpdateTaskDto } from "./dtos/update-task.dto"
import { JwtAccessGuard } from "../auth/guard/jwt-access.guard"
import { CurrentUser } from "../utils/decorators/current-user.decorator"

@UseGuards(JwtAccessGuard)
@Controller("tasks")
export class TasksController {
	constructor(private readonly tasksService: TasksService) {}

	@Get()
	async get(@CurrentUser("id", ParseIntPipe) userId: number) {
		return this.tasksService.get(userId)
	}

	@Post()
	async createOne(
		@Body() dto: CreateTaskDto,
		@CurrentUser("id", ParseIntPipe) userId: number
	): Promise<Task> {
		return this.tasksService.createOne(dto, userId)
	}

	@Patch(":id")
	async updateOne(
		@Param("id", ParseIntPipe) id: number,
		@Body() dto: UpdateTaskDto,
		@CurrentUser("id", ParseIntPipe) userId: number
	): Promise<Task> {
		return this.tasksService.updateOne(id, dto, userId)
	}

	@Delete(":id")
	async deleteOne(
		@Param("id", ParseIntPipe) id: number,
		@CurrentUser("id", ParseIntPipe) userId: number
	): Promise<Task> {
		return this.tasksService.deletedOne(id, userId)
	}
}
