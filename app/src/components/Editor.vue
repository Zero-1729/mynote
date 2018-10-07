<template>
    <div id="editor"
    @keydown.ctrl.70.prevent="toggleSearch">
        <div id="screen" v-html="out" v-show="live"
        @click.prevent="closeTitleModal"></div>
        <div id="loader" v-show="loading"></div>
        <textarea
            id="textarea"
            :value="activeNoteText"
            spellcheck="true"
            type="text"
            @input="editNote"
            class="form-control"
             @click.self="closeTitleModal"
             @keydown.tab.prevent="insertTab"
             @keydown.ctrl.86="paste">
        </textarea>
        <table v-show="sortedEmojis.length != 0">
            <tr v-for="(emoji, i) in sortedEmojis"
                v-if="sortedEmojis.includes(emoji)"
                @click="complete(i)"
                :class="{active: i == index}">
                    <td>
                        {{ emoji.name }}
                    </td>
            </tr>
        </table>
        <bottom></bottom>
    </div>
</template>

<script>
    import Bottom  from './Bottom.vue'

    const hltjs = require("highlight.js")
    const {shell} = require("electron")

    const dmParse = text => window.dmoji.parse(text, window.emojisPath, [' ', ';', ',', '.'])

    export default {
        components: {
            Bottom
        },
        data() {
            return {
                rawWord: '',
                rawWordIndex: 0,
                index: 0, // For moving through 'sortedEmojis'
                rawEmojis: [],
                openAutoMojiPanel: false,
                loading: false
            }
        },
        mounted() {
            hltjs.initHighlighting()

            marked.setOptions({highlight: function(code) {
                                return hltjs.highlightAuto(code).value;
                            },
                            tables: true,
                            gfm: true,
                            breaks: false,
                            pedantic: false,
                            sanitize: false,
                            smartLists: false,
                            smartypants: true})

            // For when app was exited during mardown preview
            // Note: In Later we could add a minimal embeded brower in 'mynote'
            // allowing preview of content in-app
            if (this.live === true) {
                let anchors = document.getElementsByTagName('a')

                for (var i = 0;i < anchors.length;i++) {
                    anchors[i].addEventListener('click', function (event) {
                        event.preventDefault()
                        console.log(`[Info] Opening '${this.href}'...`)
                        shell.openExternal(this.href)
                    })
                }
            }
        },
        updated() {
            /// Dynamically set fontSize
            if (document.getElementById('screen') != null) {
                document.getElementById('screen').style.fontSize = String(this.currentFontSize).concat("px")
            } else {
                document.getElementById('textarea').style.fontSize = String(this.currentFontSize).concat("px")
            }

            if (this.live === true) {
                let anchors = document.getElementsByTagName('a')

                for (var i = 0;i < anchors.length;i++) {
                    anchors[i].addEventListener('click', function (event) {
                        event.preventDefault()
                        console.log(`[Info] Opening '${this.href}'...`)
                        shell.openExternal(this.href)
                    })
                }
            }

            // Decide whether to trigger 'AutoMoji'
            let currentIndex = this.$el.children[0].selectionStart-1
            let currentChar = this.activeNoteText[currentIndex]
            let lastChar = this.rawWord.length == 0 ? currentChar : this.rawWord[this.rawWord.length-1]
            let firstChar = this.rawWord.length == 0 ? '' : this.rawWord[0]

            // If We detect the ':' trigger we activate AutoMoji
            if (lastChar == ":" || firstChar == ":") {
                this.rawWordIndex = currentIndex

                // Open
                if (currentChar == ":" && firstChar == ":") {
                    this.rawWordIndex = 0
                    this.rawWord = ''
                } else {
                    this.rawWord += currentChar
                }
            }
        },
        computed: {
            currentFontSize() {
                return this.$store.getters.fontSize
            },
            live () {
                return this.$store.getters.live
            },
            activeNoteText () {
                return this.$store.state.activeNote.text
            },
            out () {
                if (this.live) {
                    this.loading = true
                    let t = dmParse(window.marked(this.sanitizeWithKatex()))
                    this.loading = false
                    return t
                } else {
                    return ''
                }
            },
            sortedEmojis() {
                return this.emojis.length > 0 ? this.swapElms(0, this.rawWordIndex) : this.emojis
            },
            emojis () {
                return this.rawEmojis.filter((emoji) => {
                    return emoji.name.includes(this.rawWord.slice(1).toLowerCase())
                })
            }
        },
        watch: {
            out: (prev, curr) => {
                // animate 'md' loading
            }
            /*sortedEmojis: (prev, curr) => {
                // Reset value of index each time 'sortedCandidtes' is empty
                if (prev.length == 0) {
                    this.index = 0
                }
            }*/
        },
        methods: {
            paste() {
                //this.$store.dispatch("editNote", window.remote.clipboard.readImage().toPng())
            },
            sanitizeWithKatex() {
                // Only apply KaTeX where we detect "$$*$$"
                return this.activeNoteText.replace(/\$\$[\n]*?[\s\S]*?[\n]*?\$\$/g, (m, o, s) => {return window.katex.renderToString(m.slice(2, m.length-2))})
            },
            toggleSearch() {
                this.$store.dispatch("toggleSpanel")
            },
            checkToMove() {
                if (this.sortedEmojis.length) {
                    if (event.keyCode == "38") {
                        // Up arrow
                        this.current = this.current > 0 ? this.current-1 : this.current
                    }

                    if (event.keyCode == "40") {
                        // Down arrow
                        this.current = this.current < this.sortedEmojis.length-1 ? this.current+1 : this.current
                    }
                }
            },
            complete(index) {
                if (this.sortedEmojis.length > 0) {
                    let begChunk = this.activeNoteText.slice(0, this.rawWordIndex)
                    let end = this.activeNoteText.slice(this.rawWordIndex+this.rawWord.length)

                    console.log("moving... ", begChunk.concat(this.sortedEmojis[i].name).concat(' ').concat(end))
                    // this.$store.dispatch('editNote', eval(`begChunk.concat(this.sortedEmojis[index].${this.targetField}).join(' ').concat(' ').concat(end)`))
                }
            },
            swapElms(newIndex, index) {
                let list = this.emojis
                // Only performs swap if th index 'old' exists

                if (index != -1) {
                    // Swaps the elment at 'old' with the element at 'index'
                    let oldElm = list[newIndex]
                    let newElm = list[index]

                    list[index] = oldElm
                    list[newIndex] = newElm

                    return list
                } else {return this.emojis}
            },
            insertTab () {
                // We can Bypass tabs to command it to autocomplete emojis name
                if (this.sortedEmojis.length > 0) {
                    this.complete(0) // Complete with most 'fully' matched
                } else {
                    const initSelectionStart = event.target.selectionStart
                    const tab = '\t'
                    const startTextChunk = event.target.value.slice(0, initSelectionStart)
                    const endTextChunk = event.target.value.slice(initSelectionStart)

                    const newText = startTextChunk.concat(tab).concat(endTextChunk)

                    this.$store.dispatch("editNote", newText) // Mutate actual notes text
                    event.target.value = this.activeNoteText // Ensures 'cursor' stays in the right place; after its value is mutated
                    event.target.selectionEnd = initSelectionStart + 1 // Now 'cursor' would be in the right place
                }
            },
            editNote (e) {
                this.$store.dispatch("editNote", e.target.value)
            },
            closeTitleModal() {
                document.getElementById('editor').style.opacity = "1"
                this.$store.dispatch("setModalVisibility", false)
            }
        }
    }
</script>

<style scoped>

    #editor {
        transition: opacity 0.3s ease-in;
        height: 100%;
        margin-left: 270px;
        overflow: hidden;
        user-select: none;
    }

    #editor textarea {
        display: relative;
        box-sizing: border-box;
        padding: 8px;
        font-family: Lato;
        height: calc(100% - 2.0rem);
        width: calc(100% - 0.010rem);
        max-width: calc(100% - 0.010rem);
        border: 0;
        border-radius: 0;
        outline: none;
        /*font-size: 15px;*/
        font-weight: normal;
        -webkit-tap-highlight-color: transparent;
        resize: none;
    }

    #screen, #loader {
        overflow: auto;
        box-sizing: border-box;
        padding: 8px;
        font-family: Lato;
        height: calc(100% - 2.0rem);
        max-height: calc(100% - 0.040rem);
        width: calc(100% - 0.010rem) !important;
        max-width: calc(100% - 0.010rem) !important;
        border: 0;
        border-radius: 0;
        outline: none;
        font-weight: normal;
    	-webkit-tap-highlight-color: transparent;
        resize: none;
        user-select: text;
    }

    #loader {
        background: blue;
    }

    table {
        height: 80px;
        border: 1px solid #c1c1c1;
        border-radius: 5px;
        padding: 4px;
        margin-left: 18px;
        overflow-y: auto;
        position: absolute;
        top: 15%;
        background: white;
    }

    tr {
        border-bottom: 1px solid #d9d9d9;
    }

    tr:last-child {
        border-bottom: none;
    }

    tr:hover {
        background: #d7d7d7;
        opacity: 0.8;
    }

    td {
        font-size: 13px;
        padding: 4px;
        cursor: pointer;
    }


    ::-webkit-scrollbar {
        width: 4px;
        height: 4px;
    }

    ::-webkit-scrollbar-track {
        border-radius: 10px;
    }

    ::-webkit-scrollbar-thumb {
        border-radius: 10px;
    }

    ::-webkit-scrollbar:active {
        width: 10px;
        height: 10px;
    }

    ::selection {
        background: dodgerblue;
        color: white;
    }
</style>
