export function result<T>(promise: Promise<T>): Promise<T | Error> {
	return promise.then((data) => data).catch((err) => err);
}

export function isError(err: unknown): err is Error {
	return err instanceof Error;
}
