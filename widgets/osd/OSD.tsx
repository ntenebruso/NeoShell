import { createState } from "ags";
import app from "ags/gtk3/app";
import { timeout } from "ags/time";
import Astal from "gi://Astal?version=3.0";
import Wp from "gi://AstalWp";
import Gdk from "gi://Gdk?version=3.0";
import Gtk from "gi://Gtk?version=3.0";
import Brightness from "../../utils/brightness";

export default function OSD(monitor: Gdk.Monitor) {
    const { TOP, BOTTOM, LEFT, RIGHT } = Astal.WindowAnchor;

    const speaker = Wp.get_default()?.get_default_speaker();
    const brightness = Brightness.get_default();

    const [visible, setVisible] = createState(false);
    const [value, setValue] = createState(0);
    const [iconName, setIconName] = createState("");

    let count = 0;
    function show(v: number, icon: string) {
        setVisible(true);
        setValue(v);
        setIconName(icon);
        count++;
        timeout(2000, () => {
            count--;
            if (count == 0) setVisible(false);
        });
    }

    if (speaker) {
        speaker.connect("notify::volume", () => {
            show(speaker.volume, speaker.volumeIcon);
        });

        speaker.connect("notify::mute", () => {
            show(speaker.volume, speaker.volumeIcon);
        });
    }

    brightness.connect("notify::screen", () => {
        show(brightness.screen, "display-brightness-symbolic");
    });

    return (
        <window
            class="OSD"
            layer={Astal.Layer.OVERLAY}
            anchor={BOTTOM}
            gdkmonitor={monitor}
            application={app}
        >
            <revealer
                revealChild={visible}
                transitionType={Gtk.RevealerTransitionType.SLIDE_UP}
            >
                <box class="OSD">
                    <icon icon={iconName} />
                    <levelbar widthRequest={100} value={value} />
                    <label
                        label={value((v) => `${Math.floor(v * 100)}%`)}
                    ></label>
                </box>
            </revealer>
        </window>
    );
}
