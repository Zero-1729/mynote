<template>
    <div id="notes-list" @click.self="closeTitleModal">

    <div class="search-bar">
        <input class="search" type="search" placeholder="Search Notes" v-model="search">
    </div>

    <!-- our modal box for 'title' -->
    <div id="t-modal" v-show="newNote">
        <input ref="tmodal" type="text" class="search" @keydown.enter.prevent="addNote">
    </div>

    <div id="list-header">

        <div class="btn-group btn-main-group" role="group">
            <!-- All Notes button -->
            <div class="btn-group" role="group">
                <button type="button"
                    class="btn btn-1"
                    :class="{activeBtn: show == 'all'}"
                    @click="setCurrentPane('all')">
                    All Notes
                </button>
            </div>
            <!-- Favourite Button -->
            <div class="btn-group" role="group">
                <button type="button"
                    class="btn btn-2"
                    :class="{activeBtn: show == 'fav'}"
                    @click="setCurrentPane('fav')">
                    Favourite
                </button>
            </div>
        </div>
        <!-- render notes in a list -->
        <div class="notes-list-canvas">

            <div class="list-group">
                <div v-for="note in filteredNotes"
                    class="list-group-item"
                    @keydown.40="move(40)"
                    @keydown.38="move(38)"
                    @click="updateActiveNote(note)"
                    @mousedown.right.capture="cM(note)"
                    @contextmenu.prevent>
                    <h4 id="list-group-item-heading"
                    :class="{active: activeNote.hash === note.hash}">
                        {{ note.title }}
                    </h4>
                </div>
            </div>

        </div>
    </div>

    <div id="toolset">
        <button class="sidebtn" @click="slideToolsetBtns"></button>

        <div class="toolset-btns">
            <div class="toolset-btns-holder" style="paddingLeft: 8px">
                <svg class="add" @click.prevent="openTitleModal" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="isolation:isolate" viewBox="54 509 17 17" width="14.9" height="14.9"><path d=" M 54.21 525.464 L 54 522.398 L 67.099 509.299 C 67.498 508.9 68.144 508.9 68.543 509.299 L 70.701 511.457 C 71.1 511.856 71.1 512.502 70.701 512.901 L 57.602 526 L 54.536 525.79 C 54.367 525.779 54.221 525.633 54.21 525.464 Z "/></svg>
            </div>

            <div class="toolset-btns-holder">
                <svg class="heart" :class="{starred: activeNote.favourite}" @click="toggleFavourite" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="isolation:isolate" viewBox="94 509.471 18 16.84" width="15.8" height="14.8"><path d=" M 107.216 509.471 C 105.086 509.475 103.804 510.541 103.104 511.652 C 102.389 510.541 101.076 509.475 98.896 509.471 C 96.011 509.465 94 512.146 94 514.546 C 94 516.945 95.179 518.092 97.32 520.446 C 99.339 522.666 102.588 526.066 102.621 526.102 C 102.627 526.106 102.634 526.111 102.641 526.115 C 102.644 526.12 102.645 526.125 102.649 526.129 C 102.654 526.134 102.661 526.134 102.667 526.138 C 102.727 526.193 102.791 526.233 102.862 526.261 C 102.868 526.265 102.875 526.265 102.882 526.265 C 102.956 526.292 103.034 526.31 103.112 526.31 C 103.112 526.31 103.112 526.31 103.112 526.31 C 103.193 526.31 103.272 526.292 103.348 526.265 C 103.354 526.265 103.361 526.261 103.367 526.261 C 103.439 526.229 103.505 526.188 103.566 526.134 C 103.571 526.129 103.578 526.125 103.583 526.12 C 103.586 526.12 103.587 526.115 103.59 526.111 C 103.596 526.106 103.604 526.102 103.61 526.093 C 103.641 526.061 106.807 522.664 108.769 520.442 C 110.852 518.083 112 516.786 112 514.546 C 112 512.305 110.035 509.471 107.216 509.471 C 107.216 509.471 107.216 509.471 107.216 509.471 Z " fill-rule="evenodd"/></svg>
            </div>

            <div class="toolset-btns-holder">
                <svg class="bin" @click="deleteNote" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="isolation:isolate" viewBox="132.5 507.99 16 18.361" width="14.1" height="16.1"><path d=" M 147.792 510.588 L 143.952 510.588 Q 143.952 509.643 143.952 509.643 C 143.952 508.732 143.211 507.99 142.299 507.99 C 142.299 507.99 138.583 507.99 138.583 507.99 C 137.671 507.99 136.93 508.732 136.93 509.643 Q 136.93 509.643 136.93 510.588 Q 133.208 510.588 133.208 510.588 C 132.821 510.588 132.5 510.904 132.5 511.296 C 132.5 511.688 132.821 512.004 133.208 512.004 Q 133.208 512.004 134.035 512.004 Q 134.035 524.699 134.035 524.699 C 134.035 525.61 134.776 526.351 135.688 526.351 C 135.688 526.351 145.251 526.351 145.251 526.351 C 146.162 526.351 146.904 525.61 146.904 524.699 Q 146.904 524.699 146.904 512.004 Q 147.792 512.004 147.792 512.004 C 148.184 512.004 148.5 511.688 148.5 511.296 C 148.5 510.904 148.184 510.588 147.792 510.588 Q 147.792 510.588 147.792 510.588 Z " fill-rule="evenodd" /></svg>
            </div>

            <div class="toolset-btns-holder">
                <svg class="export" @click="openDir(activeNote)" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="isolation:isolate" viewBox="169 509.111 16 16.12" width="14.1" height="14.2"><g id="export"><path d=" M 184.217 517.617 C 183.784 517.617 183.434 517.968 183.434 518.4 C 183.434 518.661 183.434 521.61 183.432 523.011 C 183.431 523.168 183.431 523.645 182.844 523.665 C 182.844 523.665 171.032 523.665 171.032 523.665 C 170.846 523.665 170.708 523.629 170.652 523.567 C 170.596 523.504 170.558 523.268 170.567 523.188 C 170.572 523.151 170.575 523.114 170.575 523.077 C 170.575 523.077 170.575 511.265 170.575 511.265 C 170.575 511.105 170.597 510.893 170.703 510.787 C 170.81 510.682 171.002 510.679 171.032 510.677 C 171.032 510.677 175.6 510.677 175.6 510.677 C 176.033 510.677 176.383 510.327 176.383 509.894 C 176.383 509.462 176.033 509.111 175.6 509.111 C 175.6 509.111 171.073 509.112 171.073 509.112 C 170.987 509.108 170.221 509.085 169.63 509.646 C 169.346 509.915 169.009 510.414 169.009 511.265 C 169.009 511.265 169.009 523.036 169.009 523.036 C 168.987 523.275 168.968 524.015 169.467 524.59 C 169.721 524.883 170.197 525.231 171.032 525.231 C 171.032 525.231 182.844 525.231 182.844 525.231 C 182.844 525.231 182.845 525.231 182.845 525.231 C 183.71 525.231 184.995 524.64 184.998 523.013 C 185 521.612 185 518.661 185 518.4 C 185 517.968 184.649 517.617 184.217 517.617" fill-rule="evenodd" fill="grey"/><path d=" M 184.944 509.608 C 184.943 509.604 184.943 509.6 184.94 509.596 C 184.861 509.404 184.707 509.25 184.514 509.17 C 184.51 509.168 184.507 509.168 184.502 509.166 C 184.414 509.132 184.318 509.111 184.217 509.111 C 184.217 509.111 179.126 509.111 179.126 509.111 C 178.694 509.111 178.343 509.462 178.343 509.894 C 178.343 510.326 178.694 510.677 179.126 510.677 Q 179.126 510.677 182.326 510.677 Q 176.81 516.192 176.81 516.192 C 176.504 516.498 176.504 516.994 176.81 517.3 C 176.963 517.453 177.164 517.529 177.364 517.529 C 177.565 517.529 177.765 517.453 177.918 517.3 Q 177.918 517.3 183.434 511.784 Q 183.434 515.18 183.434 515.18 C 183.434 515.612 183.784 515.963 184.217 515.963 C 184.65 515.963 185 515.612 185 515.18 C 185 515.18 185 509.894 185 509.894 C 185 509.793 184.979 509.697 184.944 509.608" fill-rule="evenodd" /></g></svg>
            </div>

            <div class="toolset-btns-holder">
                <svg class="nightm" :class="{night: nm}" @click="toggleNM" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="isolation:isolate" viewBox="205 508.564 12 17.214" width="10.5" height="15.1"><path d=" M 217 509.014 C 216.086 508.723 215.108 508.564 214.09 508.564 C 209.073 508.564 205 512.421 205 517.171 C 205 521.921 209.073 525.778 214.09 525.778 C 215.108 525.778 216.086 525.619 217 525.327 C 213.408 524.177 210.82 520.958 210.82 517.171 C 210.82 513.384 213.408 510.165 217 509.014 Z " /></svg>
            </div>

            <div class="toolset-btns-holder">
                <svg class="settings" @click="settings = !settings" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="isolation:isolate" viewBox="147.136 530.153 16.706 16.702" width="16.706" height="16.702"><path d=" M 154.962 535.725 C 154.853 535.616 154.853 535.439 154.962 535.33 L 155.318 534.974 C 155.351 534.941 155.39 534.918 155.431 534.906 C 155.29 533.666 155.701 532.369 156.66 531.411 C 157.92 530.15 159.767 529.836 161.299 530.475 L 158.511 533.262 L 158.506 534.008 L 159.987 535.489 L 160.733 535.484 L 163.521 532.697 C 164.159 534.228 163.845 536.075 162.585 537.335 C 161.626 538.294 160.329 538.705 159.09 538.565 C 159.077 538.605 159.054 538.644 159.021 538.677 L 158.665 539.033 C 158.556 539.142 158.379 539.142 158.27 539.033 L 158.319 539.083 Q 156.741 539.383 155.472 540.745 Q 153.593 542.624 149.827 546.39 C 149.21 547.007 148.211 547.011 147.597 546.398 L 147.597 546.398 C 146.984 545.785 146.982 544.78 147.592 544.155 Q 150.433 541.248 153.25 538.523 Q 154.284 537.49 154.913 535.676 L 154.962 535.725 Z " fill-rule="evenodd" /></svg>
            </div>
        </div>
    </div>

    </div>
</template>

<script>
    const {remote, shell} = require('electron')

    export default {
        data () {
            return {
                search: "",
                settings: false,
                isHovered: false,
                index: null,
            }
        },
        mounted() {
            // Incase app is killed before new title is typed
            this.$store.dispatch("setModalVisibility", false)

            window.shell = shell
            window.remote = remote

            // Properly initialize 'index'
            this.filteredNotes.forEach((note) => {
                if (note.hash == this.activeNote.hash) {
                    this.index = this.filteredNotes.indexOf(note)
                }
            })

            //window.shell.openExternal('google.com')
        },
        updated() {
            this.index = this.filteredNotes.indexOf(this.activeNote)

            // We force the 'input' field to be autofocused
            if (this.newNote) {
                this.$refs.tmodal.focus()
            }
        },
        methods: {
            move(code) {
                code == 40 ? this.add(1) : code == 38 ? this.add(-1) : null

                this.updateActiveNote(this.filteredNotes[this.index])
            },
            add(n) {
                // Helper function for moving arrow index
                if (this.index != 0 && this.index != this.filteredNotes.length - 1) {
                    this.index += n
                } else {
                    if (this.index == 0) {
                        this.index = n > 0 ? this.index += n : this.index
                    } else {
                        this.index = n < 0 ? this.index += n : this.index
                    }
                }
            },
            toggleNM () {
                this.$store.dispatch("toggleNM")

                if (this.nm) {
                    let sheetPath = path.join('src', window.path.sep, 'styles', window.path.sep, 'theme', window.path.sep, 'night.css')
                    document.getElementsByTagName('link')[0].href = sheetPath;
                } else {
                    let sheetPath = window.path.join('src', window.path.sep, 'styles', window.path.sep, 'theme', window.path.sep, 'light.css')
                    document.getElementsByTagName('link')[0].href = sheetPath;
                }
            },
            slideToolsetBtns () {
                if (["", "0px"].includes(document.getElementById('toolset').style.width)) {
                    document.getElementById('toolset').style.width = "240px"


                    // add setDefaultTimout to '2secs' to delay animation of buttons
                    var animEv = () => {
                        for (var i = 0;i < 6;i++) {
                            document.getElementsByClassName('toolset-btns-holder')[i].style.visibility = 'visible'
                        }
                    }

                    window.setTimeout(animEv, 225)
                    window.clearTimeout(animEv)
                } else {
                    document.getElementById('toolset').style.width = "0px"

                    for (var i = 0;i < 6;i++) {
                        document.getElementsByClassName('toolset-btns-holder')[i].style.visibility = 'hidden'
                    }
                }
            },
            updateActiveNote (note) {
                this.$store.dispatch("updateActiveNote", note)
            },
            setCurrentPane(pane) {
                this.$store.dispatch("setCurrentPane", pane)
            },
            toggleFavourite () {
                this.$store.dispatch("toggleFavourite")
            },
            deleteNote () {
                this.$store.dispatch("deleteNote")
            },
            openTitleModal() {
                // Give it a kind of priority feel by fading background
                document.getElementById('editor').style.opacity = "0.9"
                this.$store.dispatch("setModalVisibility", true)
            },
            closeTitleModal() {
                let tM = document.getElementById('t-modal')
                tM.children[0].value = ''

                document.getElementById('editor').style.opacity = "1"
                this.$store.dispatch("setModalVisibility", false)
            },
            addNote() {
                // open the modal box
                this.openTitleModal()

                // Fetch info from box
                let count = this.$store.getters.uNCount
                let value = event.target.value
                let title = value == '' ? `New Note (${count})` : value

                // Create the new Note
                this.$store.dispatch("addNote", title)

                // Just close dialog box
                this.closeTitleModal()
            },
            cM(note) {
                const vm = this
                const contextMenu = remote.Menu.buildFromTemplate([
                    {label: 'Export Note', click() {
                        vm.openDir(note)
                    }}
                ])

                let win = remote.getCurrentWindow()
                contextMenu.popup(win)
            },
            openDir(note) {
                    console.log("opening dir")
                    let vm = this

                    remote.dialog.showOpenDialog({
                        title: "Add Tracks",
                        properties: ['saveFile', 'openDirectory', 'createDirectory', 'promptToCreate']
                    },
                    (filePaths) => {
                        if (filePaths != undefined) {
                            console.log("raw path: ", filePaths)
                            console.log("note: ", note)

                            // For now all exports should be in html
                            let path = window.path.join(filePaths[0], note.title).concat(".html")
                            let content = window.marked(note.text)

                            window.fs.writeFileSync(path, content)
                            console.log(`wrote: ${path}`)
                        }
                    })
                }
        },
        computed: {
            newNote() {
                return this.$store.state.showModal
            },
            notes () {
                return this.$store.state.notes
            },
            filteredNotes () {
                if (this.show === "all") {

                    var notes = this.notes;
                    var search = this.search.toLowerCase();

                    if (!search) {
                        return notes;
                    } else {
                        return notes.filter(function(item) {
                            return item.text.toLowerCase().indexOf(search) !== -1
                        });
                    }
                }

                else if (this.show === "fav") {

                    var notes = this.notes.filter(note => note.favourite);
                    var search = this.search.toLowerCase();

                    if (!search) {
                        return notes;
                    } else {
                        return notes.filter(function(item) {
                            return item.text.toLowerCase().indexOf(search) !== -1
                        });
                    }
                }
            },
            activeNote () {
                return this.$store.getters.activeNote
            },
            show () {
                return this.$store.getters.onPane
            },
            nm () {
                return this.$store.getters.nm
            }
        }
    }
</script>

<style scoped>
    #t-modal * {
        box-sizing: border-box;
    }

    #t-modal {
        position: fixed;
        width: 240px;
        height: 20px;
        padding-left: 30px;
        padding-top: 15px;
        padding-right: 30px;
        padding-bottom: 30px;
        border-radius: 10px;
        top: 35%;
        left: 40%;
        z-index: 3;
        font-size: 14px;
        transition: all 0.2s linear;
    }

    #notes-list {
        float: left;
        width: 270px;
        font-family: Lato;
        font-weight: normal;
        height: calc(100% - 0.0rem);
        position: relative;
    }

    .notes-list-canvas {
        margin-left: -4px;
        width: 225px;
        overflow: auto;
    }

    .notes-list-canvas::-webkit-scrollbar {
        width: 1px;
    }

    #list-header {
        padding: 5px 25px 25px 25px;
        font-family: Lato;
    }

    .list-group {
        height: 300px;
    }

    #list-group-item {
        border: 0;
        border-radius: 0;
        margin: 0;
        padding: 0;
        text-decoration: none;
        text-decoration-color: none;
        cursor: default;
    }

    #list-group-item-heading {
        transition: background 0.3s ease-in;
        padding: 4px;
        cursor: pointer;
        font-weight: normal;
        font-size: 13px;
        user-select: none;
        margin-top: 0px;
        margin-bottom: 10px;
    }

    #toolset {
        bottom: 50px;
        position: absolute;
        transition: width 0.2s linear;
        border-top-left-radius: 19px;
        border-top-right-radius: 25px;
        border-bottom-left-radius: 19px;
        border-bottom-right-radius: 25px;
        margin-top: 2px;
        margin-left: 15px;
        display: flex;
        height: 35px;
        width: 0px;
    }

    .search-bar {
        padding: 5px 25px 25px 25px;
        margin-top: 18px;
    }

    .search {
        font-size: 14px;
        width: 110px;
        border-top: 0;
        border-left: 0;
        border-right: 0;
        border-bottom: thin lightgrey;
        -webkit-tap-highlight-color: transparent;
        user-select: none;
        outline: none;
        font-family: Lato !important;
    }

    .search:active, .search:focus {
        width: 100%;
        border-bottom: 1px solid dodgerblue;
        transition: width .8s ease, background-color .5s ease, border-bottom .4s ease;
    }

    .active {
        width: 90%;
        padding: 4px;
        border-radius: 2px;
    }

    ::-webkit-search-cancel-button {
        -webkit-appearance: none;
    }

    @keyframes slideIn {
        0% {
            transform: translateX(-5px);
            opacity: 0.4;
        }

        25% {
            transform: translateX(0.5px);
            opacity: 0.6;
        }

        50% {
            transform: translateX(2.5px);
            opacity: 0.8;
        }

        100% {
            opacity: 1;
        }
    }

    @keyframes slideOut {
        0% {
            opacity: 1;
        }

        25% {
            transform: translateX(2.5px);
            opacity: 0.8;
        }

        50% {
            transform: translateX(0.5px);
            opacity: 0.6;
        }

        100% {
            transform: translateX(-5px);
            opacity: 0.4;
        }
    }

</style>
