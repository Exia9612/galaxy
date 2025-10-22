// 使用示例
import { reactive, ref } from "./src/reactive";
import { watch, watchEffect, watchMultiple } from "./src/watch";
import { computed } from "./src/compunted";

// 示例1: 基本watch使用
console.log("=== 基本watch使用 ===");
const state = reactive({ count: 0, name: "张三" });

// 监听单个属性
const stopWatch1 = watch(
	() => state.count,
	(newValue, oldValue) => {
		console.log(`count变化: ${oldValue} -> ${newValue}`);
	},
);

// 监听整个对象
const stopWatch2 = watch(
	state,
	(newValue, oldValue) => {
		console.log("state变化:", newValue, oldValue);
	},
	{ deep: true }, // 深度监听
);

// 立即执行
const stopWatch3 = watch(
	() => state.name,
	(newValue, oldValue) => {
		console.log(`name变化: ${oldValue} -> ${newValue}`);
	},
	{ immediate: true },
);

// 修改数据
state.count = 1;
state.name = "李四";
state.count = 2;

// 示例2: watchEffect使用
console.log("\n=== watchEffect使用 ===");
const count = ref(0);
const name = ref("王五");

const stopEffect = watchEffect((onInvalidate) => {
	console.log(`watchEffect: count=${count.value}, name=${name.value}`);

	// 清理函数示例
	onInvalidate(() => {
		console.log("清理函数被调用");
	});
});

count.value = 1;
name.value = "赵六";

// 示例3: computed使用
console.log("\n=== computed使用 ===");
const firstName = ref("张");
const lastName = ref("三");

// 只读computed
const fullName = computed(() => {
	console.log("计算fullName");
	return `${firstName.value}${lastName.value}`;
});

// 可写computed
const writableComputed = computed({
	get() {
		console.log("获取writableComputed");
		return fullName.value;
	},
	set(value: string) {
		console.log("设置writableComputed:", value);
		const [first, last] = value.split("");
		firstName.value = first || "";
		lastName.value = last || "";
	},
});

console.log("fullName:", fullName.value);
console.log("fullName:", fullName.value); // 缓存，不会重新计算

firstName.value = "李";
console.log("fullName:", fullName.value);

writableComputed.value = "王五";
console.log("firstName:", firstName.value, "lastName:", lastName.value);

// 示例4: 监听多个源
console.log("\n=== 监听多个源 ===");
const source1 = ref(1);
const source2 = ref(2);

const stopMultiple = watchMultiple([source1, source2], (values, oldValues) => {
	console.log("多个源变化:", values, oldValues);
});

source1.value = 10;
source2.value = 20;

// 清理所有监听
console.log("\n=== 清理监听 ===");
stopWatch1();
stopWatch2();
stopWatch3();
stopEffect();
stopMultiple();

console.log("所有监听已清理");
