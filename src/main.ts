import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import { ValidationPipe } from "@nestjs/common"
import * as cookieParser from "cookie-parser"

async function bootstrap() {
	const app = await NestFactory.create(AppModule)

	app.useGlobalPipes(new ValidationPipe())

	app.use(cookieParser())

	app.setGlobalPrefix("api")

	app.enableCors({
		origin: "http://localhost:5173",
		methods: "GET,POST,PUT,DELETE,OPTIONS",
		credentials: true
	})

	await app.listen(5002)
}
bootstrap()
