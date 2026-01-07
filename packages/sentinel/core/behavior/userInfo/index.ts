import { v4 as uuidv4 } from "uuid";
import { UserInfoMetric } from "./types";

export class UserInfo {
	userId: string;
	appId: string;

	constructor({ appId }: { appId: string }) {
		this.userId = this.generateUserId();
		this.appId = appId;
	}

	generateUserId() {
		return uuidv4();
	}

	getUserInfo(): UserInfoMetric {
		return {
			uid: this.userId,
			appId: this.appId,
		};
	}
}
