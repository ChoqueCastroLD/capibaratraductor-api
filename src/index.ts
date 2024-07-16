import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";

import { errorHandler } from "./common/plugins/error";
import { logger } from "./common/plugins/logger";
import { PORT } from "./common/constants";
import { router } from "./router";

export const app = new Elysia()
	.use(cors())
	.use(logger({ logIP: true }))
	.use(errorHandler())
	.use(router())
	.listen(PORT);

console.info(
	`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
