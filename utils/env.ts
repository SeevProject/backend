import { EnvType, load } from "ts-dotenv";

const schema = {
	DEV: Boolean,
	MONGO_URL: String,
	PORT: {
		type: Number,
		optional: true,
	},
};

type Env = EnvType<typeof schema>;

export let env: Env;

export function loadEnv() {
	env = load(schema);
}
