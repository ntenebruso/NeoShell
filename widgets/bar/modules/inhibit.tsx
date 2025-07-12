import Gtk from "gi://Gtk?version=3.0";
import { idleInhibit, setIdleInhibit } from "../shared";
import { Module } from "../utils/module";

function IdleInhibitor() {
    return (
        <box class="IdleInhibitor item" vertical={false}>
            <button
                halign={Gtk.Align.CENTER}
                onClick={() => setIdleInhibit(!idleInhibit.get())}
                label={idleInhibit.as((v) => (v ? "󱡥" : "󰥔"))}
            ></button>
        </box>
    );
}

const module: Module = {
    component: IdleInhibitor,
};

export default module;
