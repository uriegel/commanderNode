import { Platform } from "../platformInterface"
import { Themes } from "../../themes/themes"
import { exec } from "child_process"

export class LinuxPlatform implements Platform {
    initializeThemes() {
        let light = 
        setInterval(() => {
            // TODO: when got focus
            exec('gsettings get org.gnome.desktop.interface gtk-theme', (error, stdout, stderr) =>{
                if (stdout.trimEnd().endsWith("dark'"))
                    console.log("dark")
            })
        }, 5000)
    }

    getCurrentTheme() {
        return Themes.LinuxLight
    }

    setThemeCallback(cb: (theme: Themes)=>void) {
        
    }

    readonly isLinux = true
}

// export let themeCallback: (light: boolean)=>void

// export function initialize() {
    // https://github.com/vilnius-leopold/node-gsettings/blob/master/README.md
//     "gsettings get org.gnome.desktop.interface gtk-theme"
//     return true
// }