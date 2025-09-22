import { createState, For, onCleanup } from "ags";
import app from "ags/gtk3/app";
import Astal from "gi://Astal?version=3.0";
import Apps from "gi://AstalApps";
import Gdk from "gi://Gdk?version=3.0";
import Gtk from "gi://Gtk?version=3.0";
import launchApp from "../../utils/launch";

const MAX_ITEMS = 8;

function hide() {
    app.get_window("Launcher")!.hide();
}

function AppButton({ app }: { app: Apps.Application }) {
    return (
        <button
            class="AppButton"
            onClicked={() => {
                launchApp(app.entry);
                hide();
            }}
        >
            <box>
                <icon icon={app.iconName} />
                <box valign={Gtk.Align.CENTER} vertical>
                    <label class="name" truncate xalign={0} label={app.name} />
                    {app.description && (
                        <label
                            class="description"
                            wrap
                            xalign={0}
                            label={app.description}
                        />
                    )}
                </box>
            </box>
        </button>
    );
}

export default function Applauncher() {
    const { CENTER } = Gtk.Align;
    const apps = new Apps.Apps();
    const [width, setWidth] = createState(1000);
    const [entry, setEntry] = createState<Gtk.Entry | null>(null);

    const [text, setText] = createState("");
    const list = text((text) => apps.fuzzy_query(text).slice(0, MAX_ITEMS));
    const onEnter = () => {
        launchApp(list.get()[0].entry);
        hide();
    };

    return (
        <window
            name="Launcher"
            class="Launcher"
            anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.BOTTOM}
            exclusivity={Astal.Exclusivity.IGNORE}
            keymode={Astal.Keymode.ON_DEMAND}
            application={app}
            onShow={(self) => {
                setText("");
                setWidth(self.get_current_monitor().workarea.width);
                entry.get()?.grab_focus();
            }}
            onKeyPressEvent={function (self, event: Gdk.Event) {
                if (event.get_keyval()[1] === Gdk.KEY_Escape) self.hide();
            }}
            visible={false}
            $={(self) => onCleanup(() => self.destroy())}
        >
            <box>
                <eventbox
                    widthRequest={width((w) => w / 2)}
                    expand
                    onClick={hide}
                />
                <box hexpand={false} vertical>
                    <eventbox heightRequest={100} onClick={hide} />
                    <box widthRequest={500} class="Applauncher" vertical>
                        <entry
                            placeholderText="Search"
                            text={text}
                            onKeyReleaseEvent={(self) => setText(self.text)}
                            onActivate={onEnter}
                            $={(self) => setEntry(self)}
                        />
                        <box spacing={6} vertical>
                            <For each={list}>
                                {(item, index) => <AppButton app={item} />}
                            </For>
                        </box>
                        <box
                            halign={CENTER}
                            class="not-found"
                            vertical
                            visible={list.as((l) => l.length === 0)}
                        >
                            <icon icon="system-search-symbolic" />
                            <label label="No match found" />
                        </box>
                    </box>
                    <eventbox expand onClick={hide} />
                </box>
                <eventbox
                    widthRequest={width((w) => w / 2)}
                    expand
                    onClick={hide}
                />
            </box>
        </window>
    );
}
