import { exec, GLib, readFile, writeFile } from "astal";
import options from "../options";

const TMP = GLib.get_tmp_dir();
const VARS_FILE = `${TMP}/neoshell/variables.scss`;
const SCSS_FILE = `${SRC}/scss/style.scss`;
const SCSS_FILE_OUT = `${TMP}/neoshell/style.scss`;
export const CSS_OUTPUT = `${TMP}/neoshell/style.css`;

function getSavedColors() {
    const v = readFile(VARS_FILE);

    if (!v || v.trim() == "") return {};

    const cols: Record<string, string> = {};
    for (const line of v.split("\n")) {
        if (line.charAt(0) == "$") {
            const posDelim = line.indexOf(":");

            if (posDelim == -1) continue;

            const key = line.substring(1, posDelim);
            const val = line.substring(posDelim + 1, line.length - 1).trim();

            cols[key] = val;
        }
    }

    return cols;
}

function colorsToSASS(colors: Record<string, string>) {
    let str = "";

    for (const [key, value] of Object.entries(colors)) {
        str += `\$${key}: ${value};\n`;
    }

    return str;
}

export function generateColorScheme() {
    const currColors = options.colors;
    const savedColors = getSavedColors();

    if (JSON.stringify(currColors) == JSON.stringify(savedColors)) return;

    console.log("Color scheme not synced, syncing now...");

    const sass = colorsToSASS(currColors);
    writeFile(VARS_FILE, sass);

    console.log("Successfully updated colors");
}

export function generateCSS() {
    // const scss = readFile(SCSS_FILE);
    // const imports = `@forward '${VARS_FILE}';`;

    // const processed = `${imports}\n${scss}`;
    // writeFile(SCSS_FILE_OUT, processed);
    exec(
        `sass --load-path=${SRC}/scss --load-path=${TMP}/neoshell  ${SCSS_FILE} ${CSS_OUTPUT}`
    );
}
