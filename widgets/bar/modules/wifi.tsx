import { createBinding, With } from "ags";
import Network from "gi://AstalNetwork?version=0.1";
import { Module } from "../utils/module";

function Wifi() {
    const network = Network.get_default();
    const wifi = createBinding(network, "wifi");

    return (
        <box class="Wifi item" visible={wifi.as(Boolean)}>
            <With value={wifi}>
                {(wifi) =>
                    wifi && (
                        <icon
                            tooltipText={createBinding(wifi, "ssid").as(String)}
                            class="icon"
                            icon={createBinding(wifi, "iconName")}
                        />
                    )
                }
            </With>
        </box>
    );
}

const module: Module = {
    component: Wifi,
};

export default module;
