import { createBinding } from "ags";
import { Astal } from "ags/gtk3";
import Wp from "gi://AstalWp?version=0.1";
import launchApp from "../../../utils/launch";
import { Module } from "../utils/module";

function AudioSlider() {
    const wireplumber = Wp.get_default()!;
    const speaker = wireplumber.defaultSpeaker;

    return (
        <box class="AudioSlider item" css="min-width: 140px">
            <button
                onClick={(self, e) => {
                    if (e.button == Astal.MouseButton.PRIMARY) {
                        speaker.set_mute(!speaker.mute);
                    } else if (e.button == Astal.MouseButton.SECONDARY) {
                        launchApp("pavucontrol");
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
                onDragged={(self) => (speaker.volume = self.value)}
                value={createBinding(speaker, "volume")}
            />
            <label
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
