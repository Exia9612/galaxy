import { createContainer, resolveContainer, Provider } from "./src/index";

class Base {
	msg: string;

	constructor(msg: string) {
		this.msg = msg;
	}

	print() {
		console.log(this.msg);
	}
}

class Extended {
	base: Base;
	moreMsg: string;

	constructor({ base, moreMsg }: { base: Base; moreMsg: string }) {
		this.base = base;
		this.moreMsg = moreMsg;
	}

	print() {
		this.base.print();
		console.log(this.moreMsg);
	}
}

const providers: Provider[] = [
	{
		name: "base",
		useClass: Base,
		constructorArgs: {
			msg: "base",
		},
	},
	{
		name: "extended",
		useClass: Extended,
		deps: ["base"],
		constructorArgs: {
			moreMsg: "moreMsg",
		},
	},
];

const container = resolveContainer(createContainer(providers));

const extended = container.get("extended");
(extended as any).print();
