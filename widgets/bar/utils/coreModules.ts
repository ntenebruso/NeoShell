import { ModuleManager } from "./module";

import audio from "../modules/audio";
import battery from "../modules/battery";
import brightness from "../modules/brightness";
import cpu from "../modules/cpu";
import focused from "../modules/focused";
import inhibit from "../modules/inhibit";
import media from "../modules/media";
import memory from "../modules/memory";
import sunset from "../modules/sunset";
import sysmenu from "../modules/sysmenu";
import systray from "../modules/systray";
import time from "../modules/time";
import wifi from "../modules/wifi";
import workspaces from "../modules/workspaces";

export function registerCoreModules(mm: ModuleManager) {
    mm.registerModule("audio", audio);
    mm.registerModule("battery", battery);
    mm.registerModule("brightness", brightness);
    mm.registerModule("cpu", cpu);
    mm.registerModule("focused", focused);
    mm.registerModule("inhibit", inhibit);
    mm.registerModule("media", media);
    mm.registerModule("memory", memory);
    mm.registerModule("sunset", sunset);
    mm.registerModule("sysmenu", sysmenu);
    mm.registerModule("systray", systray);
    mm.registerModule("time", time);
    mm.registerModule("wifi", wifi);
    mm.registerModule("workspaces", workspaces);
}
