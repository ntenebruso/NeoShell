import {
    GObject,
    interval,
    property,
    register,
    readFileAsync,
    readFile,
} from "astal";

@register()
export default class Indicators extends GObject.Object {
    private static instance: Indicators;
    static get_default() {
        if (!this.instance) this.instance = new Indicators();

        return this.instance;
    }

    #cpuTemp = 0;

    @property(Number)
    get cpuTemp() {
        return this.#cpuTemp;
    }

    #memUsage = 0;

    @property(Number)
    get memUsage() {
        return this.#memUsage;
    }

    private readMemInfo(): Record<string, number> {
        const memInfo: Record<string, number> = {};
        const v = readFile("/proc/meminfo");
        for (const line of v.split("\n")) {
            const posDelim = line.indexOf(":");

            if (posDelim == -1) continue;

            const key = line.substring(0, posDelim);
            const val = Number(
                line.substring(posDelim).replace(/\D/g, "").trim()
            );
            memInfo[key] = val;
        }

        return memInfo;
    }

    constructor() {
        super();

        interval(30000, () => {
            const v = readFile("/sys/class/thermal/thermal_zone0/temp");
            this.#cpuTemp = Number(v) / 1000;
            this.notify("cpu_temp");
        });

        interval(25000, () => {
            const memInfo = this.readMemInfo();
            this.#memUsage = Math.round(
                100 *
                    ((memInfo["MemTotal"] - memInfo["MemAvailable"]) /
                        memInfo["MemTotal"])
            );
            this.notify("mem_usage");
        });
    }
}
