import { effect } from "../src/effect";
import { reactive } from "../src/reactive";
import { isRef, ref, unRef, proxyRefs } from "../src/ref";

describe("ref", () => {
	it("should return value correctly", () => {
		const r = ref(1);
		expect(r.value).toBe(1);
	});

	it("should call effect when ref value changes", () => {
		const r = ref(1);
		let foo = 0;
		let value = 0;
		effect(() => {
			foo++;
			value = r.value;
		});
		expect(foo).toBe(1);
		expect(value).toBe(1);
		r.value = 2;
		expect(foo).toBe(2);
		expect(value).toBe(2);
	});

	it("make nested properties reactive", () => {
		const r = ref({
			count: 1,
		});
		let value = 0;
		effect(() => {
			value = r.value.count;
		});
		expect(value).toBe(1);
		r.value.count = 2;
		expect(value).toBe(2);
	});

	it("isRef", () => {
		const r = ref(1);
		const user = reactive({
			age: 1,
		});
		expect(isRef(r)).toBe(true);
		expect(isRef(1)).toBe(false);
		expect(isRef(user)).toBe(false);
	});

	it("unRef", () => {
		const a = ref(1);
		expect(unRef(a)).toBe(a.value);
		expect(unRef(1)).toBe(1);
	});

	it("proxyRefs", () => {
		// 嵌套··
		const user = {
			age: ref(10),
			name: "cheng",
			obj: {
				p1: ref("isaac"),
			},
		};

		const proxyUser = proxyRefs(user);

		expect(user.age.value).toBe(10);
		expect(proxyUser.age).toBe(10);
		expect(proxyUser.name).toBe("cheng");

		proxyUser.age = 20;
		expect(proxyUser.age).toBe(20);
		expect(user.age.value).toBe(20);

		proxyUser.age = ref(10);
		expect(proxyUser.age).toBe(10);
		expect(user.age.value).toBe(10);
	});
});
