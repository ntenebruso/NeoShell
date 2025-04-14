import { execAsync } from "astal";
import { App, Astal, Gdk, Gtk } from "astal/gtk3";

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
    App.toggle_window("PowerMenu");
    execAsync(`bash -c "${action}"`);
}

export default function PowerMenu() {
    return (
        <window
            name="PowerMenu"
            className="PowerMenu"
            layer={Astal.Layer.OVERLAY}
            exclusivity={Astal.Exclusivity.IGNORE}
            keymode={Astal.Keymode.EXCLUSIVE}
            application={App}
            onKeyPressEvent={(self, e) => {
                if (e.get_keyval()[1] == Gdk.KEY_Escape) {
                    self.hide();
                }
            }}
            visible={false}
        >
            <box className="container">
                {COMMANDS.map((command) => (
                    <button
                        onClick={() => execute(command.action)}
                        onKeyPressEvent={(self, e) => {
                            if (e.get_keyval()[1] == Gdk.KEY_Return) {
                                execute(command.action);
                            }
                        }}
                    >
                        <box vertical valign={Gtk.Align.CENTER}>
                            <label className="icon">{command.icon}</label>
                            <label>{command.name}</label>
                        </box>
                    </button>
                ))}
            </box>
        </window>
    );
}
