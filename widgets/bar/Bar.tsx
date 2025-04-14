import { bind, Gio, GLib, Variable } from "astal";
import { App, Astal, Gdk, Gtk } from "astal/gtk3";
import { EventBox } from "astal/gtk3/widget";
import Battery from "gi://AstalBattery";
import Hyprland from "gi://AstalHyprland";
import Mpris from "gi://AstalMpris";
import Network from "gi://AstalNetwork";
import Tray from "gi://AstalTray";
import Wp from "gi://AstalWp";
import Brightness from "../../utils/brightness";
import launchApp from "../../utils/launch";
import Notifd from "gi://AstalNotifd";
import Indicators from "../../utils/indicators";

function createMenu(menuModel: Gio.MenuModel, actionGroup: Gio.ActionGroup) {
    const menu = Gtk.Menu.new_from_model(menuModel);
    menu.insert_action_group("dbusmenu", actionGroup);
    return menu;
}

function MenuEntry({ item }: { item: Tray.TrayItem }) {
    let menu: Gtk.Menu;

    const entryBinding = Variable.derive(
        [bind(item, "menuModel"), bind(item, "actionGroup")],
        (menuModel, actionGroup) => {
            menu = createMenu(menuModel, actionGroup);
        }
    );

    return (
        <button
            tooltipMarkup={bind(item, "tooltipMarkup")}
            usePopover={false}
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
            cursor="pointer"
        >
            <icon gicon={bind(item, "gicon")} />
        </button>
    );
}

function SysTray() {
    const tray = Tray.get_default();

    return (
        <box className="SysTray item">
            {bind(tray, "items").as((items) =>
                items.map((item) => <MenuEntry item={item} />)
            )}
        </box>
    );
}

function Wifi() {
    const network = Network.get_default();
    const wifi = bind(network, "wifi");

    return (
        <box visible={wifi.as(Boolean)}>
            {wifi.as(
                (wifi) =>
                    wifi && (
                        <icon
                            tooltipText={bind(wifi, "ssid").as(String)}
                            className="Wifi"
                            icon={bind(wifi, "iconName")}
                        />
                    )
            )}
        </box>
    );
}

function AudioSlider() {
    const wireplumber = Wp.get_default()!;
    const speaker = wireplumber.defaultSpeaker;

    return (
        <box className="AudioSlider item" css="min-width: 140px">
            <button
                onClick={(self, e) => {
                    if (e.button == Astal.MouseButton.PRIMARY) {
                        speaker.set_mute(!speaker.mute);
                    } else if (e.button == Astal.MouseButton.SECONDARY) {
                        launchApp("pavucontrol");
                    }
                }}
            >
                <icon icon={bind(speaker, "volumeIcon")} />
            </button>
            <slider
                hexpand
                onDragged={(self) => (speaker.volume = self.value)}
                value={bind(speaker, "volume")}
            />
            <label>
                {bind(speaker, "volume").as((v) => `${Math.floor(v * 100)}%`)}
            </label>
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
            className="Battery item"
            visible={bind(bat, "isPresent")}
            tooltipText={bind(bat, "timeToEmpty").as(
                (t) => `${displayStr(t)} remaining`
            )}
        >
            <icon
                icon={bind(bat, "batteryIconName")}
                valign={Gtk.Align.CENTER}
            />
            <label
                label={bind(bat, "percentage").as(
                    (p) => `${Math.floor(p * 100)}%`
                )}
            />
        </box>
    );
}

const idleInhibit = Variable(false);
function IdleInhibitor() {
    return (
        <box className="IdleInhibitor item" vertical={false}>
            <button
                halign={Gtk.Align.CENTER}
                onClick={() => idleInhibit.set(!idleInhibit.get())}
            >
                {bind(idleInhibit).as((v) => (v ? "󱡥" : "󰥔"))}
            </button>
        </box>
    );
}

function BrightnessLevel() {
    const brightness = Brightness.get_default();

    function handleScroll(self: EventBox, event: Astal.ScrollEvent) {
        if (event.delta_y < 0) {
            brightness.screen += 0.01;
        } else if (event.delta_y > 0) {
            brightness.screen -= 0.01;
        }
    }

    return (
        <eventbox onScroll={handleScroll}>
            <box className="Brightness item">
                <icon
                    icon="display-brightness-symbolic"
                    valign={Gtk.Align.CENTER}
                />
                <label
                    label={bind(brightness, "screen").as(
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
        <box className="Media">
            {bind(mpris, "players").as((ps) =>
                ps[0] ? (
                    <box>
                        <box
                            className="Cover"
                            valign={Gtk.Align.CENTER}
                            css={bind(ps[0], "coverArt").as(
                                (cover) => `background-image: url('${cover}');`
                            )}
                        />
                        <label
                            label={bind(ps[0], "metadata").as(
                                () => `${ps[0].title} - ${ps[0].artist}`
                            )}
                        />
                    </box>
                ) : (
                    <label label="Nothing Playing" />
                )
            )}
        </box>
    );
}

function Workspaces() {
    const hypr = Hyprland.get_default();

    return (
        <box className="Workspaces item">
            {bind(hypr, "workspaces").as((wss) =>
                wss
                    .filter((ws) => !(ws.id >= -99 && ws.id <= -2)) // filter out special workspaces
                    .sort((a, b) => a.id - b.id)
                    .map((ws) => (
                        <button
                            className={bind(hypr, "focusedWorkspace").as((fw) =>
                                ws === fw ? "focused" : ""
                            )}
                            onClicked={() => ws.focus()}
                        >
                            {ws.id}
                        </button>
                    ))
            )}
        </box>
    );
}

function FocusedClient() {
    const hypr = Hyprland.get_default();
    const focused = bind(hypr, "focusedClient");

    return (
        <box className="Focused" visible={focused.as(Boolean)}>
            {focused.as(
                (client) =>
                    client && <label label={bind(client, "title").as(String)} />
            )}
        </box>
    );
}

function Time({ format = "%H:%M - %A %e." }) {
    const time = Variable<string>("").poll(
        1000,
        () => GLib.DateTime.new_now_local().format(format)!
    );
    return (
        <eventbox onClick={() => App.toggle_window("Calendar")}>
            <box className="Time item">
                <label onDestroy={() => time.drop()} label={time()} />
            </box>
        </eventbox>
    );
}

function SysMenu() {
    const notifd = Notifd.get_default();

    return (
        <eventbox onClick={() => App.toggle_window("SysMenu")}>
            <box className="SysMenu item">
                <label
                    className={bind(notifd, "dontDisturb").as((d) =>
                        d ? "dnd" : ""
                    )}
                >
                    󱄅
                </label>
            </box>
        </eventbox>
    );
}

function CPUTemp() {
    const indicators = Indicators.get_default();

    return (
        <box className="CPUTemp item">
            <label className="icon"></label>
            <label>{bind(indicators, "cpuTemp").as((t) => `${t}°C`)}</label>
        </box>
    );
}

function MemUsage() {
    const indicators = Indicators.get_default();

    return (
        <box className="MemUsage item">
            <label className="icon">󰍛</label>
            <label>{bind(indicators, "memUsage").as((m) => `${m}%`)}</label>
        </box>
    );
}

export default function Bar(monitor: Gdk.Monitor) {
    const { TOP, LEFT, RIGHT } = Astal.WindowAnchor;

    return (
        <window
            name="Bar"
            className="Bar"
            namespace="bar"
            gdkmonitor={monitor}
            exclusivity={Astal.Exclusivity.EXCLUSIVE}
            anchor={TOP | LEFT | RIGHT}
            inhibit={idleInhibit()}
            application={App}
        >
            <centerbox className="container">
                <box hexpand halign={Gtk.Align.START}>
                    <SysMenu />
                    <Workspaces />
                    {/* <FocusedClient /> */}
                </box>
                <box>
                    <Time format="%I:%M" />
                </box>
                <box hexpand halign={Gtk.Align.END}>
                    <SysTray />
                    <IdleInhibitor />
                    <CPUTemp />
                    <MemUsage />
                    <BrightnessLevel />
                    <AudioSlider />
                    <BatteryLevel />
                </box>
            </centerbox>
        </window>
    );
}
