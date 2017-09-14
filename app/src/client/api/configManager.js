const electron   = require("electron");
const path       = require("path");
const teeny      = require("teeny-conf"); // To handle config files


class ConfigManager {

    constructor(app) {
        this.workArea = electron.screen.getPrimaryDisplay().workArea;

        const defaultConfig = this.getDefaultConfig();
        const pathUserData = app.getPath("userData");

        this.conf = new teeny(path.join(pathUserData, "config.json"));
        this.conf.loadOrCreateSync(defaultConfig);

        // check config for update
        let configChanged = false;

        for (const key in defaultConfig) {
            if (this.conf.get(key) === undefined) {
                this.conf.set(key, defaultConfig[key]);
                configChanged = true;
            }
        }

        // save changed config
        if (configChanged) this.conf.saveSync();
    }

    getDefaultConfig() {
        return {
            theme: "light", // Or Dark
            sleepBlocker: true, // Automatically stop sleepBlocker
            autoUpdateChecker: false, // AutoUpdates should be optional
            useNativeFrame: true, // comment out later
            minimizeToTray: true,
            displayNotifications: true, // Allow flag to be editable
            devMode: false, // make optional later
            bounds: {
                width: 1080,
                height: 720,
                x: parseInt(this.workArea.width / 2),
                y: parseInt(this.workArea.height / 2)
            },
        };
    }

    getConfig() {
        return this.conf.getAll();
    }
}

module.exports = ConfigManager;
