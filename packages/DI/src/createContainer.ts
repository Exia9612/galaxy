import { Provider, Container, ContainerOptions, Constructor } from "./types";

export default function createContainer(
	providers: Provider[] = [],
	opt?: ContainerOptions,
): Constructor<Container> {
	const options = {
		containerName: opt?.containerName || "container",
		...opt,
	};

	class Container {
		registry: Record<string, any>;

		constructor() {
			this.registry = {};
			Object.defineProperty(this.registry, options.containerName, {
				get: () => this,
			});

			providers.forEach((provider) => this.register(provider));
		}

		getDeps(provider: Provider) {
			const depsInstance: Record<string, any> = {};

			if (Array.isArray(provider.deps)) {
				provider.deps.forEach((depName: string) => {
					if (!(depName in this.registry)) {
						throw new Error(`Dependency ${depName} not found`);
					}

					depsInstance[depName] = this.registry[depName];
				});
			} else if (
				typeof provider.deps === "object" &&
				provider.deps !== null &&
				!Array.isArray(provider.deps)
			) {
				Object.keys(provider.deps).forEach((containerDepName: string) => {
					if (!(containerDepName in this.registry)) {
						throw new Error(`Dependency ${containerDepName} not found`);
					}

					const targetDepName = (
						provider.deps as unknown as Record<string, string>
					)[containerDepName];
					depsInstance[targetDepName] = this.registry[targetDepName];
				});
			}

			return depsInstance;
		}

		register(provider: Provider) {
			if (typeof provider.name !== "string") {
				throw new Error("Provider name must be a string");
			}

			const { name } = provider;

			if ("useValue" in provider) {
				this.registry[name] = provider.useValue;
			} else if ("useFactory" in provider) {
				this.registry[name] = provider.useFactory!(this.getDeps(provider));
			} else if ("useClass" in provider) {
				// 当使用useClass时，constructorArgs是必需的
				const deps = this.getDeps(provider);
				const constructorArgs = provider.constructorArgs;
				this.registry[name] = new provider.useClass!({
					...constructorArgs,
					...deps,
				});
			} else if ("useDefinedValue" in provider) {
				Object.defineProperty(this.registry, name, {
					get: () => {
						return provider.useDefinedValue;
					},
				});
			} else {
				throw new Error(
					"Provider must have a useValue, useFactory, useClass, or useDefinedValue property",
				);
			}
		}

		get(name: string) {
			return this.registry[name];
		}
	}

	return Container;
}
