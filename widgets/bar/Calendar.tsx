import { GLib, GObject, Variable } from "astal";
import { App, Astal, astalify, ConstructProps, Gdk, Gtk } from "astal/gtk3";

class CalendarWidget extends astalify(Gtk.Calendar) {
    static {
        GObject.registerClass(this);
    }

    constructor(props: ConstructProps<CalendarWidget, Gtk.Calendar>) {
        super(props as any);
    }
}

function hide() {
    App.get_window("Calendar")!.hide();
}

function getCurrentDate() {
    return GLib.DateTime.new_now_local();
}

export default function Calendar() {
    const width = Variable(1000);
    const calendar = Variable<Gtk.Calendar | null>(null);

    <window
        name="Calendar"
        className="Calendar"
        anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.BOTTOM}
        layer={Astal.Layer.OVERLAY}
        margin={5}
        application={App}
        visible={false}
        onShow={(self) => {
            width.set(self.get_current_monitor().workarea.width);
            const date = getCurrentDate();
            calendar.get()?.select_month(date.get_month() - 1, date.get_year());
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
                <box vertical={true} className="container">
                    <label css="font-weight:bold;">Calendar</label>
                    <CalendarWidget setup={(self) => calendar.set(self)} />
                </box>
                <eventbox expand={true} onClick={hide} />
            </box>
            <eventbox
                expand
                onClick={hide}
                widthRequest={width((w) => w / 2)}
            />
        </box>
    </window>;
}
