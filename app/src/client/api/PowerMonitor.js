const electron  = require("electron");

class PowerMonitor {

    enable() {
        const powerSaveBlocker = electron.powerSaveBlocker;

        // Active sleep blocker
        powerSaveBlocker.start('prevent-display-sleep')
    }
}

module.exports = PowerMonitor;
