import { Injectable, NotFoundException } from "@nestjs/common"
import { CreateTaskDto } from "./dtos/create-task.dto"
import { PrismaService } from "../../prisma/prisma.service"
import { Task } from "@prisma/client"
import { UpdateTaskDto } from "./dtos/update-task.dto"

@Injectable()
export class TasksService {
	constructor(private readonly PrismaService: PrismaService) {}

	async get(userId: number) {
		return await this.PrismaService.task.findMany({
			where: { userId }
		})
	}

	async createOne(
		{ title, description }: CreateTaskDto,
		userId: number
	): Promise<Task> {
		const task = await this.PrismaService.task.create({
			data: { title, description, userId }
		})

		return task
	}

	async updateOne(id: number, dto: UpdateTaskDto, userId: number) {
		await this.findById(id, userId)

		const updatedTask = await this.PrismaService.task.update({
			where: { id, userId },
			data: dto
		})

		return updatedTask
	}

	async deletedOne(id: number, userId: number) {
		await this.findById(id, userId)

		const deletedTasks = await this.PrismaService.task.delete({
			where: { id, userId }
		})

		return deletedTasks
	}

	private async findById(id: number, userId?: number) {
		const task = this.PrismaService.task.findUnique({
			where: { id, userId }
		})
		if (!task) {
			throw new NotFoundException()
		}

		return task
	}
}
