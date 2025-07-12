// Default options are defined here.
// They will be overwritten by the options defined in config.json
// To make changes, please change config.json, not this file.

import { mkOptions } from "./utils/options";

const options = mkOptions({
    // Dracula is the default
    colors: {
        base00: "#282936",
        base01: "#3a3c4e",
        base02: "#4d4f68",
        base03: "#626483",
        base04: "#62d6e8",
        base05: "#e9e9f4",
        base06: "#f1f2f8",
        base07: "#f7f7fb",
        base08: "#ea51b2",
        base09: "#b45bcf",
        base0A: "#00f769",
        base0B: "#ebff87",
        base0C: "#a1efe4",
        base0D: "#62d6e8",
        base0E: "#b45bcf",
        base0F: "#00f769",
    },
    bar: {
        modules: {
            left: ["sysmenu", "workspaces", "focused"],
            center: ["time"],
            right: [
                "systray",
                "inhibit",
                "sunset",
                "cpu",
                "memory",
                "brightness",
                "audio",
                "battery",
            ],
        },
    },
    modules: {
        indicators: {
            cpuPollingInterval: 30000,
            memPollingInterval: 25000,
        },
    },
});

export default options;
