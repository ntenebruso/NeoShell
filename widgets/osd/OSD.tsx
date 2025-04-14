import { App, Astal, Gtk, Gdk } from "astal/gtk3";
import { Variable } from "astal";
import { timeout } from "astal/time";
import Wp from "gi://AstalWp";
import Brightness from "../../utils/brightness";

export default function OSD(monitor: Gdk.Monitor) {
    const { TOP, BOTTOM, LEFT, RIGHT } = Astal.WindowAnchor;

    const speaker = Wp.get_default()?.get_default_speaker();
    const brightness = Brightness.get_default();

    const visible = Variable(false);
    const value = Variable(0);
    const iconName = Variable("");

    let count = 0;
    function show(v: number, icon: string) {
        visible.set(true);
        value.set(v);
        iconName.set(icon);
        count++;
        timeout(2000, () => {
            count--;
            if (count == 0) visible.set(false);
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
            className="OSD"
            layer={Astal.Layer.OVERLAY}
            anchor={BOTTOM}
            gdkmonitor={monitor}
            application={App}
        >
            <revealer
                revealChild={visible()}
                transitionType={Gtk.RevealerTransitionType.SLIDE_UP}
            >
                <box className="OSD">
                    <icon icon={iconName()} />
                    <levelbar widthRequest={100} value={value()} />
                    <label>{value((v) => `${Math.floor(v * 100)}%`)}</label>
                </box>
            </revealer>
        </window>
    );
}
