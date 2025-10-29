import { reactive } from "../src/reactive";
import { effect, stop } from "../src/effect";

describe("effect", () => {
	it("should exec effect and get handler works when init", () => {
		const obj = reactive({
			foo: 1,
		});

		let v = 0;
		effect(() => {
			v = obj.foo;
		});

		expect(v).toBe(1);
		expect(obj.foo).toBe(1);
	});

	it("should exec effect and set handler works when init", () => {
		const obj = reactive({
			foo: 1,
		});

		let v = 0;
		effect(() => {
			obj.foo = 2;
			v = obj.foo;
		});

		expect(v).toBe(2);
		expect(obj.foo).toBe(2);
	});

	it("should exec effect and get and set handler work when init", () => {
		const obj = reactive({
			foo: 1,
		});
		let v = 0;
		effect(() => {
			obj.foo++;
			v = obj.foo;
		});

		expect(v).toBe(2);
		expect(obj.foo).toBe(2);
	});
});
