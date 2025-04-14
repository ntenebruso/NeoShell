import { App, Gdk, Gtk } from "astal/gtk3";
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

    for (const gdkmonitor of App.get_monitors()) {
        widgets.set(gdkmonitor, widget(gdkmonitor));
    }

    App.connect("monitor-added", (_, gdkmonitor) => {
        widgets.set(gdkmonitor, widget(gdkmonitor));
    });

    App.connect("monitor-removed", (_, gdkmonitor) => {
        widgets.get(gdkmonitor)?.destroy();
        widgets.delete(gdkmonitor);
    });
}

generateColorScheme();
generateCSS();
console.log(CONFIG_FILE);

App.start({
    instanceName: "neoshell",
    css: CSS_OUTPUT,
    // gtkTheme: "Adwaita-dark",
    main() {
        mapMonitors(Bar);
        mapMonitors(NotificationPopups);
        mapMonitors(OSD);

        Calendar();
        Launcher();
        OSD();
        PowerMenu();
        SysMenu();
    },
});
