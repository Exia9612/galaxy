import { Dep } from "./effect";

// ref function
class RefImpl {
	private _value: any;
	private _rawValue: any;
	public dep: Dep;
	public readonly _isRef = true;
}
