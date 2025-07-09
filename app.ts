import app from "ags/gtk3/app";
import Gtk from "gi://Gtk?version=3.0";
import Gdk from "gi://Gdk?version=3.0";
import Bar from "./widgets/bar/Bar";
import Calendar from "./widgets/bar/Calendar";
import Launcher from "./widgets/launcher/Launcher";
import NotificationPopups from "./widgets/notifications/NotificationPopups";
import OSD from "./widgets/osd/OSD";
import PowerMenu from "./widgets/powermenu/PowerMenu";
import SysMenu from "./widgets/sysmenu/SysMenu";
import { CSS_OUTPUT, generateColorScheme, generateCSS } from "./utils/styles";
import { CONFIG_FILE } from "./utils/options";

function mapMonitors(widget: (monitor: Gdk.Monitor) => Gtk.Widget) {
    const widgets = new Map<Gdk.Monitor, Gtk.Widget>();

    for (const gdkmonitor of app.get_monitors()) {
        widgets.set(gdkmonitor, widget(gdkmonitor));
    }

    app.connect("monitor-added", (_, gdkmonitor) => {
        widgets.set(gdkmonitor, widget(gdkmonitor));
    });

    app.connect("monitor-removed", (_, gdkmonitor) => {
        widgets.get(gdkmonitor)?.destroy();
        widgets.delete(gdkmonitor);
    });
}

generateColorScheme();
generateCSS();
console.log(CONFIG_FILE);

app.start({
    instanceName: "neoshell",
    css: CSS_OUTPUT,
    // gtkTheme: "Adwaita-dark",
    main() {
        mapMonitors(Bar);
        mapMonitors(NotificationPopups);
        mapMonitors(OSD);

        Calendar();
        Launcher();
        PowerMenu();
        SysMenu();
    },
});
