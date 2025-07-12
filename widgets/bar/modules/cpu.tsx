import { createBinding } from "ags";
import Indicators from "../../../utils/indicators";
import { Module } from "../utils/module";

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

const module: Module = {
    component: CPUTemp,
};

export default module;
