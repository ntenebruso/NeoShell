import { createState } from "ags";
import app from "ags/gtk3/app";
import Astal from "gi://Astal?version=3.0";
import GLib from "gi://GLib?version=2.0";
import Gtk from "gi://Gtk?version=3.0";

function hide() {
    app.get_window("Calendar")!.hide();
}

function getCurrentDate() {
    return GLib.DateTime.new_now_local();
}

export default function Calendar() {
    const [width, setWidth] = createState(1000);
    const [calendar, setCalendar] = createState<Gtk.Calendar | null>(null);

    return (
        <window
            name="Calendar"
            class="Calendar"
            anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.BOTTOM}
            layer={Astal.Layer.OVERLAY}
            margin={5}
            application={app}
            visible={false}
            onShow={(self) => {
                setWidth(self.get_current_monitor().workarea.width);
                const date = getCurrentDate();
                calendar
                    .get()
                    ?.select_month(date.get_month() - 1, date.get_year());
                calendar.get()?.select_day(date.get_day_of_month());
            }}
        >
            <box>
                <eventbox
                    expand
                    onClick={hide}
                    widthRequest={width((w) => w / 2)}
                />
                <box vertical>
                    <box vertical={true} class="container">
                        <label css="font-weight:bold;" label="Calendar"></label>
                        <Gtk.Calendar $={(self) => setCalendar(self)} />
                    </box>
                    <eventbox expand={true} onClick={hide} />
                </box>
                <eventbox
                    expand
                    onClick={hide}
                    widthRequest={width((w) => w / 2)}
                />
            </box>
        </window>
    );
}
