import GLib from "gi://GLib?version=2.0";
import app from "ags/gtk3/app";
import Astal from "gi://Astal?version=3.0";
import Gdk from "gi://Gdk?version=3.0";
import Gtk from "gi://Gtk?version=3.0";
import Notifications from "./Notifications";
import Media from "./Media";
import { createState, onCleanup } from "ags";
import { createPoll } from "ags/time";

function hide() {
    app.get_window("SysMenu")!.hide();
}

export default function SysMenu() {
    const [width, setWidth] = createState(1000);

    const time = createPoll(
        "",
        1000,
        () => GLib.DateTime.new_now_local().format("%I:%M")!
    );

    const date = createPoll(
        "",
        1000,
        () => GLib.DateTime.new_now_local().format("%A, %B %e %Y")!
    );

    return (
        <window
            name="SysMenu"
            class="SysMenu"
            anchor={
                Astal.WindowAnchor.TOP |
                Astal.WindowAnchor.BOTTOM |
                Astal.WindowAnchor.LEFT
            }
            layer={Astal.Layer.OVERLAY}
            visible={false}
            application={app}
            margin={5}
            onShow={(self) => {
                setWidth(self.get_current_monitor().workarea.width);
            }}
            $={(self) => onCleanup(() => self.destroy())}
        >
            <box>
                <box vertical>
                    <box class="container" vertical>
                        <box class="Time section" vertical>
                            <label class="time" label={time}></label>
                            <label class="date" label={date}></label>
                        </box>
                        <Notifications />
                        <Media />
                    </box>
                    <eventbox expand onClick={hide} />
                </box>
                <eventbox widthRequest={width} expand onClick={hide} />
            </box>
        </window>
    );
}
