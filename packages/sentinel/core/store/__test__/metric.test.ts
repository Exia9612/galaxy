import Store from "../metric";
import { PerformanceMetric } from "../type";

describe("Store", () => {
	let store: Store;

	beforeEach(() => {
		store = new Store();
	});

	describe("constructor", () => {
		it("应该初始化一个空的 reactive Map", () => {
			expect(store.metricStore).toBeInstanceOf(Map);
			expect(store.metricStore.size).toBe(0);
		});
	});

	describe("set", () => {
		it("应该能够设置指标值", () => {
			store.set(PerformanceMetric.FP, 100);
			expect(store.get(PerformanceMetric.FP)).toBe(100);
		});

		it("应该能够设置字符串类型的指标值", () => {
			store.set(PerformanceMetric.FCP, "200ms");
			expect(store.get(PerformanceMetric.FCP)).toBe("200ms");
		});

		it("应该能够覆盖已存在的指标值", () => {
			store.set(PerformanceMetric.FP, 100);
			store.set(PerformanceMetric.FP, 200);
			expect(store.get(PerformanceMetric.FP)).toBe(200);
		});
	});

	describe("get", () => {
		it("应该能够获取已设置的指标值", () => {
			store.set(PerformanceMetric.FP, 100);
			expect(store.get(PerformanceMetric.FP)).toBe(100);
		});

		it("应该返回 undefined 当指标不存在时", () => {
			expect(store.get(PerformanceMetric.FP)).toBeUndefined();
		});

		it("应该能够获取不同类型的指标值", () => {
			store.set(PerformanceMetric.FP, 100);
			store.set(PerformanceMetric.FCP, "200ms");
			expect(store.get(PerformanceMetric.FP)).toBe(100);
			expect(store.get(PerformanceMetric.FCP)).toBe("200ms");
		});
	});

	describe("getAll", () => {
		it("应该返回空对象当 Map 为空时", () => {
			const result = store.getAll();
			expect(result).toEqual({});
		});

		it("应该返回所有指标值的对象", () => {
			store.set(PerformanceMetric.FP, 100);
			store.set(PerformanceMetric.FCP, "200ms");
			const result = store.getAll();
			expect(result).toEqual({
				[PerformanceMetric.FP]: 100,
				[PerformanceMetric.FCP]: "200ms",
			});
		});

		it("应该正确转换 Map 为对象", () => {
			store.set(PerformanceMetric.FP, 150);
			const result = store.getAll();
			expect(result[PerformanceMetric.FP]).toBe(150);
			expect(Object.keys(result)).toHaveLength(1);
		});
	});

	describe("remove", () => {
		it("应该能够删除指定的指标", () => {
			store.set(PerformanceMetric.FP, 100);
			store.remove(PerformanceMetric.FP);
			expect(store.has(PerformanceMetric.FP)).toBe(false);
			expect(store.get(PerformanceMetric.FP)).toBeUndefined();
		});

		it("删除不存在的指标不应该报错", () => {
			expect(() => {
				store.remove(PerformanceMetric.FP);
			}).not.toThrow();
		});

		it("应该只删除指定的指标，保留其他指标", () => {
			store.set(PerformanceMetric.FP, 100);
			store.set(PerformanceMetric.FCP, "200ms");
			store.remove(PerformanceMetric.FP);
			expect(store.has(PerformanceMetric.FP)).toBe(false);
			expect(store.has(PerformanceMetric.FCP)).toBe(true);
			expect(store.get(PerformanceMetric.FCP)).toBe("200ms");
		});
	});

	describe("clear", () => {
		it("应该清空所有指标", () => {
			store.set(PerformanceMetric.FP, 100);
			store.set(PerformanceMetric.FCP, "200ms");
			store.clear();
			expect(store.metricStore.size).toBe(0);
			expect(store.getAll()).toEqual({});
		});

		it("清空空 Map 不应该报错", () => {
			expect(() => {
				store.clear();
			}).not.toThrow();
			expect(store.metricStore.size).toBe(0);
		});
	});

	describe("has", () => {
		it("应该返回 true 当指标存在时", () => {
			store.set(PerformanceMetric.FP, 100);
			expect(store.has(PerformanceMetric.FP)).toBe(true);
		});

		it("应该返回 false 当指标不存在时", () => {
			expect(store.has(PerformanceMetric.FP)).toBe(false);
		});

		it("删除后应该返回 false", () => {
			store.set(PerformanceMetric.FP, 100);
			store.remove(PerformanceMetric.FP);
			expect(store.has(PerformanceMetric.FP)).toBe(false);
		});

		it("清空后应该返回 false", () => {
			store.set(PerformanceMetric.FP, 100);
			store.clear();
			expect(store.has(PerformanceMetric.FP)).toBe(false);
		});
	});

	describe("综合测试", () => {
		it("应该支持完整的 CRUD 操作流程", () => {
			// Create
			store.set(PerformanceMetric.FP, 100);
			store.set(PerformanceMetric.FCP, "200ms");

			// Read
			expect(store.get(PerformanceMetric.FP)).toBe(100);
			expect(store.has(PerformanceMetric.FP)).toBe(true);
			expect(store.getAll()).toEqual({
				[PerformanceMetric.FP]: 100,
				[PerformanceMetric.FCP]: "200ms",
			});

			// Update
			store.set(PerformanceMetric.FP, 150);
			expect(store.get(PerformanceMetric.FP)).toBe(150);

			// Delete
			store.remove(PerformanceMetric.FP);
			expect(store.has(PerformanceMetric.FP)).toBe(false);
			expect(store.getAll()).toEqual({
				[PerformanceMetric.FCP]: "200ms",
			});
		});
	});
});

