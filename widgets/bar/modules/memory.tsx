import { createBinding } from "ags";
import Indicators from "../../../utils/indicators";
import { Module } from "../utils/module";

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

const module: Module = {
    component: MemUsage,
};

export default module;
