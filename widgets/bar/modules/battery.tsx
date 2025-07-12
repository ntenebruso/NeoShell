import { createBinding } from "ags";
import { Gtk } from "ags/gtk3";
import Battery from "gi://AstalBattery?version=0.1";
import { Module } from "../utils/module";

function BatteryLevel() {
    const bat = Battery.get_default();

    function displayStr(time: number) {
        const minutes = Math.floor(time / 60);
        const hours = Math.floor(minutes / 60);
        const minutesLeft = Math.floor(minutes % 60);
        return `${hours}h ${minutesLeft}m`;
    }

    return (
        <box
            class="Battery item"
            visible={createBinding(bat, "isPresent")}
            tooltipText={createBinding(bat, "timeToEmpty").as(
                (t) => `${displayStr(t)} remaining`
            )}
        >
            <icon
                icon={createBinding(bat, "batteryIconName")}
                valign={Gtk.Align.CENTER}
                class="icon"
            />
            <label
                label={createBinding(bat, "percentage").as(
                    (p) => `${Math.floor(p * 100)}%`
                )}
            />
        </box>
    );
}

const module: Module = {
    component: BatteryLevel,
};

export default module;
