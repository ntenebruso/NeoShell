import app from "ags/gtk3/app";
import { createPoll } from "ags/time";
import GLib from "gi://GLib?version=2.0";
import { Module } from "../utils/module";
import options from "../../../options";

function Time() {
    const currOptions = options.bar.modules.time;
    const time = createPoll(
        "",
        1000,
        () => GLib.DateTime.new_now_local().format(currOptions.format)!
    );

    function handleClick() {
        if (!currOptions.showCalendar) return;

        app.toggle_window("Calendar");
    }

    return (
        <eventbox onClick={handleClick}>
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
