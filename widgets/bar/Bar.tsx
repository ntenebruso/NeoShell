import { createBinding, createComputed, createState, For, With } from "ags";
import app from "ags/gtk3/app";
import { createPoll } from "ags/time";
import Astal from "gi://Astal?version=3.0";
import Battery from "gi://AstalBattery";
import Hyprland from "gi://AstalHyprland";
import Mpris from "gi://AstalMpris";
import Network from "gi://AstalNetwork";
import Notifd from "gi://AstalNotifd";
import Tray from "gi://AstalTray";
import Wp from "gi://AstalWp";
import Gdk from "gi://Gdk?version=3.0";
import Gio from "gi://Gio?version=2.0";
import GLib from "gi://GLib?version=2.0";
import Gtk from "gi://Gtk?version=3.0";
import Brightness from "../../utils/brightness";
import Indicators from "../../utils/indicators";
import launchApp from "../../utils/launch";

function createMenu(menuModel: Gio.MenuModel, actionGroup: Gio.ActionGroup) {
    const menu = Gtk.Menu.new_from_model(menuModel);
    menu.insert_action_group("dbusmenu", actionGroup);
    return menu;
}

function MenuEntry({ item }: { item: Tray.TrayItem }) {
    let menu: Gtk.Menu;

    const entryBinding = createComputed(
        [createBinding(item, "menuModel"), createBinding(item, "actionGroup")],
        (menuModel, actionGroup) => {
            menu = createMenu(menuModel, actionGroup);
        }
    );
    entryBinding.get();

    return (
        <button
            tooltipMarkup={createBinding(item, "tooltipMarkup")}
            onClick={(self, e) => {
                if (e.button == Astal.MouseButton.PRIMARY) {
                    item.activate(0, 0);
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
            <icon gicon={createBinding(item, "gicon")} />
        </button>
    );
}

function SysTray() {
    const tray = Tray.get_default();

    return (
        <box class="SysTray item">
            <For each={createBinding(tray, "items")}>
                {(item: Tray.TrayItem, index) => <MenuEntry item={item} />}
            </For>
        </box>
    );
}

function Wifi() {
    const network = Network.get_default();
    const wifi = createBinding(network, "wifi");

    return (
        <box visible={wifi.as(Boolean)}>
            <With value={wifi}>
                {(wifi) =>
                    wifi && (
                        <icon
                            tooltipText={createBinding(wifi, "ssid").as(String)}
                            class="Wifi"
                            icon={createBinding(wifi, "iconName")}
                        />
                    )
                }
            </With>
        </box>
    );
}

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
                <icon icon={createBinding(speaker, "volumeIcon")} />
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

function BatteryLevel() {
    const bat = Battery.get_default();

    function displayStr(time: number) {
        const minutes = Math.floor(time / 60);
        const hours = Math.floor(minutes / 60);
        const minutesLeft = Math.floor(minutes % 60);
        return `${hours}h ${minutesLeft}m`;
    }

    return (
        <box
            class="Battery item"
            visible={createBinding(bat, "isPresent")}
            tooltipText={createBinding(bat, "timeToEmpty").as(
                (t) => `${displayStr(t)} remaining`
            )}
        >
            <icon
                icon={createBinding(bat, "batteryIconName")}
                valign={Gtk.Align.CENTER}
            />
            <label
                label={createBinding(bat, "percentage").as(
                    (p) => `${Math.floor(p * 100)}%`
                )}
            />
        </box>
    );
}

const [idleInhibit, setIdleInhibit] = createState(false);
function IdleInhibitor() {
    return (
        <box class="IdleInhibitor item" vertical={false}>
            <button
                halign={Gtk.Align.CENTER}
                onClick={() => setIdleInhibit(!idleInhibit.get())}
            >
                {idleInhibit.as((v) => (v ? "󱡥" : "󰥔")).get()}
            </button>
        </box>
    );
}

function BrightnessLevel() {
    const brightness = Brightness.get_default();

    function handleScroll(self: Astal.EventBox, event: Astal.ScrollEvent) {
        if (event.delta_y < 0) {
            brightness.screen += 0.01;
        } else if (event.delta_y > 0) {
            brightness.screen -= 0.01;
        }
    }

    return (
        <eventbox onScroll={handleScroll}>
            <box class="Brightness item">
                <icon
                    icon="display-brightness-symbolic"
                    valign={Gtk.Align.CENTER}
                />
                <label
                    label={createBinding(brightness, "screen").as(
                        (p) => `${Math.floor(p * 100)}%`
                    )}
                />
            </box>
        </eventbox>
    );
}

function Media() {
    const mpris = Mpris.get_default();

    return (
        <box class="Media">
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
                    >
                        {ws.id}
                    </button>
                )}
            </For>
        </box>
    );
}

function FocusedClient() {
    const hypr = Hyprland.get_default();
    const focused = createBinding(hypr, "focusedClient");

    return (
        <box class="Focused" visible={focused.as(Boolean)}>
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

function Time({ format = "%H:%M - %A %e." }) {
    const time = createPoll(
        "",
        1000,
        () => GLib.DateTime.new_now_local().format(format)!
    );

    return (
        <eventbox onClick={() => app.toggle_window("Calendar")}>
            <box class="Time item">
                <label label={time} />
            </box>
        </eventbox>
    );
}

function SysMenu() {
    const notifd = Notifd.get_default();

    return (
        <eventbox onClick={() => app.toggle_window("SysMenu")}>
            <box class="SysMenu item">
                <label
                    class={createBinding(notifd, "dontDisturb").as((d) =>
                        d ? "dnd" : ""
                    )}
                    label="󱄅"
                ></label>
            </box>
        </eventbox>
    );
}

function CPUTemp() {
    const indicators = Indicators.get_default();

    return (
        <box class="CPUTemp item">
            <label class="icon" label=""></label>
            <label
                label={createBinding(indicators, "cpuTemp").as((t) => `${t}°C`)}
            ></label>
        </box>
    );
}

function MemUsage() {
    const indicators = Indicators.get_default();

    return (
        <box class="MemUsage item">
            <label class="icon" label="󰍛"></label>
            <label
                label={createBinding(indicators, "memUsage").as((m) => `${m}%`)}
            ></label>
        </box>
    );
}

export default function Bar(monitor: Gdk.Monitor) {
    const { TOP, LEFT, RIGHT } = Astal.WindowAnchor;

    return (
        <window
            name="Bar"
            class="Bar"
            namespace="bar"
            gdkmonitor={monitor}
            exclusivity={Astal.Exclusivity.EXCLUSIVE}
            anchor={TOP | LEFT | RIGHT}
            inhibit={idleInhibit}
            application={app}
        >
            <centerbox
                class="container"
                startWidget={
                    <box hexpand halign={Gtk.Align.START}>
                        <SysMenu />
                        <Workspaces />
                        {/* <FocusedClient /> */}
                    </box>
                }
                centerWidget={
                    <box halign={Gtk.Align.CENTER}>
                        <Time format="%I:%M" />
                    </box>
                }
                endWidget={
                    <box hexpand halign={Gtk.Align.END}>
                        <SysTray />
                        <IdleInhibitor />
                        <CPUTemp />
                        <MemUsage />
                        <BrightnessLevel />
                        <AudioSlider />
                        <BatteryLevel />
                    </box>
                }
            ></centerbox>
        </window>
    );
}
