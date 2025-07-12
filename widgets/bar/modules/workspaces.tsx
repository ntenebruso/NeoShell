import { For, createBinding } from "ags";
import Hyprland from "gi://AstalHyprland?version=0.1";
import { Module } from "../utils/module";

function Workspaces() {
    const hypr = Hyprland.get_default();

    return (
        <box class="Workspaces item">
            <For
                each={createBinding(hypr, "workspaces").as((wss) =>
                    wss
                        .filter((ws) => !(ws.id >= -99 && ws.id <= -2)) // filter out special workspaces
                        .sort((a, b) => a.id - b.id)
                )}
            >
                {(ws: Hyprland.Workspace, index) => (
                    <button
                        class={createBinding(hypr, "focusedWorkspace").as(
                            (fw) => (ws === fw ? "focused" : "")
                        )}
                        onClicked={() => ws.focus()}
                        label={createBinding(ws, "id").as(String)}
                    ></button>
                )}
            </For>
        </box>
    );
}

const module: Module = {
    component: Workspaces,
};

export default module;
