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

	it("should not exec scheduler when there is no set in init", () => {
		let value = 0;
		const obj = reactive({ "foo": 1 });
		const scheduler = jest.fn(() => {
			console.log("scheduler");
		});
		effect(
			() => {
				value = obj.foo;
			},
			{ scheduler },
		);

		expect(scheduler).not.toHaveBeenCalled();
		expect(value).toBe(1);
	});

	it("should exec scheduler when there is set in init", () => {
		let value = 0;
		let valueScheduler = 0;
		const obj = reactive({ "foo": 1 });
		const scheduler = jest.fn(() => {
			valueScheduler = obj.foo;
		});
		effect(
			() => {
				obj.foo++;
				value = obj.foo;
			},
			{ scheduler },
		);

		expect(scheduler).toHaveBeenCalledTimes(1);
		expect(value).toBe(2);
		expect(valueScheduler).toBe(2);
	});

	it("should prevent executing effect automatically when stop the effect", () => {
		let value = 0;
		const obj = reactive({ "foo": 1 });
		const runner = effect(() => {
			obj.foo++;
			value = obj.foo;
		});
		expect(value).toBe(2);
		stop(runner);
		obj.foo++;
		expect(value).toBe(2);
		runner();
		expect(obj.foo).toBe(4);
	});

	it("should call onStop when stop the effect", () => {
		const obj = reactive({ "foo": 1 });
		const onStop = jest.fn();
		const runner = effect(
			() => {
				obj.foo++;
			},
			{ onStop },
		);
		stop(runner);
		expect(onStop).toHaveBeenCalledTimes(1);
	});
});
