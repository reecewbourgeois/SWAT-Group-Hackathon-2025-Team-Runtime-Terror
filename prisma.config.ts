import { defineConfig } from "prisma/config";

export default defineConfig({
	schema: "./src/api/prisma/schema.prisma",
	migrations: {
		path: "./src/api/prisma/migrations",
	},
	views: {
		path: "./src/api/prisma/views",
	},
	earlyAccess: true,
	typedSql: {
		path: "./src/api/prisma/queries",
	},
});
