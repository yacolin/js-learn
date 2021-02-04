// 手动实现hooks
// https://www.netlify.com/blog/2019/03/11/deep-dive-how-do-react-hooks-really-work/
// https://github.com/brickspert/blog/issues/26

function MyHooks() {
  let hooks = [],
    currentHook = 0;

  return {
    useEffect(callback, depArray) {
      const hasNoDeps = !depArray;
      const deps = hooks[currentHook];
      const hasChangeDeps = deps
        ? !depArray.every((el, i) => el === deps[i])
        : true;

      if (hasNoDeps || hasChangeDeps) {
        callback();
        hooks[currentHook] = depArray;
      }
      currentHook++;
    },

    useState(initialValue) {
      hooks[currentHook] = hooks[currentHook] || initialValue;
      const setStateHookIndex = currentHook;

      const setState = (newState) => (hooks[setStateHookIndex] = newState);
      return [hooks[currentHook++], setState];
    },
  };
}
