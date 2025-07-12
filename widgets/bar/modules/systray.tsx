import { createBinding, createComputed, For } from "ags";
import { Astal } from "ags/gtk3";
import Tray from "gi://AstalTray?version=0.1";
import Gdk from "gi://Gdk?version=3.0";
import Gio from "gi://Gio?version=2.0";
import Gtk from "gi://Gtk?version=3.0";
import { Module } from "../utils/module";

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

const module: Module = {
    component: SysTray,
};

export default module;
