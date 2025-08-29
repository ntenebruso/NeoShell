import app from "ags/gtk3/app";
import Bar from "./widgets/bar/Bar";
import Calendar from "./widgets/bar/Calendar";
import Launcher from "./widgets/launcher/Launcher";
import NotificationPopups from "./widgets/notifications/NotificationPopups";
import OSD from "./widgets/osd/OSD";
import PowerMenu from "./widgets/powermenu/PowerMenu";
import SysMenu from "./widgets/sysmenu/SysMenu";
import { CSS_OUTPUT, generateColorScheme, generateCSS } from "./utils/styles";
import { CONFIG_FILE } from "./utils/options";
import { createBinding, For, This } from "ags";

generateColorScheme();
generateCSS();
console.log(CONFIG_FILE);

app.start({
    instanceName: "neoshell",
    css: CSS_OUTPUT,
    main() {
        const monitors = createBinding(app, "monitors");

        return (
            <box>
                <For each={monitors}>
                    {(monitor) => (
                        <This this={app}>
                            <Bar monitor={monitor} />
                            <NotificationPopups monitor={monitor} />
                            <OSD monitor={monitor} />
                        </This>
                    )}
                </For>
                <Calendar />
                <Launcher />
                <PowerMenu />
                <SysMenu />
            </box>
        );
    },
});
