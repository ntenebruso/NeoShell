import GLib from "gi://GLib?version=2.0";

export function throttle<T extends () => any>(fn: T, delay: number) {
    let timerFlag: GLib.Source | null = null;

    return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
        if (timerFlag == null) {
            fn.apply(this, args);
            timerFlag = setTimeout(() => {
                timerFlag = null;
            }, delay);
        }
    };
}
