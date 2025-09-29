import { createContainer, resolveContainer } from "galaxyDI/dist/esm/index.js";

class Base {
	msg;

	constructor({ msg }) {
		this.msg = msg;
	}

	print() {
		console.log(this.msg);
	}
}

class Extended {
	base;
	moreMsg;

	constructor({ base, moreMsg }) {
		this.base = base;
		this.moreMsg = moreMsg;
	}

	print() {
		this.base.print();
		console.log(this.moreMsg);
	}
}

const providers = [
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
extended.print();

const m1 = new Map();
m1.set("a", 1);
m1.set("b", 2);
m1.set("c", 3);

console.log(
	m1.entries((key, value) => {
		console.log(key, value);
	}),
);
