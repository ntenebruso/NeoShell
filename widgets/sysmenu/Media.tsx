import { createBinding, createComputed, With } from "ags";
import Mpris from "gi://AstalMpris";
import Gtk from "gi://Gtk?version=3.0";

function lengthStr(len: number) {
    const min = Math.floor(len / 60);
    const sec = Math.floor(len % 60);
    const sec0 = sec < 10 ? "0" : "";
    return `${min}:${sec0}${sec}`;
}

function Player({ player }: { player: Mpris.Player }) {
    const pct = createComputed(
        [createBinding(player, "position"), createBinding(player, "length")],
        (pos, length) => {
            return pos / length;
        }
    );

    return (
        <box vertical class="player">
            <label
                class="song"
                label={createBinding(player, "title").as(
                    (title) => title || "No title"
                )}
            ></label>
            <label
                class="artist"
                label={createBinding(player, "artist").as(
                    (artist) => artist || "No artist"
                )}
            ></label>
            <box
                vertical={false}
                class="progress"
                visible={createBinding(player, "length").as((l) => l > 0)}
            >
                <label
                    label={createBinding(player, "position").as(lengthStr)}
                />
                <levelbar value={pct} hexpand />
                <label label={createBinding(player, "length").as(lengthStr)} />
            </box>
            <centerbox
                vertical={false}
                class="btn-group"
                centerWidget={
                    <box halign={Gtk.Align.CENTER}>
                        <button
                            visible={createBinding(player, "canGoPrevious")}
                            onClick={() => player.previous()}
                        >
                            󰒮
                        </button>
                        <button
                            visible={createBinding(player, "canControl")}
                            onClick={() => player.play_pause()}
                            label={createBinding(player, "playbackStatus").as(
                                (p) =>
                                    p == Mpris.PlaybackStatus.PLAYING
                                        ? ""
                                        : ""
                            )}
                        ></button>
                        <button
                            visible={createBinding(player, "canGoNext")}
                            onClick={() => player.next()}
                        >
                            󰒭
                        </button>
                    </box>
                }
            />
        </box>
    );
}

export default function Media() {
    const mpris = Mpris.get_default();
    return (
        <box vertical class="Media section">
            <box vertical={false}>
                <label class="icon" label="󰝚"></label>
                <label label="Media"></label>
            </box>
            <With value={createBinding(mpris, "players")}>
                {(players: Mpris.Player[]) => {
                    if (players.length == 0) {
                        return (
                            <label
                                class="none"
                                label="No media currently playing."
                                visible={players.length == 0}
                            ></label>
                        );
                    }

                    return <Player player={players[0]} />;
                }}
            </With>
        </box>
    );
}
