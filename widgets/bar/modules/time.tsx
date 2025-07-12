import app from "ags/gtk3/app";
import { createPoll } from "ags/time";
import GLib from "gi://GLib?version=2.0";
import { Module } from "../utils/module";

function Time() {
    const time = createPoll(
        "",
        1000,
        () => GLib.DateTime.new_now_local().format("%H:%M")!
    );

    return (
        <eventbox onClick={() => app.toggle_window("Calendar")}>
            <box class="Time item">
                <label label={time} />
            </box>
        </eventbox>
    );
}

const module: Module = {
    component: Time,
};

export default module;
