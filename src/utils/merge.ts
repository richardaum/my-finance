import { isFunction } from "lodash";

export const mergeFunctions = <O, S>(objValue: O, srcValue: S) => {
  if (isFunction(objValue) && isFunction(srcValue)) {
    return <T>(...args: T[]) => {
      objValue(...args);
      srcValue(...args);
    };
  }
};
