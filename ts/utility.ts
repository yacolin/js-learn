/**
 * Awaited<Type>
 * This type is meant to model operations like await in async functions,
 * or the .then() method on Promises - specifically, the way that they recursively unwrap Promises.
 */
type A = Awaited<Promise<string>>; // string
type B = Awaited<Promise<Promise<number>>>; // number
type C = Awaited<string | Promise<number>>; // string | number

/**
 * Partial<Type>
 * Constructs a type with all properties of Type set to optional.
 * This utility will return a type that represents all subsets of a given type.
 */
interface Todo {
  title: string;
  description: string;
}

function updateTodo(todo: Todo, fieldsToUpdate: Partial<Todo>) {
  return { ...todo, ...fieldsToUpdate };
}

const todo1 = {
  title: "organize desk",
  description: "clear clutter",
};

const todo2 = updateTodo(todo1, { description: "throw out trash" });

/**
 * Required<Type>
 * Constructs a type consisting of all properties of Type set to required.
 */
interface Props {
  a?: number;
  b?: string;
}

const obj: Props = { a: 5 };

const obj2: Required<Props> = { a: 5, b: "hello" }; // Error: Property 'b' is missing

/**
 * Readonly<Type>
 * Constructs a type with all properties of Type set to readonly,
 * meaning the properties of the constructed type cannot be reassigned.
 * This utility is useful for preventing modifications to objects.
 */
interface Point {
  x: number;
  y: number;
}
const p1: Readonly<Point> = { x: 10, y: 20 };
// p1.x = 5; // Error: Cannot assign to 'x' because it is a read-only property.

/**
 * Record<Keys, Type>
 * Constructs an object type whose property keys are Keys and whose property values are Type.
 * This utility is useful for creating types that represent objects with a fixed set of keys.
 */
type CatName = "miffy" | "boris" | "mordred";

interface CatInfo {
  age: number;
  breed: string;
}

const cats: Record<CatName, CatInfo> = {
  miffy: { age: 10, breed: "Persian" },
  boris: { age: 5, breed: "Maine Coon" },
  mordred: { age: 16, breed: "British Shorthair" },
};

/**
 * Pick<Type, Keys>
 * Constructs a type by picking a set of properties Keys from Type.
 * This utility is useful for creating a new type with only a subset of the properties of an existing type.
 */
interface Todo1 {
  title: string;
  description: string;
  completed: boolean;
}

type TodoPreview = Pick<Todo1, "title" | "completed">;

const todo: TodoPreview = {
  title: "Clean room",
  completed: false,
};

/**
 * Omit<Type, Keys>
 * Constructs a type by omitting a set of properties Keys from Type.
 * This utility is useful for creating a new type with certain properties removed from an existing type.
 */
interface Todo2 {
  title: string;
  description: string;
  completed: boolean;
  createdAt: number;
}
type TodoPreview2 = Omit<Todo2, "description" | "createdAt">;

const todo3: TodoPreview2 = {
  title: "Clean room",
  completed: false,
};

/**
 * Exclude<UnionType, ExcludedMembers>
 * Constructs a type by excluding from UnionType all union members that are assignable to ExcludedMembers.
 * This utility is useful for creating a new type by removing specific types from a union.
 */
type T0 = Exclude<"a" | "b" | "c", "a">; // "b" | "c"
type T1 = Exclude<string | number | (() => void), Function>; // string | number

type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "square"; sideLength: number }
  | { kind: "rectangle"; width: number; height: number };

type T3 = Exclude<Shape, { kind: "circle" }>; // { kind: "square"; sideLength: number } | { kind: "rectangle"; width: number; height: number }

/**
 * Extract<UnionType, IncludedMembers>
 * Constructs a type by extracting from UnionType all union members that are assignable to IncludedMembers.
 * This utility is useful for creating a new type by selecting specific types from a union.
 */
type T4 = Extract<"a" | "b" | "c", "a" | "c" | "d">; // "a" | "c"
type T5 = Extract<string | number | (() => void), Function>; // () => void
type T6 = Extract<Shape, { kind: "circle" }>; // { kind: "circle"; radius: number }

/**
 * NonNullable<Type>
 * Constructs a type by excluding null and undefined from Type.
 * This utility is useful for creating types that do not allow null or undefined values.
 */
type T7 = NonNullable<string | number | null | undefined>; // string | number
type T8 = NonNullable<string[] | null | undefined>; // string[]
type T9 = NonNullable<null | undefined>; // never
type T10 = NonNullable<Shape | null>; // Shape
type T11 = NonNullable<Shape | undefined>; // Shape
type T12 = NonNullable<Shape | null | undefined>; // Shape
