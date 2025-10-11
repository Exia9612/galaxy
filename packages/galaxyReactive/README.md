# Galaxy Reactive System

一个基于Vue3思路实现的响应式数据系统，提供完整的响应式编程能力。

## 特性

- 🚀 **高性能**: 基于Proxy实现，性能优异
- 📦 **轻量级**: 无外部依赖，体积小巧
- 🔧 **完整API**: 提供reactive、ref、computed、watch等完整API
- 🎯 **TypeScript**: 完整的TypeScript支持
- 🔄 **Vue3兼容**: API设计与Vue3保持一致

## 核心概念

### 响应式原理

1. **依赖收集**: 在读取响应式数据时收集依赖
2. **派发更新**: 在修改响应式数据时触发更新
3. **副作用管理**: 通过effect函数管理副作用

### 核心API

#### reactive - 响应式对象

```javascript
import { reactive } from "@galaxy/reactive";

const state = reactive({
	count: 0,
	user: {
		name: "Galaxy",
		age: 25,
	},
});

// 自动响应式
state.count++; // 触发更新
state.user.name = "New Name"; // 嵌套对象也是响应式的
```

#### ref - 响应式引用

```javascript
import { ref } from "@galaxy/reactive";

const count = ref(0);
const message = ref("Hello");

// 通过.value访问和修改
console.log(count.value); // 0
count.value = 10; // 触发更新
```

#### computed - 计算属性

```javascript
import { computed, ref } from "@galaxy/reactive";

const count = ref(0);
const doubleCount = computed(() => count.value * 2);

console.log(doubleCount.value); // 0
count.value = 5;
console.log(doubleCount.value); // 10 (自动更新)
```

#### watch - 监听器

```javascript
import { watch, ref } from "@galaxy/reactive";

const count = ref(0);

// 监听单个值
const stopWatch = watch(count, (newVal, oldVal) => {
	console.log(`count从${oldVal}变为${newVal}`);
});

// 监听多个值
watch([count, message], ([newCount, newMessage], [oldCount, oldMessage]) => {
	console.log("多个值发生变化");
});

// 深度监听
watch(
	state,
	(newVal) => {
		console.log("state发生变化", newVal);
	},
	{ deep: true },
);

// 立即执行
watch(count, callback, { immediate: true });
```

#### effect - 副作用

```javascript
import { effect, ref } from "@galaxy/reactive";

const count = ref(0);

const stopEffect = effect(() => {
	console.log(`当前count: ${count.value}`);
	// 这里会自动收集依赖
});

// 停止effect
stopEffect();
```

## 高级特性

### 只读响应式

```javascript
import { readonly } from "@galaxy/reactive";

const state = reactive({ count: 0 });
const readonlyState = readonly(state);

readonlyState.count = 10; // 警告：只读对象不能修改
```

### 浅响应式

```javascript
import { shallowReactive, shallowRef } from "@galaxy/reactive";

// 浅响应式对象（不递归转换嵌套对象）
const shallowState = shallowReactive({
	count: 0,
	user: { name: "Galaxy" }, // 这个对象不是响应式的
});

// 浅ref（不转换对象为响应式）
const shallowRefValue = shallowRef({ count: 0 });
```

### 自定义ref

```javascript
import { customRef } from "@galaxy/reactive";

const debouncedRef = customRef((track, trigger) => {
	let value = 0;
	let timeout;

	return {
		get() {
			track();
			return value;
		},
		set(newValue) {
			clearTimeout(timeout);
			timeout = setTimeout(() => {
				value = newValue;
				trigger();
			}, 500);
		},
	};
});
```

### toRefs - 解构响应式

```javascript
import { reactive, toRefs } from "@galaxy/reactive";

const state = reactive({
	count: 0,
	name: "Galaxy",
});

// 解构为ref，保持响应式
const { count, name } = toRefs(state);

// 现在count和name都是ref
count.value = 10; // 会更新state.count
```

## 工具函数

```javascript
import { isReactive, isRef, isProxy, unref, toRaw } from "@galaxy/reactive";

// 类型检查
isReactive(obj); // 是否为响应式对象
isRef(value); // 是否为ref
isProxy(value); // 是否为代理对象

// 值处理
unref(refValue); // 解包ref
toRaw(reactiveObj); // 获取原始对象
```

## 安装和使用

```bash
# 安装
npm install @galaxy/reactive

# 使用
import { reactive, ref, computed, watch } from '@galaxy/reactive';
```

## 构建

```bash
# 开发模式
npm run dev

# 构建
npm run build

# 测试
npm test
```

## 与Vue3的差异

1. **简化实现**: 专注于核心响应式功能，不包含Vue特有的功能
2. **独立运行**: 可以在任何JavaScript环境中使用
3. **更轻量**: 去除了Vue特有的优化和功能

## 性能特点

- 使用Proxy实现，性能接近原生对象操作
- 懒加载依赖收集，只在需要时创建依赖关系
- 智能的更新调度，避免不必要的重复计算

## 浏览器支持

- Chrome 49+
- Firefox 18+
- Safari 10+
- Edge 12+

需要Proxy支持，不支持IE。
