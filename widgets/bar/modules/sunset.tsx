import { createState } from "ags";
import { execAsync } from "ags/process";
import { interval } from "ags/time";
import { throttle } from "../../../utils/throttle";
import { Module } from "../utils/module";
import options from "../../../options";

function Sunset() {
    const [status, setStatus] = createState(false);
    const currOptions = options.bar.modules.sunset;

    function checkStatus() {
        execAsync(
            `bash -c "pgrep -x hyprsunset > /dev/null && echo 'yes' || echo 'no'"`
        ).then((res) => {
            setStatus(res == "yes");
        });
    }

    function toggleSunset() {
        if (status.get() == false) {
            execAsync(
                `bash -c "nohup hyprsunset -t ${currOptions.temperature} > /dev/null &"`
            ).then(() => {
                checkStatus();
            });
        } else {
            execAsync(`bash -c "pkill -x hyprsunset"`).then(() => {
                checkStatus();
            });
        }
    }

    checkStatus();

    interval(2000, checkStatus);

    const toggleThrottle = throttle(toggleSunset, 1000);

    return (
        <box class="Sunset item">
            <button
                label={"󱩍"}
                class={status.as((s) => (s ? "active" : ""))}
                onClick={() => toggleThrottle()}
            ></button>
        </box>
    );
}

const module: Module = {
    component: Sunset,
};

export default module;
