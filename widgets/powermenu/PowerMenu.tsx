import { execAsync } from "ags/process";
import app from "ags/gtk3/app";
import Astal from "gi://Astal?version=3.0";
import Gtk from "gi://Gtk?version=3.0";
import Gdk from "gi://Gdk?version=3.0";
import { onCleanup } from "ags";

const COMMANDS = [
    {
        name: "suspend",
        icon: "󰤁",
        action: "systemctl suspend",
    },
    {
        name: "lock",
        icon: "",
        action: "loginctl lock-session",
    },
    {
        name: "lock dpms",
        icon: "󰍹",
        action: "loginctl lock-session && sleep 3 && hyprctl dispatch dpms off",
    },
    {
        name: "logout",
        icon: "󰍃",
        action: "uwsm stop",
    },
    {
        name: "poweroff",
        icon: "",
        action: "systemctl poweroff",
    },
    {
        name: "reboot",
        icon: "",
        action: "systemctl reboot",
    },
];

function execute(action: string) {
    app.toggle_window("PowerMenu");
    execAsync(`bash -c "${action}"`);
}

export default function PowerMenu() {
    return (
        <window
            name="PowerMenu"
            class="PowerMenu"
            layer={Astal.Layer.OVERLAY}
            exclusivity={Astal.Exclusivity.IGNORE}
            keymode={Astal.Keymode.EXCLUSIVE}
            application={app}
            onKeyPressEvent={(self, e: Gdk.Event) => {
                if (e.get_keyval()[1] == Gdk.KEY_Escape) {
                    self.hide();
                }
            }}
            visible={false}
            $={(self) => onCleanup(() => self.destroy())}
        >
            <box class="container">
                {COMMANDS.map((command) => (
                    <button
                        onClick={() => execute(command.action)}
                        onKeyPressEvent={(self, e: Gdk.Event) => {
                            if (e.get_keyval()[1] == Gdk.KEY_Return) {
                                execute(command.action);
                            }
                        }}
                    >
                        <box vertical valign={Gtk.Align.CENTER}>
                            <label class="icon" label={command.icon}></label>
                            <label label={command.name}></label>
                        </box>
                    </button>
                ))}
            </box>
        </window>
    );
}
