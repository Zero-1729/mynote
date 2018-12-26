<template>
    <div id="editor">

        <div id="screen" v-html="out" v-show="live"
        @click.prevent="closeAllModal"></div>

        <textarea
            id="textarea"
            class="form-control"
            :value="activeNoteText"
            type="text"
            v-hotkey=keymap
            @input="editNote"
            @click.self="closeAllModal"
            @keydown.escape="short_closeSPanel"
            @keydown="handleKeypress"
            @keydown.tab.prevent="insertTab"
            @keydown.delete="backSpacing = true"
            @mousedown.right.capture="createContextMenu"
            @contextmenu.prevent
            @scroll=scrollFakeTA>
        </textarea>

        <div id="fake-ta"></div>

        <!-- our modal box for 'title' -->
        <div id="t-modal" :class="{'slide-in-further': newNote, 'hideModal': !newNote}">
            <input ref="tmodal" type="text" class="search" @keydown.enter.prevent="addNote">
        </div>

        <!-- our modal box for exporting files -->
        <div id="t-modal1" :class="{'slide-in-further': exportNewFile, 'hideModal': !exportNewFile}">
            <p>Export Note as</p>
            <div class="buttonArray">
                <button @click="exportFile('md')">Markdown</button>
                <button @click="exportFile('html')">HTML</button>
                <button @click="exportFile('pdf')">PDF</button>
            </div>
        </div>

        <!-- Info modals are placed here so they can appear on the editor -->
        <div class="warning" :class="{'slide-in': deleteModalVisible, 'hideModal': !deleteModalVisible}">
            <h3>Are you srue you want to delete this Note?</h3>
            <div>
                <button @click="replyDeleteNote(false)">No</button>
                <button @click="replyDeleteNote(true)" style="background: darkred;color: white">Yes</button>
            </div>
        </div>

        <!-- Successfully exported -->
        <div class="success" :class="{'slide-in': exportedSingle, 'hideModal': !exportedSingle}">
            <h3>Exported {{ `'${exportedSingleName}'` }} Successfully!</h3>
        </div>

        <bottom></bottom>
    </div>
</template>

<script>
    import Bottom  from './Bottom.vue'

    const hltjs         = require("highlight.js")
    const marked        = require('marked')
    const spellchecker  = require('simple-spellchecker')

    const {ipcRenderer, shell, remote} = require("electron")

    const {keycodes}    = require('./../util/keycode')
    const mark          = require('./../util/mark')
    const dmoji         = require('./../util/downmoji')
    const { buildMap }  = require('./../util/object')
    const katex         = require('katex')

    const path          = require('path')
    const fs            = require('fs')
    const os            = require('os')

    const HTMLTemplate = `<html>
<head>
<title>$[0]</title>
<meta charset='utf-8' />
<meta name='viewport' content='width=device-width'>

<style>\n$[1]</style>
<style>\n$[2]</style>
</head>
<body>$[3]</body>
</html>`

    export default {
        name: 'Editor',
        components: {
            Bottom
        },
        data() {
            return {
                platform: os.platform(),
                selectionRange: [null, null], // to cache textarea's selectionRange
                dmojiParser: null,
                htmlTemplate: HTMLTemplate,
                dictionary: null,
                taInstance: null,
                scInstance: null,
                index: 0, // For moving through 'sortedEmojis'
                caretPos: 0,
                completed: false,
                backSpacing: false,
                deletedDelim: false,
                alignCaretPos: false,
                alignCaretPosOffset: 0,
                headings: {
                    1: '#',
                    2: '##',
                    3: '###',
                    4: '####',
                    5: '#####',
                    6: '######'
                },
                delims: {
                    'opening': ['`', '"', "'", '^', '*', '{', '[', '('],
                    'closing': ['`', '"', "'", '^', '*', '}', ']', ')']
                }
            }
        },
        mounted() {
            // Create Instance
            this.resizeFakeTA()
            this.taInstance = new mark(document.getElementById('fake-ta'))
            this.scInstance = new mark(document.getElementById('screen'))

            // Load up the dictionary to be used for 'spellcheck'
            let vm = this
            spellchecker.getDictionary(this.settings.lang, "./app/src/util/dict", function(err, data) {
                if (!err) {
                    vm.dictionary = data
                    vm.syncText()
                } else { throw err }
            })

            // Watch for window resizing to ensure size consistency for our fake TA
            window.addEventListener('resize', () => {
                vm.resizeFakeTA()
            })

            // Continue styling if 'Search' still opened
            if (this.showSPanel) {
                // increase bottom padding to compensate
                // ... for search component's positioning
                this.incTANSBottomPad(125)
            } else {
                // reduce bottom padding
                this.decTANSBottomPad(20)
            }

            // Set 'SettingsOpen' on updates
            this.$store.dispatch("loadFontSize", this.$route.name)
            this.$store.dispatch("loadFontFamily", this.$route.name)

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
            // Note: In Later versions we could add a minimal embeded brower in 'mynote'
            // allowing preview of webpages in-app
            // if markdown swaped
            if (this.live) {
                this.handleExternalLinks()
                this.setListStyle()
                // Fix Styling for checkboxes (task list)
                this.clearListStyle(this.getCheckboxList(document.getElementById('screen')))
            }

            // Set 'Textarea' Tab Size
            this.updateTATabSize()

            // Scroll to active note
            this.scrollToActiveNoteDOM()

            // To wait for 'pdf' export response status from Main Process
            ipcRenderer.on('export-pdf-response', (event, obj) => {
                this.exportedSingle = obj.status
            })

            // Watch for Editor related shortcuts
            // Text Insertion
            ipcRenderer.on('short_insert_hr', (event, obj) => {
                this.short_insert_hr()
            })
            ipcRenderer.on('short_insert_image', (event, obj) => {
                this.short_insert_image()
            })
            ipcRenderer.on('short_insert_link', (event, obj) => {
                this.short_insert_link()
            })
            ipcRenderer.on('short_insert_symbol', (event, kind) => {
                this.short_insert_symbol(kind)
            })

            // Heading Insertion
            ipcRenderer.on('short_insert_heading', (event, size) => {
                this.short_insert_heading(size)
            })

            // Paragraph Insertion
            ipcRenderer.on('short_insert_md_block', (event, kind) => {
                this.short_insert_md_block(kind)
            })
            ipcRenderer.on('short_insert_list', (event, kind) => {
                this.short_insert_list(kind)
            })
        },
        updated() {
            // Re-set 'caretPos' if delimiters where completed
            if (this.alignCaretPos) {
                document.getElementById('textarea').selectionEnd = this.caretPos + this.alignCaretPosOffset
                this.alignCaretPos = false
                this.alignCaretPosOffset = 0
            }

            // if markdown swaped
            if (this.live) {
                // Sync text
                this.syncText()

                this.handleExternalLinks()
                this.setListStyle()

                // Fix Styling for checkboxes (task list)
                this.clearListStyle(this.getCheckboxList(document.getElementById('screen')))
            }
        },
        computed: {
            keymap() {
                return buildMap([
                    this.resolveTrigger().concat('1'), // heading 1
                    this.resolveTrigger().concat('2'), // heading 2
                    this.resolveTrigger().concat('3'), // heading 3
                    this.resolveTrigger().concat('4'), // heading 4
                    this.resolveTrigger().concat('5'), // heading 5
                    this.resolveTrigger().concat('6'), // heading 6
                    this.resolveTrigger().concat('l'), // link shortcut
                    'alt+'.concat(this.resolveTrigger().concat('i')), // image shortcut
                    this.resolveTrigger().concat('b'), // bold
                    this.resolveTrigger().concat('i'), // italics
                    'alt+'.concat(this.resolveTrigger().concat('e')), // emphasis
                    this.resolveTrigger().concat('d'), // strike-through
                    'ctrl+`', // inline-code
                    'shift+alt+l', // insert <hr />
                    'shift+alt+m', // math block
                    'shift+alt+c', // code block
                    'shift+alt+q', // quote block
                    'shift+alt+o', // ordered-list
                    'shift+alt+b', // bullet list
                    'shift+alt+x' // task list
                ],
                [
                    this.short_insert_heading,
                    this.short_insert_heading,
                    this.short_insert_heading,
                    this.short_insert_heading,
                    this.short_insert_heading,
                    this.short_insert_heading,
                    this.short_insert_link,
                    this.short_insert_image,
                    this.short_insert_symbol,
                    this.short_insert_symbol,
                    this.short_insert_symbol,
                    this.short_insert_symbol,
                    this.short_insert_symbol,
                    this.short_insert_hr,
                    this.short_insert_md_block,
                    this.short_insert_md_block,
                    this.short_insert_md_block,
                    this.short_insert_list,
                    this.short_insert_list,
                    this.short_insert_list
                ])
            },
            exportNewFile() {
                return this.$store.getters.exportFile
            },
            newNote() {
                return this.$store.getters.newNote
            },
            live () {
                return this.$store.getters.live
            },
            activeNote() {
                return this.$store.getters.activeNote
            },
            activeNoteText() {
                return this.$store.getters.activeNote.text
            },
            out () {
                if (this.live) {
                    if (this.emojisType == 'EmojiOne') {
                        return dmoji.parse(marked(this.sanitizeWithKatex()), this.emojisPath, [' ', ';', ',', '.'], 'emojione')
                    } else {
                        return dmoji.parse(marked(this.sanitizeWithKatex()), this.emojisPath, [' ', ';', ',', '.'])
                    }
                    //return dmParse(marked(this.sanitizeWithKatex()))
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
            },
            bulletListMarker() {
                return this.$store.getters.settings.bulletListMarker
            },
            tabSize() {
                return this.$store.getters.settings.tabSize
            },
            shouldCompleteDelimiters() {
                return this.$store.getters.settings.autoDelimiterCompleter
            },
            deleteModalVisible() {
                return this.$parent.$children[0].showDeleteModal
            },
            exportedSingle: {
                get() {
                    return this.$store.getters.exportedSingle
                },
                set(value) {
                    this.$store.dispatch('setExportedSingle', value)
                }
            },
            exportedSingleName: {
                get() {
                    return this.$store.getters.exportedSingleName
                },
                set(value) {
                    this.$store.dispatch('setExportedSingleName', value)
                }
            },
            emojisPath() {
                return this.$store.getters.emojisPath
            },
            emojisType() {
                return this.$store.getters.settings.emojisType
            },
            showSPanel() {
                return this.$store.getters.showSPanel
            },
            showModal() {
                return this.$store.getters.showModal
            },
            showExportModal() {
                return this.$store.getters.showExportModal
            },
            settings() {
                return this.$store.getters.settings
            }
        },
        watch: {
            activeNote: function (prev, curr) {
                // So we sync the text of the new (current) note
                this.syncText()
            },
            newNote: function (prev, curr) {
                // We force the 'input' field to be autofocused
                if (this.newNote) {
                    this.$refs.tmodal.focus()
                }
            },
            caretPos: function (prev, curr) {
                // Just so we force Vue to be aware of the mutation to 'caretPos'
            },
            index: function (prev, curr) {
                document.getElementsByClassName('activeEmoji')[0].scrollIntoViewIfNeeded()
            },
            autoMojiOpen: function (prev, curr) {
                if (curr) {
                    this.index = 0

                    // increase bottom padding to compensate
                    // ... for autmojis positioning
                    this.incTANSBottomPad(70)
                } else {
                    // reduce bottom padding
                    this.decTANSBottomPad(35)
                }
            },
            fontSize: function (prev, curr) {
                /// Update fontSize when user changes it
                this.updateFontSize()
            },
            live: function (prev, curr) {
                // Sync text inorder to clean cache
                this.syncText(prev)
            },
            showSPanel: function (prev, curr) {
                if (prev) {
                    // increase bottom padding to compensate
                    // ... for search component's positioning
                    this.incTANSBottomPad(125)
                } else {
                    // reduce bottom padding
                    this.decTANSBottomPad(20)
                }
            }
        },
        methods: {
            resolveTrigger() {
                return this.$parent.resolveTrigger()
            },
            // Editor shorts
            short_closeSPanel() {
                this.$store.dispatch("toggleSpanel", true)
            },
            short_insert_heading(size) {
                size = typeof size == 'object' ? Number(event.key) : size

                // In later releases we could ensure its aware of any previously inputed headings
                let beg = this.activeNoteText.slice(0, this.caretPos)
                let end = this.activeNoteText.slice(this.caretPos)

                this.mutateNote(beg.concat(this.headings[size]).concat(end != '' ? end : ' '))
            },
            short_insert_image() {
                let beg = this.activeNoteText.slice(0, this.caretPos)
                let end = this.activeNoteText.slice(this.caretPos)

                let obj = '![]()'
                this.alignCaretPos = true
                this.alignCaretPosOffset = 2

                let newText = beg.concat(obj).concat(end)

                this.mutateNote(newText, true)
            },
            short_insert_link() {
                let beg = this.activeNoteText.slice(0, this.caretPos)
                let end = this.activeNoteText.slice(this.caretPos)

                let newText = beg.concat('[]()').concat(end)
                this.alignCaretPos = true
                this.alignCaretPosOffset = 1

                this.mutateNote(newText, true)
            },
            short_insert_symbol(kind) {
                let options = {
                    'b': '****',
                    'bold': '****',
                    'i': '**',
                    'italics': '**',
                    'd': '~~~~',
                    'strike-through': '~~~~',
                    '`': '``',
                    'inline-code': '``'
                }

                let obj = typeof kind == 'object' ? options[event.key] : options[kind]

                let beg = this.activeNoteText.slice(0, this.caretPos)
                let end = this.activeNoteText.slice(this.caretPos)

                this.alignCaretPos = true
                this.alignCaretPosOffset = obj.length > 2 ? 2 : 1

                let newText = beg.concat(obj).concat(end)

                this.mutateNote(newText, true)
            },
            short_insert_hr() {
                let obj = '\n---\n'

                let beg = this.activeNoteText.slice(0, this.caretPos)
                let end = this.activeNoteText.slice(this.caretPos)

                let newText = beg.concat(obj).concat(end)

                this.mutateNote(newText)
            },
            short_insert_md_block(kind) {
                // It seems calls from render to mutated has some issues
                // ... so we define a few options like 'begEnd' and 'endMutated' to fix it
                let options = {
                    'M': {begEnd: '', obj: '$$\n\n$$', offset: 3, forced: true, endMutated: false},
                    'math': {begEnd: '\n', obj: '$$\n\n$$', offset: 4, forced: true, endMutated: true},
                    'Q': {begEnd: '', obj : '> ', offset: 2, forced: true, endMutated: false},
                    'quote': {begEnd: '\n', obj: '> ', offset: 3, forced: true, endMutated: true},
                    'C': {begEnd: '', obj: '```\n\n```', offset: 4, forced: true, endMutated: false},
                    'code': {begEnd: '\n', obj: '```\n\n```', offset: 5, forced: true, endMutated: true}
                }

                let replacement = typeof kind == 'object' ? options[event.key] : options[kind]

                let beg = this.activeNoteText.slice(0, this.caretPos).concat(replacement.begEnd)
                let end = replacement.endMutated ? this.activeNoteText.slice(this.caretPos).slice(1) : this.activeNoteText.slice(this.caretPos)

                let newText = beg.concat(replacement.obj).concat(end)

                this.alignCaretPos = true
                this.alignCaretPosOffset = replacement.offset

                this.mutateNote(newText, replacement.forced)
            },
            short_insert_list(kind) {
                // It seems calls from render to mutated has some issues
                // ... so we define a few options like 'begEnd' and 'endMutated' to fix it
                let options = {
                    'O': {begEnd: '', obj: '1. ', offset: 3, forced: true, endMutated: false},
                    'ordered': {begEnd: '\n', obj: '1. ', offset: 4, forced: true, endMutated: true},
                    'B': {begEnd: '', obj: '- ', offset: 2, forced: true, endMutated: false},
                    'bullet': {begEnd: '\n', obj: '- ', offset: 3, forced:true, endMutated: true},
                    'X': {begEnd: '', obj: '- [ ] ', offset: 6, forced: true, endMutated: false},
                    'task': {begEnd: '\n', obj: '- [ ] ', offset: 7, forced: true, endMutated: true}
                }

                let replacement = typeof kind == 'object' ? options[event.key] : options[kind]


                let beg = this.activeNoteText.slice(0, this.caretPos).concat(replacement.begEnd)
                let end = replacement.endMutated ? this.activeNoteText.slice(this.caretPos).slice(1) : this.activeNoteText.slice(this.caretPos)

                let newText = beg.concat(replacement.obj).concat(end)

                this.scrubNewLine = true
                this.alignCaretPos = true
                this.alignCaretPosOffset = replacement.offset

                this.mutateNote(newText, replacement.forced)

            },
            // EOD
            syncText(forced=false) {
                document.getElementById('fake-ta').innerText = this.activeNoteText
                this.exposeMispelled(forced)
            },
            isWord(text) {
                if (text == '') {
                    return false
                }
                return new RegExp('\\b[a-z]+[\-[a-z]+]?\\b', 'gi').test(text)
            },
            currentSelectionWord() {
                return this.activeNoteText.slice(document.getElementById('textarea').selectionStart, document.getElementById('textarea').selectionEnd)
            },
            createSuggestionsList(word) {
                let suggestions = []
                let nomatch = {
                    label: 'No suggestions found',
                    enabled: false
                }
                let vm = this

                let ta = document.getElementById('textarea')
                let start = ta.selectionStart
                let end = ta.selectionEnd

                this.dictionary.getSuggestions(word).forEach((word) => {
                    suggestions.push({
                        label: word,
                        click() {
                            vm.replaceSelectionText(word, start, end)
                        }
                    })
                })

                return suggestions.length > 0 ? suggestions : [nomatch]
            },
            replaceSelectionText(word, start, end) {
                let ta = document.getElementById('textarea')
                let text = this.activeNoteText.slice(0, start).concat(word).concat(this.activeNoteText.slice(end))

                this.alignCaretPos = true
                this.alignCaretPosOffset = word.length

                this.mutateNote(text, true)
            },
            exposeMispelled(forced) {
                this.taInstance.unmark()
                this.scInstance.unmark()

                if (forced || this.live) {
                    this.scInstance.markRegExp(/\b\S+\b/gi,
                        {
                            'element': 'span',
                            'acrossElements': true,
                            'filter': (t,m,c) => {
                                if (!this.dictionary.spellCheck(m) && this.isWord(m) && !this.isURL(m)) return true
                            },
                            'className': 'mispelled'
                        }
                    )
                } else {
                    this.taInstance.markRegExp(/\b\S+\b/gi,
                        {
                            'element': 'span',
                            'filter': (t,m,c) => {
                                if (!this.dictionary.spellCheck(m) && this.isWord(m) && !this.isURL(m)) return true
                            },
                            'className': 'mispelled'
                        }
                    )
                }

            },
            isURL(string) {
                return new RegExp('(www|http:|https:|file:|ftp:)+[^\\s]+[\\w]', 'g').test(string)
            },
            resizeFakeTA() {
                document.getElementById('fake-ta').style.width = String(document.getElementById('textarea').offsetWidth - 4).concat('px')
            },
            scrollFakeTA() {
                document.getElementById('fake-ta').scrollTop = document.getElementById('textarea').scrollTop
            },
            updateActiveNoteDOM() {
                // Load activeNoteDOM
                this.$store.dispatch("updateActiveNoteDOM", document.getElementsByClassName("active")[0])
            },
            addNote() {
                // Fetch info from box
                let count = this.$store.getters.uNCount
                let value = event.target.value
                let title = value == '' ? `New Note (${count})` : value

                // Create the new Note
                this.$store.dispatch("addNote", title)

                // Just close dialog box
                this.closeAllModal()

                // Update activeNoteDOM
                this.updateActiveNoteDOM()
                this.scrollIsOffset = true
            },
            createContextMenu() {
                let vm = this

                const contextMenu = remote.Menu.buildFromTemplate([
                    {
                        label: 'Replace with...',
                        enabled: vm.isWord(vm.currentSelectionWord()) ? true : false,
                        submenu: this.createSuggestionsList(vm.currentSelectionWord())
                    },
                    {type: 'separator'},
                    {
                        label: 'Undo',
                        role: 'undo',
                        accelerator: 'CmdOrCtrl+Z'
                    },
                    {
                        label: 'Redo',
                        role: 'redo',
                        accelerator: 'Shift+CmdOrCtrl+Z'
                    },
                    {type: 'separator'},
                    {
                        label: 'Cut',
                        role: 'cut',
                        accelerator: 'CmdOrCtrl+X'
                    },
                    {
                        label: 'Copy',
                        role: 'copy',
                        accelerator: 'CmdOrCtrl+C'
                    },
                    {
                        label: 'Paste',
                        role: 'paste',
                        accelerator: 'CmdOrCtrl+V'
                    },
                    {
                        label: 'Delete',
                        role: 'delete',
                        accelerator: 'Del'
                    },
                    {
                        label: 'Select All',
                        role: 'selectall',
                        accelerator: 'CmdOrCtrl+A'
                    }
                ])

                let win = remote.getCurrentWindow()
                contextMenu.popup(win)
            },
            getHTML(title, data) {
                // We programmatically include the (CSS) styling
                // ... to make the 'html' file look like our 'md' preview
                let sheetPath = path.join(path.resolve('.'), path.sep, 'app', path.sep, 'src', path.sep, 'public', path.sep, 'export.css')
                let katexSheetPath =  path.join(path.resolve('.'), path.sep, 'app', path.sep, 'src', path.sep, 'styles',path.sep, 'katex', path.sep, 'katex.css')

                let style = fs.readFileSync(sheetPath)
                let katex = fs.readFileSync(katexSheetPath).toString().replace(/fonts/g, path.join(path.resolve(), path.sep, 'app', path.sep, 'src', path.sep, 'styles', path.sep, 'katex', path.sep, 'fonts'))

                let html = this.emojisType == 'emojione' ? dmoji.parse(marked(this.sanitizeWithKatex()), this.emojisPath, [' ', ';', ',', '.'], 'emojione') : dmoji.parse(marked(this.sanitizeWithKatex()), this.emojisPath, [' ', ';', ',', '.'])

                return this.htmlTemplate.replace(/\$\[0\]/, title).replace(/\$\[1\]/, style).replace(/\$\[2\]/, katex).replace(/\$\[3\]/, html)
            },
            exportFile(format, note=null) {
                let vm = this

                if (format == "pdf") {
                    this.exportPDF(note)
                } else {
                    remote.dialog.showOpenDialog({
                        title: "Export Note",
                        properties: ['saveFile', 'openDirectory', 'createDirectory', 'promptToCreate']
                    },
                    (filePaths) => {
                        if (filePaths != undefined) {
                            if (format == "md") {
                                this.exportMD(filePaths[0], note)
                            } else if (format == "html") {
                                this.exportHTML(filePaths[0], note)
                            }
                        }
                    })
                }

                // Close modal after exporting
                this.closeAllModal()
            },
            exportMD(filePath, note=null) {
                let title =  note != null ? note.title : this.activeNote.title

                // Quickest to export since its technically an 'md' notes App
                let fpath = path.join(filePath, title).concat(".md")

                fs.writeFileSync(fpath, note != null ? note.text.toString() : this.activeNote.text.toString())

                this.exportedSingle = true
                this.exportedSingleName = fpath
            },
            exportHTML(filePath, note=null) {
                let title = note != null ? note.title.toString() : this.activeNote.title.toString()
                let content = this.getHTML(title, note != null ? note.text.toString() : this.activeNote.text.toString())

                let fpath = path.join(filePath, note != null ? note.title : this.activeNote.title).concat(".html")

                fs.writeFileSync(fpath, content)
                this.exportedSingle = true
                this.exportedSingleName = fpath
            },
            exportPDF(note=null) {
                let title = note != null ? note.title.toString() : this.activeNote.title.toString()
                let data = note != null ? note.title.toString() : this.activeNote.text.toString()
                let content = this.getHTML(title, data)

                let filePath = remote.dialog.showSaveDialog(remote.getCurrentWindow(), {})

                if (filePath) {
                    filePath = !filePath.endsWith('.pdf') ? filePath.concat('.pdf') : filePath
                    this.exportedSingleName= filePath
                    ipcRenderer.send("signal-export", {html: content, filepath: filePath})
                } else {throw "failed to export"}
            },
            getCheckboxList(parent) {
                let arr = []
                let all = parent.querySelectorAll('input')

                for (var i = 0;i < all.length;i++) {
                    arr.push(all[i])
                }

                return arr.filter((node) => {return node.type == 'checkbox'})
            },
            clearListStyle(checkboxes) {
                checkboxes.forEach((checkbox) => {
                    checkbox.style.background = 'transparent'
                    checkbox.style.height = '18px'
                    checkbox.style.width = '18px'
                    checkbox.style.marginRight = '8px'
                    checkbox.parentElement.style.position = 'relative' // li
                    checkbox.parentElement.style.display = 'flex' // li
                    checkbox.parentElement.style.listStyle = 'none' // li
                    checkbox.parentElement.style.marginLeft = '-10px' // li

                    // To allow us style the checkbox better
                    let span = document.createElement('span')
                    span.classList.add('checkbox-span')
                    span.style.position = 'absolute'
                    span.style.height = '17px'
                    span.style.width = '17px'
                    span.style.left = '3.5px'
                    span.style.top = '0px'
                    span.style.borderRadius = '2.5px'
                    span.style.zIndex = '-9'

                    checkbox.parentElement.appendChild(span)

                    checkbox.parentElement.parentElement.style.paddingLeft = '10px' // ul
                })
            },
            updateTATabSize() {
                document.getElementById('textarea').style.tabSize = this.tabSize
            },
            scrollToActiveNoteDOM() {
                this.$parent.activeNoteDOM.scrollIntoViewIfNeeded()
            },
            replyDeleteNote(flag) {
                if (flag) {
                    this.$parent.$children[0].deleteNote()
                }

                this.$parent.$children[0].shouldDeleteNote = false
                this.$parent.$children[0].showDeleteModal = false
            },
            updateFontSize() {
                this.$store.dispatch("loadFontSize", this.$route.name)
            },
            updateCaretPos(direction) {
                if (direction == keycodes.left_arrow || direction == 8) {
                    // left
                    this.caretPos = this.$el.children[1].selectionStart == 0 ? this.$el.children[1].selectionStart : this.$el.children[1].selectionStart - 1
                } else if (direction == keycodes.right_arrow) {
                    // right
                    this.caretPos = this.$el.children[1].selectionStart + 1 > this.activeNoteText.length ? this.$el.children[1].selectionStart : this.$el.children[1].selectionStart + 1
                } else {
                    this.caretPos = this.$el.children[1].selectionStart
                }
            },
            deleteDelim() {
                if (this.settings.autoDelimiterCompleter) {
                    let beg = this.activeNoteText.slice(0, this.caretPos-2)
                    let end = this.activeNoteText.slice(this.caretPos)

                    let newText = beg.concat(end)

                    this.alignCaretPos = true
                    this.alignCaretPosOffset = 0
                    // In order to stop our ta from double editing
                    this.deletedDelim = true

                    this.mutateNote(newText, true)
                }
            },
            handleKeypress() {
                if (![keycodes.shift, keycodes.caps_lock, keycodes.right_arrow, keycodes.tab].includes(event.keyCode)) {
                    this.updateCaretPos(keycodes.right_arrow)
                }

                if (event.keyCode == keycodes.backspace) {
                    // Close the auto matically added delims
                    if (this.delims['opening'].includes(this.activeNoteText[this.caretPos-2]) && this.delims['closing'].includes(this.activeNoteText[this.caretPos-1])) {
                        this.deleteDelim()
                    } else {
                        // if not we just re-align the 'caretPos'
                        this.updateCaretPos(keycodes.left_arrow)
                    }
                }

                // Reset backspacing but only if the 'backspace'/'delete'
                // ... buttons are not the ones being pressed
                if (event.keyCode != keycodes.backspace) {
                    this.backSpacing = false
                    this.deletedDelim = false
                }

                // Reset 'completed' on each new keypress to allow 'autoMoji' to popup
                this.completed = false

                // Hijack enter to complete 'automoji'
                if (event.keyCode == keycodes.enter && this.autoMojiOpen) {
                    event.preventDefault()
                    this.complete(this.index)
                }

                // Hijack 'left' and 'right' arrow for 'autoMoji'
                if (this.autoMojiOpen) {
                    // If tabs
                    if (event.keyCode == keycodes.tab) {
                        this.insertTab()
                    }

                    if (event.keyCode == keycodes.left_arrow || event.keyCode == keycodes.right_arrow) {
                        event.preventDefault()
                        this.checkToMove()
                    }
                } else {
                    if (!(event.keyCode == keycodes.right_arrow && this.caretPos >= this.activeNoteText.length)) {
                        this.updateCaretPos(event.keyCode)
                    }
                }
            },
            sanitizeWithKatex() {
                // Only apply KaTeX where we detect "$$*$$"
                return this.activeNoteText.replace(/\$\$[\n]*?[\s\S]*?[\n]*?\$\$/g, (m, o, s) => {return katex.renderToString(m.slice(2, m.length-2))})
            },
            checkToMove() {
                if (event.keyCode == keycodes.left_arrow ) {// "37") {
                    // Left arrow
                    this.index = this.index > 0 ? this.index - 1 : this.index
                }

                if (event.keyCode == keycodes.right_arrow) { // "39") {
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
                    let initSelectionStart = event.target.selectionStart
                    let tab = '\t'
                    let startTextChunk = event.target.value.slice(0, initSelectionStart)
                    let endTextChunk = event.target.value.slice(initSelectionStart)

                    let newText = startTextChunk.concat(tab).concat(endTextChunk)

                    this.$store.dispatch("editNote", newText) // Mutate actual notes text
                    event.target.value = this.activeNoteText // Ensures 'cursor' stays in the right place; after its value is mutated
                    event.target.selectionEnd = initSelectionStart + 1 // Now 'cursor' would be in the right place
                }
            },
            completeDelimiters(text) {
                // Check for 'uncompleted tags' (<{tag_name}>) and 'symbols' ('{', '[', '(')
                if (this.shouldCompleteDelimiters && !this.backSpacing) {
                    let initSelectionStart = this.caretPos+1

                    // Fix up text
                    let delim = text.slice(0, initSelectionStart).split(" ")[text.slice(0, initSelectionStart).split(" ").length-1]
                    delim = delim.split("\n")[delim.split("\n").length-1]

                    let completedDelim = ''
                    let offset = 0

                    // Determine what we are trying to complete
                    if (delim.match(/\<[a-zA-Z]+\>/) == delim) {
                        completedDelim = '</' + delim.slice(1, delim.length-1) + '>'
                        offset = completedDelim.length - 3
                    } if ('$$' == delim) {
                        let codePoint = delim[delim.length-1].charCodeAt()

                        completedDelim = '$$'
                        offset = 1
                    } else {
                        if (['~', '^', '`', '"', "'", '[', '{', '('].includes(delim[delim.length-1])) {
                            let codePoint = delim[delim.length-1].charCodeAt()
                            let newCodePoint

                            // Because the distance between '(' and ')' is 1
                            // ... while the distance between '{', '[', ']', '}' is 2
                            // and the distance for quotes (', ") and '`' is 0
                            newCodePoint = codePoint == 34 || codePoint == 39 || codePoint == 94 || codePoint == 126 ? codePoint : codePoint == 96 ? codePoint : codePoint == 40 ? 41 : codePoint + 2

                            completedDelim = String.fromCodePoint(newCodePoint)
                            offset = completedDelim.length
                        }
                    }

                    let startTextChunk = text.slice(0, initSelectionStart)
                    let endTextChunk = text.slice(initSelectionStart)

                    let newText = startTextChunk.concat(completedDelim).concat(endTextChunk)

                    this.alignCaretPosOffset = offset
                    this.alignCaretPos = completedDelim.length > 0 ? true : false

                    return newText
                } else {
                    //return this.deleteClosingDelims(text)
                    return text
                }
            },
            highlight(text) {
                return text.replace(/\n$/g, '\n\n').replace(/[A-Z].*?\b/g, '<mark>$&</mark>')
            },
            editNote (e) {
                // We need to lock further mutation immediately after 'delims' have been deleted
                // ... to avoid undoing the mutation
                if (!this.deletedDelim) this.mutateNote(e.target.value)
            },
            mutateNote(text, forced=false) {
                this.$store.dispatch("editNote", !forced ? this.completeDelimiters(text) : text)

                // Sync text on every mutation
                this.syncText()
            },
            closeAllModal() {
                let ta = document.getElementById('textarea')

                // Set ranges
                this.selectionRange = [ta.selectionStart, ta.selectionEnd]
                // Clean past coloring of ranges
                this.taInstance.unmark({
                    'element': 'mark',
                    'className': 'selection'
                })

                let tM = document.getElementById('t-modal')
                tM.children[0].value = ''

                this.updateCaretPos(0)

                document.getElementById('editor').style.opacity = "1"

                this.$store.dispatch("setModalVisibility", false)

                if (this.showModal || this.showExportModal) {
                    this.$store.dispatch("setExportModalVisibility", false)
                }

                if (this.exportedSingle) {
                    this.exportedSingle = false
                    this.exportedSingleName = ''
                }

                if (this.exportNewFile) {
                    this.$store.dispatch("setExportModalVisibility", false)
                }
            },
            setListStyle() {
                // Add Proper style for bullet list marker
                let listItems = document.getElementById('screen').querySelectorAll('li')

                for (var i = 0;i < listItems.length;i++) {
                    listItems[i].style.listStyleType = this.bulletListMarker
                }
            },
            handleExternalLinks() {
                // Make sure all links in the MD preview are opened in the default browser
                let anchors = document.getElementById('screen').querySelectorAll('a')

                for (var i = 0;i < anchors.length;i++) {
                    anchors[i].addEventListener('click', function (event) {
                        event.preventDefault()
                        console.log(`[Info] Opening '${this.href}'...`)
                        shell.openExternal(this.href)
                    })
                }
            },
            resetCaretPosAlignment() {
                document.getElementById('textarea').selectionEnd = document.getElementById('textarea').selectionEnd - this.alignCaretPosOffset
                this.caretPos = document.getElementById('textarea').selectionEnd

                this.alignCaretPos = false
                this.alignCaretPosOffset = 0
            },
            incTANSBottomPad(size) {
                if (this.caretPos == this.activeNoteText.length-1) {
                    document.getElementById('textarea').scrollTop = document.getElementById('textarea').scrollHeight
                }
                // increase bottom padding
                // Scroll into view
                document.getElementById('textarea').style.paddingBottom = String(size).concat("px")
                document.getElementById('fake-ta').style.paddingBottom = String(size).concat("px")

                if (this.live) {
                    document.getElementById('screen').style.paddingBottom = String(size).concat("px")
                }
            },
            decTANSBottomPad(size) {
                document.getElementById('textarea').style.paddingBottom = String(size).concat("px")
                document.getElementById('fake-ta').style.paddingBottom = String(size).concat("px")

                if (this.live) {
                    document.getElementById('screen').style.paddingBottom = String(size).concat("px")
                }
            }
        }
    }
</script>

<style scoped>
    #editor {
        transition: opacity 0.3s ease-in;
        height: 100%;
        overflow: hidden;
        user-select: none;
        z-index: -999;
    }

    #textarea {
        position: relative;
        box-sizing: border-box;
        padding: 40px 55px 35px 55px;
        height: calc(100% - 2.0rem);
        width: calc(100% - 0.010rem);
        border: 0;
        border-radius: 0;
        outline: none;
        transition: padding 0.2s ease-in;
        font-weight: normal;
        -webkit-tap-highlight-color: transparent;
        resize: none;
        z-index: 9;
    }

    #fake-ta {
        position: absolute;
        top: 0;
        height: calc(100% - 2.0rem);
        padding: 40px 55px 35px 55px;
        font-size: 14px;
        box-sizing: border-box;
        font-style: normal;
        font-variant: normal;
        font-weight: 400;
        word-wrap: break-word;
        margin: 0px;
        position: absolute;
        white-space: pre-wrap;
        overflow: hidden;
        border: none;
    }

    #screen {
        position: relative;
        overflow: auto;
        box-sizing: border-box;
        padding: 40px 65px 40px 65px;
        height: calc(100% - 2.0rem);
        width: calc(100% - 0.010rem) !important;
        border: 0;
        border-radius: 0;
        outline: none;
        font-weight: normal;
    	-webkit-tap-highlight-color: transparent;
        resize: none;
        user-select: text;
        z-index: 9;
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
        left: 45%;
        z-index: 9999;
        font-size: 14px;
        transition: all 0.2s linear;
    }

    #t-modal1 {
        position: fixed;
        width: 240px;
        padding-left: 30px;
        padding-top: 15px;
        padding-right: 30px;
        padding-bottom: 10px;
        border-radius: 10px;
        top: 35%;
        left: 45%;
        z-index: 9999;
        font-size: 14px;
        transition: all 0.2s linear;
    }

    #t-modal1 p {
        margin-top: 0;
        margin-bottom: 5px;
    }

    #t-modal1 .buttonArray button:first-child {
        margin-left: 0px;
    }

    #t-modal1 .buttonArray button {
        cursor: pointer;
        margin: 10px;
        padding-top: 5px;
        padding-left: 10px;
        padding-right: 10px;
        padding-bottom: 5px;
        border: none;
        border-radius: 2px;
        outline: none;
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
    }

    .search:active, .search:focus {
        width: 100%;
        border-bottom: 1px solid dodgerblue;
        transition: width .8s ease, background-color .5s ease, border-bottom .4s ease;
    }

    .slide-in-further {
        animation: slide-down .4s ease-out;
    }

    .warning {
        position: absolute;
        bottom: 80px;
        right: 40px;
        padding: 20px;
        border-radius: 5px;
        transition: .3s ease-out;
        z-index: 9999;
    }

    .warning button {
        width: 60px;
        height: 30px;
        margin-right: 10px;
        outline: none;
        border: none;
        border-radius: 2.5px;
        cursor: pointer;
    }

    .success {
        position: absolute;
        height: 15px;
        bottom: 80px;
        right: 40px;
        padding: 20px;
        border-radius: 5px;
        opacity: 1;
        transition: .3s ease-out;
        z-index: 9999;
    }

    .success h3, .warning h3 {
        font-size: 12px;
    }

    .warning button:hover {
        opacity: 0.9;
    }

    .slide-in {
        animation: slide .4s ease-out;
    }

    .hideModal {
        opacity: 0;
        transform: translateX(680px);
    }

    @keyframes slide {
        0% {
            opacity: 0.3;
            transform: translateX(680px);
        },
        25% {
            opacity: 0.5;
        },
        100% {
            opacity: 1;
            transform: translateX(0px);
        }
    }

    @keyframes slide-down {
        0% {
            opacity: 0.3;
            transform: translateY(-220px);
        },
        25% {
            opacity: 0.5;
        },
        100% {
            opacity: 1;
            transform: translateY(0px);
        }
    }
</style>
