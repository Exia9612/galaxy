enum StringEvents {
	USER_LOGIN = "user:login",
	USER_LOGOUT = "user:logout",
	DATA_UPDATE = "data:update",
}

// class EventBus<T extends string> {
// 	// eventStore: Map<T, ((...args: [any]) => void)[]>;
// 	eventStore: {
// 		[key in T]: Function[];
// 	};

// 	constructor() {
// 		this.eventStore = {} as {
// 			[key in T]: Function[];
// 		};
// 	}

// 	addEvent(event: T, callback: (...args: [any]) => void) {
// 		if (!this.eventStore[event]) {
// 			this.eventStore[event] = [callback];
// 			return;
// 		}
// 		this.eventStore[event].push(callback);
// 	}

// 	removeEvent(event: T, callback: Function) {
// 		if (!this.eventStore[event]) {
// 			return;
// 		}
// 		this.eventStore[event] = this.eventStore[event].filter(
// 			(cb) => cb !== callback,
// 		);
// 	}

// 	emitEvent(event: T) {
// 		this.eventStore[event].forEach((event) => event());
// 	}
// }

// new EventBus<StringEvents>();
