interface BaseProvider {
	name: string;
	useValue?: any;
	useDefinedValue?: any;
	useFactory?: (...args: any[]) => any;
	useClass?: { new (...args: any[]): any };
	deps?: any[];
	// NOTE: Providers will have extra properties which are not statically defined here.
	// This extra property is needed to make TSC less strict, and enable extra properties.
	[others: string]: any;
}

interface ProviderWithUseClass extends BaseProvider {
	useClass: { new (...args: any[]): any };
	constructorArgs?: any[];
}

interface ProviderWithoutUseClass extends BaseProvider {
	useClass?: never;
	constructorArgs?: never;
}

export type Provider = ProviderWithUseClass | ProviderWithoutUseClass;

export interface Container {
	getDeps(container: Provider): any;
	register(container: Provider): any;
	get<T>(name: string): T;
	registry: Record<string, any>;
}

export interface ContainerOptions {
	containerName: string;
}

export interface Constructor<T> {
	new (): T;
}

// export function createContainer(
// 	providers: Provider[],
// 	options?: ContainerOptions,
// ): Constructor<Container>;

// export function resolveContainer<T>(Container: Constructor<T>): T;
