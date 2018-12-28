<template>
    <div class="main-settings-container" id="settings">
        <!-- Successfully exported -->
        <div class="success" :class="{'slide-in': exportedAll, 'hideModal': !exportedAll, red: exportedAllStatus == false}">
            <h3>{{ exportedAllStatus ? `Wrote all Notes to Backup file '${notesBackupPath}' Successfully!` : `Failed to write all Notes to Backup file '${notesBackupPath}'` }}</h3>
        </div>

        <div class="header">
            <div class="left">
                <!-- Reset (SVG) Button -->
                <svg class="reload" @click="reset" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="isolation:isolate" viewBox="292 11.865 17.448 15" width="17.448" height="15"><path d=" M 306.776 21.198 Q 308.316 19.362 308.316 19.362 C 308.544 19.09 308.948 19.055 309.219 19.283 C 309.49 19.51 309.526 19.914 309.298 20.185 C 309.298 20.185 306.62 23.377 306.62 23.377 C 306.392 23.648 305.989 23.683 305.718 23.456 C 305.718 23.456 302.332 20.615 302.332 20.615 C 302.061 20.387 302.025 19.984 302.253 19.712 C 302.481 19.44 302.885 19.405 303.156 19.633 C 303.156 19.633 305.351 21.475 305.351 21.475 C 306.223 19.049 305.492 16.272 303.498 14.599 C 300.87 12.394 296.939 12.737 294.733 15.365 C 292.528 17.994 292.873 21.925 295.501 24.13 C 297.515 25.82 300.388 26.062 302.652 24.732 C 302.957 24.553 303.35 24.654 303.529 24.96 C 303.711 25.263 303.608 25.657 303.303 25.835 C 300.569 27.438 297.105 27.149 294.677 25.112 C 291.507 22.452 291.093 17.71 293.752 14.542 C 296.41 11.373 301.153 10.958 304.322 13.617 C 306.533 15.473 307.46 18.454 306.776 21.198" fill-rule="evenodd"/></svg>
                <h3>
                    Settings
                </h3>
            </div>

            <div class="right">
                <!-- In case the user wants export all notes for backup -->
                <button class="first-btn" @click.self.prevent="importNotes">Import Notes</button>

                <!-- In case the user wants export all notes for backup -->
                <button @click.self.prevent="exportAll">Export All Notes</button>

                <!-- Cancel (SVG) Button -->
                <router-link to="/">
                    <svg class="cancel" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="isolation:isolate" viewBox="960 13 13 13" width="13" height="13"><g><path d="M 960.986 13.169 L 972.831 25.014 C 973.056 25.239 973.056 25.606 972.831 25.831 L 972.831 25.831 C 972.606 26.056 972.239 26.056 972.014 25.831 L 960.169 13.986 C 959.944 13.761 959.944 13.394 960.169 13.169 L 960.169 13.169 C 960.394 12.944 960.761 12.944 960.986 13.169 Z" style="stroke:none;stroke-miterlimit:10;"/><path d="M 960.169 25.014 L 972.014 13.169 C 972.239 12.944 972.606 12.944 972.831 13.169 L 972.831 13.169 C 973.056 13.394 973.056 13.761 972.831 13.986 L 960.986 25.831 C 960.761 26.056 960.394 26.056 960.169 25.831 L 960.169 25.831 C 959.944 25.606 959.944 25.239 960.169 25.014 Z" style="stroke:none;stroke-miterlimit:10;"/></g></svg>
                </router-link>
            </div>
        </div>

        <div class="content" @click="clearExportInfo">
            <!--  -->
            <div class="settings-options">
                <h3>
                    UI
                </h3>
                <div class="options-container">
                    <p>
                        Theme
                    </p>
                    <select v-model="settingsValues.theme" @change="changeProp('theme')">
                        <option v-for="theme in themes" v-bind:value="theme">{{ theme }}</option>
                    </select>
                    <p style="width: 60vw">
                        Value is either "Light", "Dark" or "Custom". <br />
                        Setting it to "Custom" requires that you specify the "Path".
                    </p>
                </div>
                <div class="options-container" style="height: 35px;margin-top: 10px">
                    <p>
                        Auto Night Mode
                    </p>
                    <label class="switch">
                        <input type="checkbox" v-model="autoNightMode" />
                        <span class="slider"></span>
                    </label>
                    <p style="width: 60vw">
                        Automatically changes theme depending on the current time of the day.<br />Night (18:00:00-06:00:00) and Light (06:00:00-18:00:00)
                    </p>
                </div>
                <div class="options-container" style="height: 35px;">
                    <p>
                        Display Info Modals
                    </p>
                    <label class="switch">
                        <input type="checkbox" v-model="displayInfoModals" />
                        <span class="slider"></span>
                    </label>
                    <p style="width: 60vw">
                        Display warning and success (modal) messages.
                    </p>
                </div>

                <h3 style="margin-top: 30px">Editor</h3>

                <div class="options-container" style="height: 40px">
                    <p>
                        Dictionary Language
                    </p>
                    <select v-model="settingsValues.lang" @change="changeProp('lang')">
                        <option v-for="lang in langs" v-bind:value="lang">{{ lang }}</option>
                    </select>
                    <p style="width: 60vw">
                        Language for dictionary to be used in spell-checking. E.g english (<code>'en-US'</code>, <code>'en-GB'</code>), french (<code>'fr-FR'</code>), etc
                    </p>
                </div>
                <div class="options-container">
                    <p>
                        Bullet List Marker
                    </p>
                    <input v-model="settingsValues.bulletListMarker" @input="changeProp('bulletListMarker')" />
                    <p style="width: 60vw">
                        List decoration Symbol to display i.e <code>square</code>, <code>decimal</code>, <code>disc</code>, etc
                    </p>
                </div>
                <div class="options-container">
                    <p>
                        Font Size
                    </p>
                    <input v-model="settingsValues.fontSize" @input="changeProp('fontSize')" />
                    <p style="width: 60vw">
                        Font Size of Text
                    </p>
                </div>
                <div class="options-container">
                    <p>
                        Text Font Family
                    </p>
                    <input v-model="settingsValues.textFontFamily" @input="changeProp('textFontFamily')" />
                    <p style="width: 60vw">
                        Font Family. Font must be locally installed in the computer
                    </p>
                </div>
                <div class="options-container">
                    <p>
                        LineHeight
                    </p>
                    <input v-model="settingsValues.lineHeight" @input="changeProp('lineHeight')" />
                    <p style="width: 60vw">
                        Height of space between lines
                    </p>
                </div>
                <div class="options-container" style="height: 40px">
                    <p>
                        Emojis Type
                    </p>
                    <select v-model="settingsValues.emojisType" @change="changeProp('emojisType')">
                        <option v-for="type in emojisTypes" v-bind:value="type">{{ type }}</option>
                    </select>
                    <p style="width: 60vw">
                        Emoji Pack to use in Markdown Preview. Either "GitHub" or "EmojiOne"
                    </p>
                </div>
                <div class="options-container" style="height: 40px;margin-top: 5px">
                    <p>
                        Auto Delimiter Completer
                    </p>
                    <label class="switch">
                        <input type="checkbox" v-model="autoDelimiterCompleter" />
                        <span class="slider"></span>
                    </label>
                    <p style="width: 60vw">
                        Automatically insert closing symbols (<code>^</code>, <code>~</code>, <code>$</code>, <code>`</code>, <code>*</code>, <code>'</code>, <code>"</code>, <code>)</code>, <code>]</code>, <code>}</code>) and tags (<code></{tagname}></code>)
                    </p>
                </div>
                <div class="options-container">
                    <p>
                        Tab Size
                    </p>
                    <input v-model="settingsValues.tabSize" @input="changeProp('tabSize')" />
                    <p style="width: 60vw">
                        Space each tab press occupies. Default "8"
                    </p>
                </div>

            </div>
            <div class="footer">
                <p>
                    <b>Note:</b> Press the reload button above to reset all values to their defaults
                </p>
            </div>
        </div>
    </div>
</template>

<script>
const {ipcRenderer, remote} = require('electron')

const os      = require('os')
const fs      = require('fs')
const path    = require('path')

const { Id, ClassNameSingle } = require('./../../util/document')

export default {
    name: 'Settings',
    data() {
        return {
            themes: [
                "Light", "Dark"
            ],
            emojisTypes: [
                "GitHub", "EmojiOne"
            ],
            langs: [
                'en-US',
                'en-GB',
                'fr-FR',
                'es-ES',
                'es-MX',
                'de-DE',
                'nl-NL',
                'pt-BR',
                'sv-SE'
            ]
        }
    },
    mounted() {
        // Set 'SettingsOpen' on updates
        this.$store.dispatch("loadFontSize", this.$route.name)
        this.$store.dispatch("loadFontFamily", this.$route.name)

        // Re-margin 'main-container'
        ClassNameSingle('main-container').style.marginLeft = "270px"

        // Scroll to active note
        ClassNameSingle('active').scrollIntoViewIfNeeded()

        ipcRenderer.on('exportedAll-status', (event, arg) => {
            this.$store.dispatch('setExportedAllStatus', arg)
        })
    },
    methods: {
        importNotes() {
            let importedNotes = null

            let filePath = remote.dialog.showOpenDialog(
                remote.getCurrentWindow(), {properties: ['openFiles']}
            )

            if (filePath) {
                fs.readFile(filePath[0], (err, data) => {
                    importedNotes = JSON.parse(data)
                    this.$store.dispatch('importNotes', importedNotes)
                })
            } else {throw "[Warn] Failed to import notes"}
        },
        exportAll() {
            let filePath = remote.dialog.showSaveDialog(
                remote.getCurrentWindow(), {}
            )

            if (filePath) {
                ipcRenderer.send("exportAll", {notes: this.$store.getters.notes, path: filePath})
                this.$store.dispatch('setExportedAll', true)
            }

            this.exportAllStatus = false
        },
        clearExportInfo() {
            this.$store.dispatch('setExportedAll', false)
            this.$store.dispatch('setExportedAllStatus', null)
        },
        changeProp(name) {
            this.$store.dispatch("changeSettings", {key: name, value: event.target.value})

            if (name == "theme") {
                // Cach the theme
                if (event.target.value != undefined) {
                    this.$store.dispatch("cacheTheme", event.target.value)
                }

                // re-load stylesheet
                this.$store.dispatch("loadStyle")
            }

            if (name == "fontSize") {
                this.$store.dispatch("loadFontSize", this.$route.name)
            }

            if (name == "textFontFamily") {
                this.$store.dispatch("loadFontFamily", this.$route.name)
            }

            if (name == 'lineHeight') {
                // change line height
                Id('app').style.lineHeight = this.settingsValues.lineHeight
            }

            if (name == 'emojisType') {
                this.$store.dispatch('loadEmojisPath', path.resolve())
            }
        },
        reset() {
            this.$store.dispatch("resetSettings")
            this.$store.dispatch("loadStyle")
            this.$store.dispatch("loadFontSize", this.$route.name)
        }
    },
    computed: {
        settingsValues() {
            return this.$store.getters.settings
        },
        autoDelimiterCompleter: {
            get() {
                return this.settingsValues.autoDelimiterCompleter
            },
            set(value) {
                this.$store.dispatch("changeSettings", {key: 'autoDelimiterCompleter', value: value})
            }
        },
        autoNightMode: {
            get() {
                return this.settingsValues.autoNightMode
            },
            set(value) {
                this.$store.dispatch("changeSettings", {key: 'autoNightMode', value: value})

                // Implicityly change to 'night mode' if its night time
                if (value == true && this.$store.dispatch("isNightTime")) {
                    this.$store.dispatch("changeSettings", {key: 'theme', value: 'Dark'})
                } else {
                    // otherwise, return to user's previously defined theme
                    this.$store.dispatch("changeSettings", {key: 'theme', value: this.cachedTheme})
                }

                this.$store.dispatch("loadStyle")
            }
        },
        displayInfoModals: {
            get() {
                return this.settingsValues.displayInfoModals
            },
            set(value) {
                this.$store.dispatch("changeSettings", {key: 'displayInfoModals', value: value})
            }
        },
        cachedTheme() {
            return this.$store.getters.cachedTheme
        },
        notesBackupPath() {
            return path.join(os.homedir(), path.sep, 'mynote.backup.json')
        },
        exportedAll: {
            get() {
                return this.$store.getters.exportedAll
            },
            set(value) {
                this.$store.dispatch('setExportedAll', value)
            }
        },
        exportedAllStatus() {
            return this.$store.getters.exportedAllStatus
        }
    }
}
</script>

<style scoped>
    .main-settings-container {
        height: 100vh;
    }

    .success {
        position: absolute;
        height: 15px;
        bottom: 50px;
        right: 40px;
        padding: 20px;
        border-radius: 5px;
        opacity: 1;
        transition: .3s ease-out;
    }

    .success h3, .warning h3 {
        font-size: 12px;
    }

    .slide-in {
        animation: slide .4s ease-out;
    }

    .hideModal {
        opacity: 0;
        transform: translateX(420px);
    }

    .header {
        display: flex;
        height: 40px;
        position: relative;
    }

    .left {
        float: left;
        display: flex;
        width: 100vw;
        padding-top: 12px;
        padding-left: 20px;
    }

    .left h3 {
        padding-left: 30px;
        margin: -3px;
        font-weight: 100;
    }

    .right {
        position: absolute;
        float: right;
        top: 12px;
        right: 20px;
        font-size: 14px !important;
    }

    .right button {
        cursor: pointer;
        width: 120px;
        position: absolute;
        border: none;
        border-radius: 2.5px;
        height: 25px;
        right: 30px;
        top: -5px;
        outline: none;
    }

    .right .first-btn {
        right: 165px;
    }

    .right button:active {
        transform: Scale(0.99);
    }

    .reload {
        cursor: pointer;
    }

    .cancel:active, .reload:active {
        transform: scale(0.9);
    }

    .content {
        height: 90vh;
        margin: 0;
        padding: 5vh;
        display: flex;
        flex-flow: column;
        position: relative;
    }

    .options-container {
        height: 30px;
        display: flex;
        justify-content: space-around;
    }

    .options-container p {
        font-size: smaller;
        width: 30vw;
    }

    .options-container input {
        width: 100px;
        height: 25px;
        margin-top: 10px;
        margin-right: 50px;
        outline: none;
        border: none;
    }

    .options-container select {
        margin-top: 16px;
        margin-right: 60px;
        margin-left: -5px;
        outline: none;
        width: 140px;
        height: 25px;
        border-radius: 2.5px;
        cursor: pointer;
    }

    .options-container select:hover {
        opacity: 0.9;
    }

    .options-container .switch {
        position: relative;
        display: inline-block;
        width: 45px;
        height: 20px;
        margin-top: 16px;
        margin-left: -5px;
        margin-right: 110px;
    }

    .options-container .switch input {
        opacity: 0;
        width: 0;
        height: 0;
    }

    .options-container .slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        border-radius: 34px;
        transition: .4s;
    }

    .options-container .slider:before {
        position: absolute;
        content: "";
        height: 10px;
        width: 10px;
        left: 5px;
        bottom: 5px;
        border-radius: 50%;
        transition: .4s;
    }

    .options-container input:checked + .slider:before {
        transform: translateX(25px);
    }

    .footer {
        position: absolute;
        bottom: 60px;
    }

    .footer p {
        font-size: smaller;
    }

    @keyframes slide {
        0% {
            opacity: 0.3;
            transform: translateX(420px);
        },
        25% {
            opacity: 0.5;
        },
        100% {
            opacity: 1;
            transform: translateX(0px);
        }
    }
</style>
