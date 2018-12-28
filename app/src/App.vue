<template>
    <div id='app'
    v-hotkey="keymap"
    @dragover.prevent
    @drop.prevent>
        <notes-list></notes-list>
        <transition name="fade">
            <div class="main-container" >
                <router-view></router-view>
            </div>
        </transition>
    </div>
</template>

<script>
    import NotesList  from './views/NotesList.vue'
    import Editor     from './views/Editor.vue'

    const {ipcRenderer, remote} = require('electron')

    const { buildMap } = require('./util/object')
    const { Id, ClassNameSingle, ClassNameN } = require('./util/document')

    const os    = require('os')
    const path  = require('path')

    export default {
        data() {
            return {
                platform: os.platform()
            }
        },
        created() {
            // Disable Js 'eval' built-in function for security reasons
            window.eval = global.eval = () => {
                console.log("[Notice] 'MyNote' doesn't support 'window.eval' for security reasons")
                throw new Error("[Security Alert]")
            }

            // Load last 'route'
            this.$router.push(this.$store.getters.cachedRoute)
        },
        mounted() {
            // ensure styling is suitable for current Window size
            this.loadWindowSize()

            this.$store.dispatch('loadEmojisPath', path.resolve())

            // Load stylesheet
            this.$store.dispatch("loadStyle")

            // Load fonts
            this.$store.dispatch("loadFontSize", this.$route.name)

            // Load font-family
            this.$store.dispatch("loadFontFamily", this.$route.name)

            // Check if sideNavHidden
            if (this.sideNavHidden) {
                this.slidePane(true)
            }

            // and showToolset
            // ... to restore their state
            if (this.showToolset) {
                this.slideToolset()
            }

            // Wtahc for all App related shortcut events from Main Reneder
            ipcRenderer.on('short_newNote', (event, arg) => {
                this.short_newNote()
            })

            ipcRenderer.on('short_exportNote', (event, arg) => {
                this.short_exportNote()
            })

            ipcRenderer.on('short_toggleMD', (event, arg) => {
                this.short_toggleMD()
            })

            ipcRenderer.on('short_toggleNightmode', (event, arg) => {
                this.short_toggleNightmode()
            })

            ipcRenderer.on('short_toggleSearch', (event, arg) => {
                this.short_toggleSearch()
            })

            ipcRenderer.on('short_toggleTools', (event, arg) => {
                this.short_toggleTools()
            })

            ipcRenderer.on('short_hideSidenav', (event, arg) => {
                this.short_hideSidenav()
            })

            ipcRenderer.on('short_openSettings', (event, arg) => {
                this.short_openSettings()
            })

            ipcRenderer.on('short_incFontSize', (event, arg) => {
                this.short_incFontSize()
            })

            ipcRenderer.on('short_decFontSize', (event, arg) => {
                this.short_decFontSize()
            })

            // recieve full screen prompt
            ipcRenderer.on('enter-fullscreen', (event, data) => {
                ClassNameSingle('notes-list-canvas').style.height = "440px"
            })

            ipcRenderer.on('leave-fullscreen', (event, data) => {
                ClassNameSingle('notes-list-canvas').style.height = "300px"
            })

            if (this.notes.length > 0) {
                // Scroll to active note
                ClassNameSingle('active').scrollIntoViewIfNeeded()
            }
        },
        updated() {
            this.$store.dispatch("loadFontFamily", this.$route.name)
        },
        watch: {
            '$route' (to, from) {
                if (to.name == "Settings") {
                    this.$store.dispatch("setSettingsOpen", true)
                } else {
                    this.$store.dispatch("setSettingsOpen", false)
                }

                this.$store.dispatch('cacheRoute', to.path)
            }
        },
        computed: {
            keymap() {
                return buildMap([
                    this.resolveTrigger().concat('r'),
                    'alt+'.concat(this.resolveTrigger().concat('r')),
                    this.resolveTrigger().concat('n'),
                    this.resolveTrigger().concat('e'),
                    this.resolveTrigger().concat('f'),
                    this.resolveTrigger().concat('g'),
                    this.resolveTrigger().concat('t'),
                    this.resolveTrigger().concat('h'),
                    this.resolveTrigger().concat(','),
                    this.resolveTrigger().concat('shift+m'),
                    this.resolveTrigger().concat('q'),
                    this.resolveTrigger().concat('shift+i'),
                    this.resolveTrigger().concat('='),
                    this.resolveTrigger().concat('-')
                ], [
                    this.short_reloadWindow,
                    this.short_reloadWindow,
                    this.short_newNote,
                    this.short_exportNote,
                    this.short_toggleSearch,
                    this.short_toggleTools,
                    this.short_toggleNightmode,
                    this.short_hideSidenav,
                    this.short_openSettings,
                    this.short_toggleMD,
                    this.short_quitApp,
                    this.short_toggleDevTools,
                    this.short_incFontSize,
                    this.short_decFontSize
                ])
            },
            notes() {
                return this.$store.getters.notes
            },
            currentFontSize() {
                return this.$store.getters.fontSize
            },
            sideNavHidden () {
                return this.$store.getters.sideNavHidden
            },
            showToolset() {
                return this.$store.getters.showToolset
            },
            markedown() {
                return this.$store.getters.live
            }
        },
        methods: {
            resolveTrigger() {
                // Resolve 'CommandOrControl' as trigger depending of the platform
                // All shortcuts for mac are 'Command'
                // ... and Win/Linux 'Control'
                return this.platform == 'darwin' ? 'commad+' : 'ctrl+'
            },
            // App Behaviour
            short_newNote() {
                if (this.$route.name == 'Editor') {
                    this.$children[0].openModal('title')
                }
            },
            short_exportNote() {
                if (this.$route.name == 'Editor') {
                    this.$children[0].openModal('exportFile')
                }
            },
            short_openSettings() {
                this.$router.push(this.$route.path == "/" ? 'settings' : '/')
            },
            short_hideSidenav() {
                this.slidePane()
            },
            short_toggleSearch() {
                if (!this.markedown) {
                    this.$store.dispatch('toggleSpanel')
                }
            },
            short_toggleTools() {
                if (this.$route.name == 'Editor') {
                    this.$children[0].slideToolsetBtns(false)
                }
            },
            short_toggleMD() {
                if (this.$route.name == 'Editor') {
                    this.$children[1].$children[0].toggleLiveMode()
                }
            },
            short_toggleNightmode() {
                this.$children[0].toggleNM()
            },
            short_quitApp() {
                ipcRenderer.send('quit-app', null)
            },
            short_toggleDevTools() {
                ipcRenderer.send('toggle-dev-tools', null)
            },
            short_reloadWindow() {
                ipcRenderer.send('reload-window', null)
            },
            short_incFontSize() {
                this.$store.dispatch("setFontSize", this.currentFontSize + 1)
                this.$store.dispatch("loadFontSize", this.$route.name)
            },
            short_decFontSize() {
                this.$store.dispatch("setFontSize", this.currentFontSize - 1)
                this.$store.dispatch("loadFontSize", this.$route.name)
            },
            // EOD
            loadWindowSize() {
                ipcRenderer.send('setWindowSize', remote.getCurrentWindow().getContentSize())
            },
            setSideNavHidden(value) {
                this.$store.dispatch('setSideNavHidden', value)
            },
            slideToolset() {
                if (["", "0px"].includes(Id('toolset').style.width)) {
                    Id('toolset').style.width = "240px"

                    // add setDefaultTimout to '2secs' to delay animation of buttons
                    var animEv = () => {
                        for (var i = 0;i < 6;i++) {
                            ClassNameN('toolset-btns-holder', i).style.visibility = 'visible'
                        }
                    }

                    window.setTimeout(animEv, 225)
                    window.clearTimeout(animEv)
                } else {
                    Id('toolset').style.width = "0px"

                    for (var i = 0;i < 6;i++) {
                        ClassNameN('toolset-btns-holder', i).style.visibility = 'hidden'
                    }
                }
            },
            slidePane(force=false) {
                // close toolset if open
                this.setSideNavHidden(false)

                if ("0px" == Id('notes-list').style.width) {
                    Id('toolset').style.width = "0px"

                    function rest() {
                        Id('notes-list').style.visibility = 'visible'
                        Id('notes-list').style.width = "270px"
                        Id('editor') ? Id('editor').style.marginLeft = '0px' : ClassNameSingle('main-container').style.marginLeft = "270px"
                    }

                    // We want to give the effect off it (i.e the toolset) being closed all along
                    window.setTimeout(rest, 200)
                    window.clearTimeout(rest)
                } else if (!("0px" == Id('notes-list').style.width) || force) {
                    this.setSideNavHidden(true)

                    Id('notes-list').style.visibility = 'hidden'
                    Id('notes-list').style.width = "0px"
                    Id('editor') ? Id('editor').style.marginLeft = '-270px' : ClassNameSingle('main-container').style.marginLeft = "0px"

                    for (var i = 0;i < 6;i++) {
                        ClassNameN('toolset-btns-holder', i).style.visibility = 'hidden'
                    }
                }
            }
        },
        beforeDestroy() {
            // Cache last 'route'
            this.$store.dispatch("cacheRoute", this.$route.path)
        },
        components: {
            NotesList,
            Editor
        }
    }
</script>

<style>
    @font-face {
    	font-family: 'Lato';
    	src: url('./styles/font/Lato-Regular.ttf');
    }

    html, #app {
        border: 0;
        margin: 0;
        padding: 0;
        height: 100%;
        overflow: hidden;
    }

    body {
        margin: 0;
        padding: 0;
        border: 0;
        height: 100%;
        max-height: 100%;
        position: relative;
    }

    .main-container {
        height: 100%;
        margin-left: 270px;
        transition: all 0.2s ease;
    }

    .fade-enter-active, .fade-leave-active {
        transition: all 0.3s ease-in;
    }

    .fade-enter, .fade-leave-active {
        opacity: 0;
    }

    #screen a {
    	text-decoration: none !important;
    }

    #screen a.anchor {
    	display: block !important;
    	padding-left: 30px !important;
    	margin-left: -30px !important;
    	cursor: pointer !important;
    	position: absolute !important;
    	top: 0 !important;
    	left: 0 !important;
    	bottom: 0 !important;
    }

    img, svg {
        -webkit-user-drag: none;
        user-select:none;
        -webkit-user-drag: none;
        -webkit-user-select: none;
    }

    footer {
    	position: absolute;
    	flex-direction: row;
    	width: 100%;
    	bottom: 0;
    	height: 40px;
    	display: flex;
    	justify-content: space-between;
    }

    footer #show {
    	padding-top: 6px;
    }

    footer #write {
    	padding-top: 4px;
    }

    footer #bin {
    	padding-top: 4px;
    	padding-left: 6px;
    }

    footer #search {
    	display: flex;
    	padding-top: 2px;
    }

    footer #search svg {
    	margin-right: 6px;
    }

    footer #search input {
    	font-size: 14px;
    	margin-top: 6px;
    	padding: 4px;
        border-top: 0;
        border-left: 0;
        border-right: 0;
    	border-bottom-width: 0.4px;
    	outline: none;
    	user-select: none;
    	height: 22px;
    }

    footer #file svg {
    	padding-top: 2px;
    }

    h1, h2, h3, h4, h5, h6 {
    	margin: 20px 0 10px;
    	padding: 0;
    	font-weight: bold;
    	-webkit-font-smoothing: antialiased;
    	cursor: text;
    	position: relative;
    }

    h2:first-child, h1:first-child, h1:first-child + h2, h3:first-child, h4:first-child, h5:first-child, h6:first-child {
    	margin-top: 0;
    	padding-top: 0;
    }

    h1:hover a.anchor, h2:hover a.anchor, h3:hover a.anchor, h4:hover a.anchor, h5:hover a.anchor, h6:hover a.anchor {
    	text-decoration: none;
    }

    h1 tt, h1 code {
    	font-size: inherit;
    }

    h2 tt, h2 code {
    	font-size: inherit;
    }

    h3 tt, h3 code {
    	font-size: inherit;
    }

    h4 tt, h4 code {
    	font-size: inherit;
    }

    h5 tt, h5 code {
    	font-size: inherit;
    }

    h6 tt, h6 code {
    	font-size: inherit;
    }

    h1 {
    	font-size: 28px;
    }

    h2 {
    	font-size: 24px;
        padding-bottom: 6px;
    }

    h3 {
    	font-size: 18px;
    }

    h4 {
    	font-size: 16px;
    }

    h5 {
    	font-size: 14px;
    }

    h6 {
    	font-size: 14px;
    }

    p, blockquote, ul, ol, dl, li, table, pre {
        margin: 15px 0;
    }

    hr {
        width: 80px;
    	border: 0 none;
    	border-top: none;
    	border-left: none;
    	border-right: none;
    	border-bottom-style: dashed;
    	border-bottom-width: 1.5px;
        height: 4px;
        padding: 0;
        margin-top: 50px;
        margin-bottom: 50px;
        margin-left: 45%;
    }

    body > h2:first-child {
    	margin-top: 0;
    	padding-top: 0;
    }

    body > h1:first-child {
    	margin-top: 0;
    	padding-top: 0;
    }

    body > h1:first-child + h2 {
    	margin-top: 0;
    	padding-top: 0;
    }

    body > h3:first-child, body > h4:first-child, body > h5:first-child, body > h6:first-child {
    	margin-top: 0;
    	padding-top: 0;
    }

    a:first-child h1, a:first-child h2, a:first-child h3, a:first-child h4, a:first-child h5, a:first-child h6 {
    	margin-top: 0;
    	padding-top: 0;
    }

    h1 p, h2 p, h3 p, h4 p, h5 p, h6 p {
    	margin-top: 0;
    }

    li p.first {
    	display: inline-block;
    }

    li {
        margin-left: 15px;
    }

    ul, ol {
    	padding-left: 0;
    }

    ul :first-child, ol :first-child {
    	margin-top: 0;
    }

    ul :last-child, ol :last-child {
    	margin-bottom: 0;
    }

    dl {
    	padding: 0;
    }

    dl dt {
    	font-size: 14px;
    	font-weight: bold;
    	font-style: italic;
    	padding: 0;
    	margin: 15px 0 5px;
    }

    dl dt:first-child {
    	padding: 0;
    }

    dl dt > :first-child {
    	margin-top: 0;
    }

    dl dt > :last-child {
    	margin-bottom: 0;
    }

    dl dd {
    	margin: 0 0 15px;
    	padding: 0 15px;
    }

    dl dd > :first-child {
    	margin-top: 0;
    }

    dl dd > :last-child {
    	margin-bottom: 0;
    }

    blockquote > :first-child {
    	margin-top: 0;
    }

    blockquote > :last-child {
    	margin-bottom: 0;
    }

    table {
        border-radius: 3px;
    	padding: 0;
    }
    table tr {
    	margin: 0;
    	padding: 0;
    }

    table tr th {
    	font-weight: bold;
    	text-align: left;
    	margin: 0;
    	padding: 6px 13px;
    }

    table tr td {
    	text-align: left;
    	margin: 0;
    	padding: 6px 13px;
    }

    table tr th :first-child, table tr td :first-child {
    	margin-top: 0;
    }

    table tr th :last-child, table tr td :last-child {
    	margin-bottom: 0;
    }

    img {
    	max-width: 100%;
    }

    span.frame {
    	display: block;
    	overflow: hidden;
    }

    span.frame > span {
    	border: 1px solid #dddddd;
    	display: block;
    	float: left;
    	overflow: hidden;
    	margin: 13px 0 0;
    	padding: 7px;
    	width: auto;
    }

    span.frame span img {
    	display: block;
    	float: left;
    }

    span.frame span span {
    	clear: both;
    	display: block;
    	padding: 5px 0 0;
    }

    span.align-center {
    	display: block;
    	overflow: hidden;
    	clear: both;
    }

    span.align-center > span {
    	display: block;
    	overflow: hidden;
    	margin: 13px auto 0;
    	text-align: center;
    }

    span.align-center span img {
    	margin: 0 auto;
    	text-align: center;
    }

    span.align-right {
    	display: block;
    	overflow: hidden;
    	clear: both;
    }

    span.align-right > span {
    	display: block;
    	overflow: hidden;
    	margin: 13px 0 0;
    	text-align: right;
    }

    span.align-right span img {
    	margin: 0;
    	text-align: right;
    }

    span.float-left {
    	display: block;
    	margin-right: 13px;
    	overflow: hidden;
    	float: left;
    }

    span.float-left span {
    	margin: 13px 0 0;
    }

    span.float-right {
    	display: block;
    	margin-left: 13px;
    	overflow: hidden;
    	float: right;
    }

    span.float-right > span {
    	display: block;
    	overflow: hidden;
    	margin: 13px auto 0;
    	text-align: right;
    }

    code, tt {
    	margin: 0 2px;
    	padding: 0 5px;
    	white-space: nowrap;
    	border: 1px solid #eaeaea;
    	border-radius: 3px;
    }

    pre code {
    	margin: 0;
    	padding: 0;
    	white-space: pre;
    	border: none;
    	background: transparent;
    }

    .highlight pre {
    	border: 1px solid #cccccc;
    	line-height: 19px;
    	overflow: auto;
    	padding: 6px 10px;
    	border-radius: 3px;
    }

    pre {
    	line-height: 19px;
    	overflow: auto;
    	padding: 6px 10px;
    	border-radius: 3px;
    }

    pre code, pre tt {
    	background-color: transparent;
    	border: none;
    }

    .btn {
    	border: none;
    	outline: none;
    	padding: 8px 22px;
    	text-align: center;
    	text-decoration: none;
    	display: inline-block;
    	font-size: 14px;
    	font-weight: 600;
    	cursor: pointer;
    	-webkit-tap-highlight-color: transparent;
        -webkit-user-select: none;
    }

    .btn-main-group {
    	margin-left: 3px;
    }

    .btn-group {
    	font-size: 14px;
        float: left;
    	margin-bottom: 20px;
    }

    .btn-group:after, .btn-group:before {
        content:"";
        display:table;
        clear:both;
    }

    .btn:hover {
        opacity: 0.95;
    }

    .btn-1 {
    	font-size: 13px;
    	border-bottom-left-radius: 4px;
    	border-top-left-radius: 4px;
    }

    .btn-2 {
    	font-size: 13px;
    	border-bottom-right-radius: 4px;
    	border-top-right-radius: 4px;
    }

    .icon-after-1 {
    	margin-left: 28px;
    }

    .btn-first {-webkit-user-select: none;
    	margin-left: 22px;
    }

    .sidebtn {
    	outline: none;
    	border-style: hidden;
    	border-radius: 5px;
    }

    .sidebtn:active {
    	transform: Scale(0.95);
    }

    .add, .heart, .bin, .export, .nightm, .settings {
    	cursor: pointer;
    }

    .icon-btns {
    	border: none;
    	outline: none;
    	background: none;
    	text-align: center;
    	text-decoration: none;
    	display: inline-block;
    	font-weight: bold;
    	cursor: pointer;
    	-webkit-tap-highlight-color: transparent;
        -webkit-user-select: none;-webkit-user-select: none;
    	transition: opacity 0.5s ease;
    }

    .icon-btns:active {
        opacity: .75;
    }

    .toolset-btns {
    	display: flex;
    	margin-top: 4px;
    	padding: 10px;
    	bottom: 5px;
    	align-items: center;
    }

    .toolset-btns-holder {
    	visibility: hidden;
    	padding-left: 4px;
    	padding-right: 15px;
    }

    .toolset-btns-holder:active {
    	transform: Scale(0.9);
    }
</style>
