import { Elysia } from "elysia";
import { readdir } from "fs/promises";

export const router = () => async (app: Elysia) => {
	const folders = await readdir("./src");
	for (const folder of folders) {
		if (folder.includes(".")) continue; // Skip files (not folders)
		const subFolders = await readdir(`./src/${folder}`);
		if (!subFolders.includes("routes")) continue;
		const files = await readdir(`./src/${folder}/routes`);
		for (const file of files) {
			const { router } = await import(`./${folder}/routes/${file}`);
			if (!router) continue;
			app.group("", (app) => app.use(router()));
		}
	}
	console.info(
		`Loaded routes: \n${app.routes
			.filter((route) => route.method !== "OPTIONS")
			.map((route) => `\t- ${route.method}: ${route.path}`)
			.join("\n")}`,
	);
	return app;
};
