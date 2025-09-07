import { createBinding, createComputed, onCleanup } from "ags";
import { Astal, Gdk, Gtk } from "ags/gtk3";
import Wp from "gi://AstalWp?version=0.1";
import { Module } from "../utils/module";

function AudioSlider() {
    const wireplumber = Wp.get_default()!;
    const audio = wireplumber.audio;
    const speaker = wireplumber.defaultSpeaker;
    const menu = Gtk.Menu.new();

    const speakers = createBinding(audio, "speakers");

    const unsub = createComputed([
        speakers,
        createBinding(speaker, "deviceId"),
    ]).subscribe(() => {
        menu.foreach((w) => w.destroy());
        for (const speaker of speakers.get()) {
            const item = Gtk.CheckMenuItem.new();
            item.set_label(speaker.device.description);
            item.connect("activate", () => {
                speaker.set_is_default(true);
            });
            item.set_active(speaker.isDefault);
            menu.append(item);
            item.show();
        }
    });

    onCleanup(() => {
        unsub();
    });

    return (
        <box class="AudioSlider item" css="min-width: 140px">
            <button
                onClick={(self, e) => {
                    if (e.button == Astal.MouseButton.PRIMARY) {
                        speaker.set_mute(!speaker.mute);
                    } else if (e.button == Astal.MouseButton.SECONDARY) {
                        menu.popup_at_widget(
                            self,
                            Gdk.Gravity.NORTH,
                            Gdk.Gravity.SOUTH,
                            null
                        );
                    }
                }}
            >
                <icon
                    icon={createBinding(speaker, "volumeIcon")}
                    class="icon"
                />
            </button>
            <slider
                hexpand
                onChangeValue={(self) => {
                    speaker.volume = self.value;
                    return false;
                }}
                value={createBinding(speaker, "volume")}
                min={0}
                max={1}
                step={0.01}
            />
            <label
                class="value"
                label={createBinding(speaker, "volume").as(
                    (v) => `${Math.floor(v * 100)}%`
                )}
            ></label>
        </box>
    );
}

const module: Module = {
    component: AudioSlider,
};

export default module;
