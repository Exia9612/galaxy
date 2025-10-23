import { reactive } from "../src/reactive";
import { effect, stop } from "../src/effect";

describe("effect", () => {
	it("should exec effect when init", () => {
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
