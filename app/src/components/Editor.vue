<template>
    <div id="editor"
    @keydown.ctrl.70.prevent="toggleSearch">
        <div id="screen" v-html="out" v-show="live"
        @click.prevent="closeTitleModal"></div>
        <div id="loader" v-show="loading"></div>
        <textarea
            id="textarea"
            :value="activeNoteText"
            type="text"
            @input="editNote"
            class="form-control"
            @click.self="closeTitleModal"
            @keydown="handleKeypress"
            @keydown.tab.prevent="insertTab"
            @keydown.ctrl.86="paste">
        </textarea>
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
                index: 0, // For moving through 'sortedEmojis'
                loading: false,
                caretPos: 0,
                completed: false
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
            // Dynamically reset "textarea's" bottom padding
            if (this.autoMojiOpen) {
                if (this.caretPos == this.activeNoteText.length-1) {
                    document.getElementById('textarea').scrollTop = document.getElementById('textarea').scrollHeight
                }
                // increase bottom padding
                // Scroll into view
                document.getElementById('textarea').style.paddingBottom = "70px"
            } else {
                // reduce bottom padding
                document.getElementById('textarea').style.paddingBottom = "35px"
            }

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
                return this.$children[0].$children[0].candidates
            },
            lastChunk() {
                return this.$children[0].$children[0].lastChunk
            },
            autoMojiOpen() {
                return this.$store.getters.autoMojiOpen
            }
        },
        watch: {
            out: (prev, curr) => {
                // animate 'md' loading
            },
            caretPos: function (prev, curr) {
                // Just so we force Vue to be aware of the mutation to 'caretPos'
            },
            autoMojiOpen: function (prev, curr) {
                if (curr == true) {
                    this.index = 0
                }
            }
        },
        methods: {
            updateCaretPos(direction) {
                if (direction == 37 || direction == 8) {
                    // left
                    this.caretPos = this.$el.children[2].selectionStart == 0 ? this.$el.children[2].selectionStart : this.$el.children[2].selectionStart - 1
                } else if (direction == 39) {
                    // right
                    this.caretPos = this.$el.children[2].selectionStart + 1 > this.activeNoteText.length ? this.$el.children[2].selectionStart : this.$el.children[2].selectionStart + 1
                } else {
                    this.caretPos = this.$el.children[2].selectionStart
                }
            },
            handleKeypress() {
                // Reset 'completed' on each new keypress to allow 'autoMoji' to popup
                this.completed = false

                // Hijack 'left' and 'right' arrow for 'autoMoji'
                if (this.autoMojiOpen) {
                    if (event.keyCode == 37 || event.keyCode == 39) {
                        event.preventDefault()
                        this.checkToMove()
                    }
                }

                if (!(event.keyCode == 39 && this.caretPos >= this.activeNoteText.length)) {
                    this.updateCaretPos(event.keyCode)
                }
            },
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
                if (event.keyCode == "37") {
                    // Left arrow
                    this.index = this.index > 0 ? this.index - 1 : this.index
                }

                if (event.keyCode == "39") {
                    // Right arrow
                    this.index = this.index < this.sortedEmojis.length -1 ? this.index + 1 : this.index
                }
            },
            getLastIndexOf(pattern) {
                let text = this.activeNoteText
                let result = [], indices = []
                let regex = new RegExp(pattern, "g")

                while ((result = regex.exec(text))) {
                    indices.push(result.index)
                }

                return indices
            },
            complete(index) {
                if (this.sortedEmojis.length > 0) {
                    // We freeze the 'curentPos' so we can reset it after mutation
                    let initCaretPos = this.caretPos

                    // We have to use a custom 'indexOf' to avoid returnong the wrong index of 'lastChunk'
                    let allLastChunkIndex = this.getLastIndexOf(this.lastChunk)
                    let lastChunkIndex = allLastChunkIndex[allLastChunkIndex.length-1]
                    let lastChunkLength = this.lastChunk.length

                    // Break up text to include 'autocompleted' text
                    let begChunk = this.activeNoteText.slice(0, lastChunkIndex) //this.activeNoteText.slice(0, this.activeNoteText.indexOf(this.lastChunk))
                    let endChunk = this.activeNoteText.slice(lastChunkIndex).slice(this.lastChunk.length)

                    // We clean any prepended whitespaces to clean up text and avoid overadding whitespaces
                    // Maybe we make this feature editable in future
                    let breakPos = 0
                    let brokenEndChunk = endChunk.split(" ")

                    // Just incase the user is backtracking after already inserting an emoji
                    // Avoiding adding emoji like so; '... :emoji:: ...'
                    if (brokenEndChunk[0].slice(0,1) == ":") {
                        brokenEndChunk[0] = brokenEndChunk[0].slice(1)
                    } else if (brokenEndChunk[0].slice(brokenEndChunk[0].length-1) == ":") {
                        brokenEndChunk[0] = ""
                    }

                    while (1) {
                        if (!(brokenEndChunk[breakPos] == "")) {
                            break
                        }
                        breakPos += 1
                    }

                    // Finally we rebuild 'endChunk'
                    endChunk = brokenEndChunk.slice(breakPos).join(" ")

                    // Remember to handle for user editing previous text.
                    // Include 'beg + matchedEmoji + end'
                    let completedEmojiName = this.sortedEmojis[index]

                    let result = begChunk.concat(":".concat(completedEmojiName)).concat(': ').concat(endChunk)

                    this.mutateNote(result)

                    // Reset 'caretPos'
                    // First Set the 'textarea' selectionStart and selectionEnd
                    // ... to the difference of the 'lastChunk' and the completed emoji name + the terminal characters added
                    this.$el.children[2].selectionStart = this.$el.children[2].selectionEnd = initCaretPos + (completedEmojiName.length - this.lastChunk.length) + 4

                    // Also set our 'caretPos' to make the whole thing consistent
                    this.caretPos = this.$el.children[2].selectionStart
                }
            },
            insertTab () {
                // We can Bypass tabs to autocomplete emojis name
                if (this.autoMojiOpen) {
                    this.complete(this.index) // Complete with most 'fully' matched

                    // set completed since we have 'completed' the emojiName
                    this.completed = true
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
                this.mutateNote(e.target.value)
            },
            mutateNote(text) {
                this.$store.dispatch("editNote", text)
            },
            closeTitleModal() {
                this.updateCaretPos(event.keyCode)

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
        padding: 40px 55px 35px 55px;
        font-family: Lato;
        height: calc(100% - 2.0rem);
        width: calc(100% - 0.010rem);
        max-width: calc(100% - 0.010rem);
        border: 0;
        border-radius: 0;
        outline: none;
        transition: padding 0.2s ease-in;
        /*font-size: 15px;*/
        font-weight: normal;
        -webkit-tap-highlight-color: transparent;
        resize: none;
    }

    #screen, #loader {
        overflow: auto;
        box-sizing: border-box;
        padding: 40px 165px 40px 165px;
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
