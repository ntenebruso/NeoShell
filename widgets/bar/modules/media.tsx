import { For, createBinding } from "ags";
import { Gtk } from "ags/gtk3";
import Mpris from "gi://AstalMpris?version=0.1";
import { Module } from "../utils/module";

function Media() {
    const mpris = Mpris.get_default();

    return (
        <box class="Media item">
            <For each={createBinding(mpris, "players")}>
                {(player: Mpris.Player, index) => (
                    <box>
                        <box
                            class="Cover"
                            valign={Gtk.Align.CENTER}
                            css={createBinding(player, "coverArt").as(
                                (cover) => `background-image: url('${cover}');`
                            )}
                        />
                        <label
                            label={createBinding(player, "metadata").as(
                                () => `${player.title} - ${player.artist}`
                            )}
                        />
                    </box>
                )}
            </For>
        </box>
    );
}

const module: Module = {
    component: Media,
};

export default module;
