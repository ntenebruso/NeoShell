import { GLib, readFile } from "astal";

export const CONFIG_FILE = GLib.getenv("PRODUCTION")
    ? `${GLib.get_user_config_dir()}/neoshell/config.json`
    : `${SRC}/config/config.json`;

export function mkOptions<T extends object>(options: T): T {
    const rawOptions = readFile(CONFIG_FILE);

    let newOptions = {};
    if (rawOptions && rawOptions.trim() != "") {
        newOptions = JSON.parse(rawOptions);
    }

    const combinedOptions = Object.assign(options, newOptions);
    return combinedOptions;
}
