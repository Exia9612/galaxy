import {
	reactive,
	ref,
	computed,
	watch,
	watchEffect,
	effect,
	isReactive,
	isRef,
	toRefs,
} from "./dist/index.esm.js";

console.log("🚀 Galaxy Reactive System Demo\n");

// 1. 基本响应式对象
console.log("1. 基本响应式对象:");
const state = reactive({
	count: 0,
	name: "Galaxy",
	user: {
		age: 25,
		city: "Beijing",
	},
});

console.log("初始状态:", state);
console.log("是否为响应式:", isReactive(state));

// 2. ref响应式
console.log("\n2. ref响应式:");
const count = ref(0);
const message = ref("Hello Galaxy");

console.log("count值:", count.value);
console.log("message值:", message.value);
console.log("是否为ref:", isRef(count));

// 3. 计算属性
console.log("\n3. 计算属性:");
const doubleCount = computed(() => count.value * 2);
const userInfo = computed(() => `${state.name} (${state.user.age}岁)`);

console.log("doubleCount:", doubleCount.value);
console.log("userInfo:", userInfo.value);

// 4. 副作用effect
console.log("\n4. 副作用effect:");
const stopEffect = effect(() => {
	console.log(`Effect: count = ${count.value}, state.count = ${state.count}`);
});

// 5. 监听器
console.log("\n5. 监听器:");
const stopWatch = watch(
	() => state.count,
	(newVal, oldVal) => {
		console.log(`Watch: state.count 从 ${oldVal} 变为 ${newVal}`);
	},
);

const stopWatchEffect = watchEffect((onInvalidate) => {
	console.log(`WatchEffect: 当前count = ${count.value}`);

	// 清理函数示例
	onInvalidate(() => {
		console.log("WatchEffect 清理函数被调用");
	});
});

// 6. 测试响应式更新
console.log("\n6. 测试响应式更新:");
console.log("--- 更新count ref ---");
count.value = 10;
console.log("doubleCount自动更新:", doubleCount.value);

console.log("--- 更新state对象 ---");
state.count = 20;
state.name = "Galaxy Reactive";
state.user.age = 30;

console.log("--- 更新嵌套对象 ---");
state.user.city = "Shanghai";

// 7. 数组响应式
console.log("\n7. 数组响应式:");
const items = reactive([1, 2, 3, 4, 5]);
const sum = computed(() => items.reduce((a, b) => a + b, 0));

console.log("初始数组:", items);
console.log("数组求和:", sum.value);

items.push(6);
console.log("添加元素后:", items);
console.log("新的求和:", sum.value);

// 8. toRefs示例
console.log("\n8. toRefs示例:");
const { count: stateCount, name } = toRefs(state);
console.log("解构的ref:", stateCount.value, name.value);

stateCount.value = 100;
console.log("通过ref更新后state:", state.count);

// 9. 停止监听
console.log("\n9. 停止监听:");
console.log("停止effect和watch...");
stopEffect();
stopWatch();
stopWatchEffect();

console.log("--- 更新数据（应该不会触发监听） ---");
count.value = 999;
state.count = 888;

console.log("\n✅ 所有测试完成！");
