import app from "ags/gtk3/app";
import Bar from "./widgets/bar/Bar";
import Calendar from "./widgets/bar/Calendar";
import Launcher from "./widgets/launcher/Launcher";
import NotificationPopups from "./widgets/notifications/NotificationPopups";
import OSD from "./widgets/osd/OSD";
import PowerMenu from "./widgets/powermenu/PowerMenu";
import SysMenu from "./widgets/sysmenu/SysMenu";
import { CSS_OUTPUT, generateColorScheme, generateCSS } from "./utils/styles";
import { CONFIG_FILE } from "./utils/options";
import { createBinding, For, This } from "ags";
import { Gdk, Gtk } from "ags/gtk3";

generateColorScheme();
generateCSS();
console.log(CONFIG_FILE);

// function mapMonitors(
//     widget: ({ monitor }: { monitor: Gdk.Monitor }) => Gtk.Widget
// ) {
//     const display = Gdk.Display.get_default();

//     if (display === null) return;

//     const numMonitors = display.get_n_monitors();
//     const instances = new Map<Gdk.Monitor, Gtk.Widget>();

//     for (let i = 0; i < numMonitors; i++) {
//         const monitor = display.get_monitor(i);

//         if (monitor !== null) {
//             instances.set(monitor, widget({ monitor }));
//         }
//     }

//     display.connect("monitor-added", (_, monitor) => {
//         console.log("MONITOR ADDED");
//         instances.set(monitor, widget({ monitor }));
//     });

//     display.connect("monitor-removed", (_, monitor) => {
//         // instances.get(monitor)?.destroy();
//         instances.delete(monitor);
//     });
// }

function MultiMonitorWidgets() {
    const monitors = createBinding(app, "monitors");

    return (
        <For each={monitors}>
            {(monitor) => (
                <This this={app}>
                    <Bar monitor={monitor} />
                    <NotificationPopups monitor={monitor} />
                    <OSD monitor={monitor} />
                </This>
            )}
        </For>
    );
}

app.start({
    instanceName: "neoshell",
    css: CSS_OUTPUT,
    main() {
        MultiMonitorWidgets();
        Calendar();
        Launcher();
        PowerMenu();
        SysMenu();
    },
});
