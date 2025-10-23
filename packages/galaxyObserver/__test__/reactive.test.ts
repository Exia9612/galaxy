import { reactive, isReactive, isProxy } from "../src/reactive";

describe("reactive", () => {
	it("should retuned a reactive object", () => {
		const original = { foo: 1 };
		const observed = reactive(original);

		expect(observed).not.toBe(original);
		expect(observed.foo).toBe(1);
		expect(isReactive(observed)).toBe(true);
		expect(isReactive(original)).toBe(false);
		expect(isProxy(observed)).toBe(true);
	});

	it("should make the nested prop as reactive", () => {
		const original = {
			nested: {
				foo: 1,
			},
			array: [{ bar: 2 }],
		};

		const observed = reactive(original);
		expect(isReactive(observed.nested)).toBe(true);
		expect(isReactive(observed.array)).toBe(true);
		expect(isReactive(observed.array[0])).toBe(true);
	});

	it("should return val", () => {
		const original = { foo: 1 };
		const observed = reactive(original);

		expect(observed.foo).toBe(1);
	});

	it("should reset the value", () => {
		const original = { foo: 1 };
		const observed = reactive(original);

		observed.foo = 2;
		expect(observed.foo).toBe(2);
	});
});
