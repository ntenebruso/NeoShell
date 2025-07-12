import app from "ags/gtk3/app";
import Astal from "gi://Astal?version=3.0";
import Gdk from "gi://Gdk?version=3.0";
import Gtk from "gi://Gtk?version=3.0";
import { idleInhibit } from "./shared";
import { ModuleManager } from "./utils/module";
import { registerCoreModules } from "./utils/coreModules";
import options from "../../options";
import { For } from "ags";

export default function Bar(monitor: Gdk.Monitor) {
    const { TOP, LEFT, RIGHT } = Astal.WindowAnchor;

    const moduleManager = new ModuleManager();
    registerCoreModules(moduleManager);

    return (
        <window
            name="Bar"
            class="Bar"
            namespace="bar"
            gdkmonitor={monitor}
            exclusivity={Astal.Exclusivity.EXCLUSIVE}
            anchor={TOP | LEFT | RIGHT}
            inhibit={idleInhibit}
            application={app}
        >
            <centerbox
                class="container"
                startWidget={
                    <box class="left" hexpand halign={Gtk.Align.START}>
                        {options.bar.modules.left.map((m) =>
                            moduleManager.getModule(m).component()
                        )}
                    </box>
                }
                centerWidget={
                    <box class="center" halign={Gtk.Align.CENTER}>
                        {options.bar.modules.center.map((m) =>
                            moduleManager.getModule(m).component()
                        )}
                    </box>
                }
                endWidget={
                    <box class="right" hexpand halign={Gtk.Align.END}>
                        {options.bar.modules.right.map((m) =>
                            moduleManager.getModule(m).component()
                        )}
                    </box>
                }
            ></centerbox>
        </window>
    );
}
