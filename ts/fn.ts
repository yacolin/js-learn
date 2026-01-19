/**
 * Parameters<Type>
 * 获取函数参数类型
 */
declare function f1(arg: { a: number; b: string }): void;

type Ty0 = Parameters<() => string>; // []
type Ty1 = Parameters<(s: string) => void>; // [string]
type Ty2 = Parameters<<T>(arg: T) => T>; // [unknown]
type Ty3 = Parameters<typeof f1>; // [{ a: number; b: string }]
type Ty4 = Parameters<any>; // unknown[]
type Ty5 = Parameters<never>; // never
// type Ty6 = Parameters<string>; // Error
// type Ty7 = Parameters<Function>; // Error

/**
 * ConstructorParameters<Type>
 * 获取构造函数参数类型
 */
type Ty8 = ConstructorParameters<ErrorConstructor>; // [message?: string]
type Ty9 = ConstructorParameters<FunctionConstructor>; // [string]
type Ty10 = ConstructorParameters<RegExpConstructor>; // [pattern?: string, flags?: string]
type Ty11 = ConstructorParameters<any>; // unknown[]
// type Ty12 = ConstructorParameters<Function>; // [string]

class X {
  constructor(a: number, b: string) {}
}
type Ty13 = ConstructorParameters<typeof X>; // [a: number, b: string]

/**
 * ReturnType<Type>
 * 获取函数返回值类型
 */
declare function f2(): { a: number; b: string };

type Ty14 = ReturnType<() => string>; // string
type Ty15 = ReturnType<(s: string) => void>; // void
type Ty16 = ReturnType<<T>(arg: T) => T>; // T
type Ty17 = ReturnType<typeof f2>; // { a: number; b: string }
type Ty18 = ReturnType<any>; // unknown
type Ty19 = ReturnType<never>; // unknown
// type Ty20 = ReturnType<string>; // Error
// type Ty21 = ReturnType<Function>; // any

/**
 * InstanceType<Type>
 * 获取类实例的类型
 */
class X1 {
  a = 1;
  b = "2";
}

type Ty22 = InstanceType<typeof X1>; // X1
type Ty23 = InstanceType<any>; // any
type Ty24 = InstanceType<never>; // unknown
// type Ty25 = InstanceType<string>; // Error
// type Ty26 = InstanceType<Function>; // any

/**
 * NoInfer<Type>
 * 禁止类型推导
 */
function createStreetLight<C extends string>(
  colors: C[],
  defaultColor?: NoInfer<C>
) {
  // ...
}

createStreetLight(["red", "yellow", "green"], "red"); // OK
// createStreetLight(["red", "yellow", "green"], "blue"); // Error

/**
 * ThisParameterType<Type>
 * 获取函数的 this 参数类型
 */
function toHex(this: Number) {
  return this.toString(16);
}

function numberToString(n: ThisParameterType<typeof toHex>) {
  return toHex.apply(n);
}

/**
 * OmitThisParameter<Type>
 * 删除函数的 this 参数
 */

function toHex1(this: Number) {
  return this.toString(16);
}

const fiveToHex: OmitThisParameter<typeof toHex1> = toHex1.bind(5);

console.log(fiveToHex());

/**
 * ThisType<Type>
 * 获取 this 参数类型
 */

type ObjectDescriptor<D, M> = {
  data?: D;
  methods?: M & ThisType<D & M>; // Type of 'this' in methods is D & M
};
function makeObject<D, M>(desc: ObjectDescriptor<D, M>): D & M {
  let data: object = desc.data || {};
  let methods: object = desc.methods || {};
  return { ...data, ...methods } as D & M;
}

let obj1 = makeObject({
  data: { x: 0, y: 0 },
  methods: {
    moveBy(dx: number, dy: number) {
      this.x += dx; // Strongly typed this
      this.y += dy; // Strongly typed this
    },
  },
});

obj1.x = 10;
obj1.y = 20;
obj1.moveBy(5, 5);
console.log(obj1.x, obj1.y);
