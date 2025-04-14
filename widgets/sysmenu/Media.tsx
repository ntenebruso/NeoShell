import { bind, Variable } from "astal";
import { Gtk } from "astal/gtk3";
import Mpris from "gi://AstalMpris";

function lengthStr(len: number) {
    const min = Math.floor(len / 60);
    const sec = Math.floor(len % 60);
    const sec0 = sec < 10 ? "0" : "";
    return `${min}:${sec0}${sec}`;
}

function Player({ player }: { player: Mpris.Player }) {
    const pct: Variable<number> = Variable.derive(
        [bind(player, "position"), bind(player, "length")],
        (pos, length) => {
            return pos / length;
        }
    );

    return (
        <box vertical className="player">
            <label className="song">
                {bind(player, "title").as((title) => title || "No title")}
            </label>
            <label className="artist">
                {bind(player, "artist").as((artist) => artist || "No artist")}
            </label>
            <box
                vertical={false}
                className="progress"
                visible={bind(player, "length").as((l) => l > 0)}
            >
                <label>{bind(player, "position").as(lengthStr)}</label>
                <levelbar value={pct()} hexpand />
                <label>{bind(player, "length").as(lengthStr)}</label>
            </box>
            <centerbox vertical={false} className="btn-group">
                <box halign={Gtk.Align.CENTER}>
                    <button
                        visible={bind(player, "canGoPrevious")}
                        onClick={player.previous()}
                    >
                        󰒮
                    </button>
                    <button
                        visible={bind(player, "canControl")}
                        onClick={() => player.play_pause()}
                    >
                        {bind(player, "playbackStatus").as((p) =>
                            p == Mpris.PlaybackStatus.PLAYING ? "" : ""
                        )}
                    </button>
                    <button
                        visible={bind(player, "canGoNext")}
                        onClick={player.next()}
                    >
                        󰒭
                    </button>
                </box>
            </centerbox>
        </box>
    );
}

export default function Media() {
    const mpris = Mpris.get_default();
    return (
        <box vertical className="Media section">
            <box vertical={false}>
                <label className="icon">󰝚</label>
                <label>Media</label>
            </box>
            {bind(mpris, "players").as((players) => {
                if (players.length == 0) {
                    return (
                        <label className="none">
                            No media currently playing.
                        </label>
                    );
                }

                return <Player player={players[0]} />;
            })}
        </box>
    );
}
