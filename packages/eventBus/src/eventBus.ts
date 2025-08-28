enum StringEvents {
	USER_LOGIN = "user:login",
	USER_LOGOUT = "user:logout",
	DATA_UPDATE = "data:update",
}

export class EventBus<T extends string> {
	eventStore: {
		[key in T]: TSFunction<void>[];
	};

	constructor() {
		this.eventStore = {} as {
			[key in T]: TSFunction<void>[];
		};
	}

	subscribe(event: T, callback: TSFunction<void>) {
		if (!this.eventStore[event]) {
			this.eventStore[event] = [callback];
			return;
		}
		this.eventStore[event].push(callback);
	}

	unsubscribe(event: T, callback: TSFunction<void>) {
		if (!this.eventStore[event]) {
			return;
		}
		this.eventStore[event] = this.eventStore[event].filter(
			(cb) => cb !== callback,
		);
	}

	once(event: T, callback: TSFunction<void>) {
		const wrapper = () => {
			callback();
			this.unsubscribe(event, callback);
		};
		if (!this.eventStore[event]) {
			this.eventStore[event] = [wrapper];
			return;
		}
		this.eventStore[event].push(wrapper);
	}

	publish(event: T) {
		this.eventStore[event].forEach((event) => event());
	}

	unsubscribeAll(event: T) {
		this.eventStore[event] = [];
	}
}

new EventBus<StringEvents>();
