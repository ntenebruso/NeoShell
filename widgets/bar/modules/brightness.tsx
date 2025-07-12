import { createBinding } from "ags";
import { Astal, Gtk } from "ags/gtk3";
import Brightness from "../../../utils/brightness";
import { Module } from "../utils/module";

function BrightnessLevel() {
    const brightness = Brightness.get_default();

    function handleScroll(self: Astal.EventBox, event: Astal.ScrollEvent) {
        if (event.delta_y < 0) {
            brightness.screen += 0.01;
        } else if (event.delta_y > 0) {
            brightness.screen -= 0.01;
        }
    }

    return (
        <eventbox onScroll={handleScroll}>
            <box class="Brightness item">
                <icon
                    icon="display-brightness-symbolic"
                    valign={Gtk.Align.CENTER}
                    class="icon"
                />
                <label
                    label={createBinding(brightness, "screen").as(
                        (p) => `${Math.floor(p * 100)}%`
                    )}
                />
            </box>
        </eventbox>
    );
}

const module: Module = {
    component: BrightnessLevel,
};

export default module;
