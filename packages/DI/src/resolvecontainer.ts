import { Constructor } from "./types";

export default function resolveContainer<T>(Container: Constructor<T>): T {
	return new Container();
}
