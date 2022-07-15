export namespace Failable {
  export type Success<T> = { value: T; type: "success" };
  export type Failure = { msg: string; stack: string[]; type: "failure" };

  export const success = <T>(v: T): Failable.Type<T> => {
    return { type: "success", value: v };
  };

  export const failure = <T>(msg: string): Failable.Type<T> => {
    return { type: "failure", stack: [], msg };
  };

  export const run = <T, V>(
    v: Failable.Type<T>,
    fn: Failable.Fn<T, V>
  ): Failable.Type<V> => {
    if (v.type === "failure") {
      return {
        ...v,
        stack: [...v.stack, fn.name],
      };
    }

    return fn(v.value);
  };

  export type Type<T> = Success<T> | Failure;

  export type Fn<T, V> = (v: T) => Failable.Type<V>;
  export type FailFn<T, V extends Failable.Type<T>> = (v: Failure) => V;

  export const fnFromExceptionThrowing = <T, V>(
    fn: (p: T) => V
  ): Failable.Fn<T, V> => {
    return (v: T) => {
      try {
        return Failable.success(fn(v));
      } catch (e: any) {
        return Failable.failure(e?.message ?? e.toString());
      }
    };
  };

  /**
   * If the input value is a success then it simply returns it,
   * If the input value is a failure then it runs and returns fn with the failure
   */
  export const runFailure = <T, V extends Failable.Type<T>>(
    v: Failable.Type<T>,
    fn: FailFn<T, Success<T> extends V ? Success<T> : Failable.Type<T>>
  ): Success<T> extends V ? Success<T> : Failable.Type<T> => {
    if (v.type === "success") {
      return v;
    }
    return fn(v);
  };

  export const unwrapFailure = <T>(v: Failure): T => {
    console.error(`
Failed
${v.msg}

Stack:
${v.stack.join("\n")}
    `);

    process.exit(1);
  };
}
