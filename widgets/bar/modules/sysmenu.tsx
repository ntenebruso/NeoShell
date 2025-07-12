import { createBinding } from "ags";
import app from "ags/gtk3/app";
import Notifd from "gi://AstalNotifd?version=0.1";
import { Module } from "../utils/module";

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

const module: Module = {
    component: SysMenu,
};

export default module;
