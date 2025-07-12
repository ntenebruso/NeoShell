import { createBinding, With } from "ags";
import Hyprland from "gi://AstalHyprland?version=0.1";
import { Module } from "../utils/module";

function FocusedClient() {
    const hypr = Hyprland.get_default();
    const focused = createBinding(hypr, "focusedClient");

    return (
        <box class="Focused item" visible={focused.as(Boolean)}>
            <With value={focused}>
                {(client) =>
                    client && (
                        <label
                            label={createBinding(client, "title").as(String)}
                        />
                    )
                }
            </With>
        </box>
    );
}

const module: Module = {
    component: FocusedClient,
};

export default module;
