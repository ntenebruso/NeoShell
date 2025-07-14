import { createBinding, With } from "ags";
import Hyprland from "gi://AstalHyprland?version=0.1";
import { Module } from "../utils/module";
import options from "../../../options";

function FocusedClient() {
    const hypr = Hyprland.get_default();
    const focused = createBinding(hypr, "focusedClient");
    const cutoff = options.bar.modules.focused.cutoff;

    return (
        <box class="Focused item" visible={focused.as(Boolean)}>
            <With value={focused}>
                {(client) =>
                    client && (
                        <label
                            label={createBinding(client, "title")
                                .as(String)
                                .as((v) =>
                                    v.length > cutoff
                                        ? `${v.slice(0, cutoff)}...`
                                        : v
                                )}
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
