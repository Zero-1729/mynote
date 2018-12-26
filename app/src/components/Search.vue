<template>
    <div class="editor-search-bar" :class="{castAway: !showPanel, appear: showPanel}">
        <div class="editor-search-bar-container">
            <p class="editor-search-bar-status-panel-info"
                :class="{red: err.length > 0}"
            >
                {{ err.length > 0 ? err : searchText.length == 0 ? 'Find word in Current Note' : match == 0 ? `No results Found for '${searchText}'` : `Found ${match} matches for '${searchText}'`}}
            </p>
            <div class="right-bound">
                <p class="editor-search-bar-status-panel-info-right">
                    <font color="grey">Search rule:</font> {{searchType}}
                </p>
                <div class="editor-search-bar-status-panel-buttons">
                    <button class="editor-search-bar-small-btn" :class="{type: searchType == 'Regex'}" @click="setSearchType('Regex')">
                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="isolation:isolate" viewBox="0 0 20 20" width="20" height="20"><circle vector-effect="non-scaling-stroke" cx="5.950840538182177" cy="14.5" r="1" /><path d=" M 14.185 10.506 L 14.185 10.506 C 13.235 10.312 12.285 10.922 12.065 11.867 L 12.065 11.867 C 11.845 12.811 11.416 12.831 11.108 11.912 L 11.108 11.912 C 10.8 10.992 9.797 10.475 8.869 10.756 L 8.869 10.756 C 7.942 11.038 7.71 10.677 8.352 9.951 L 8.352 9.951 C 8.994 9.224 8.941 8.096 8.233 7.434 L 8.233 7.434 C 7.526 6.771 7.722 6.39 8.673 6.583 L 8.673 6.583 C 9.623 6.776 10.573 6.166 10.793 5.222 L 10.793 5.222 C 11.013 4.277 11.441 4.257 11.749 5.177 L 11.749 5.177 C 12.057 6.096 13.06 6.614 13.988 6.332 L 13.988 6.332 C 14.916 6.051 15.148 6.412 14.506 7.138 L 14.506 7.138 C 13.863 7.864 13.916 8.992 14.624 9.655 L 14.624 9.655 C 15.332 10.318 15.135 10.699 14.185 10.506 Z " /></g></g></svg>
                    </button>
                    <button class="editor-search-bar-small-btn" :class="{type: searchType == 'Case Sensitive'}" @click="setSearchType('Case Sensitive')">
                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="isolation:isolate" viewBox="0 0 20 20" width="20" height="20"><g transform="matrix(1,0,0,1,2,5.5)"><text transform="matrix(1,0,0,1,0,8.58)" style="font-weight:400;font-size:12px;font-style:normal;stroke:none;">Aa</text></g></g></svg>
                    </button>
                    <button class="editor-search-bar-small-btn" :class="{type: searchType == 'Whole Word'}" @click="setSearchType('Whole Word')">
                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="isolation:isolate" viewBox="0 0 20 20" width="20" height="20"><rect x="5.25" y="7" width="9.5" height="2.5" transform="matrix(1,0,0,1,0,0)" class="darker" /><rect x="2.25" y="7" width="2" height="2.5" transform="matrix(1,0,0,1,0,0)" class="lighter" /><rect x="15.75" y="7" width="2" height="2.5" transform="matrix(1,0,0,1,0,0)" class="lighter" /><path d=" M 5.125 11 L 6.125 11 L 6.125 12 L 13.75 12 L 13.75 11 L 14.75 11 L 14.75 13 L 5.125 13 L 5.125 11 Z " class="darker" /></g></svg>
                    </button>
                </div>
            </div>
            <svg class="editor-search-bar-close-btn" @click="closeSearchPanel" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="isolation:isolate" viewBox="0 0 20 20" width="20" height="20">
                <path d=" M 10 8.586 L 6.464 5.05 C 6.074 4.66 5.441 4.66 5.05 5.05 L 5.05 5.05 C 4.66 5.441 4.66 6.074 5.05 6.464 L 8.586 10 L 5.05 13.536 C 4.66 13.926 4.66 14.559 5.05 14.95 L 5.05 14.95 C 5.441 15.34 6.074 15.34 6.464 14.95 L 10 11.414 L 13.536 14.95 C 13.926 15.34 14.559 15.34 14.95 14.95 L 14.95 14.95 C 15.34 14.559 15.34 13.926 14.95 13.536 L 11.414 10 L 14.95 6.464 C 15.34 6.074 15.34 5.441 14.95 5.05 L 14.95 5.05 C 14.559 4.66 13.926 4.66 13.536 5.05 L 10 8.586 Z " fill-rule="evenodd" />
            </svg>
        </div>
        <div class="editor-search-bar-container">
            <div class="editor-search-bar-input-container"
            :class="{activated: activeInput && match == 0 && searchText == '',
                    'activated-no-match': activeInput && match == 0 && searchText != '',
                    'activated-matched': activeInput && match > 0 && searchText != ''}">
                <input class="editor-search-bar-input" @click="setSelection" v-model="searchText" @input="search" @focus="activeInput=true" @blur="killTmp" />
                <!-- if the 'searchText' is empty then we haven't typed; its greyed -->
                <!-- if the 'match' is zero and 'searchText' is not empty then failed search; red -->
                <!-- and if the 'match' is non-zero and 'searchText' is not empty then we have matches; green-->
                <div class="editor-search-bar-input-info" :class="{grey: searchText == '', red: match == 0, green: match > 0}">
                    {{ match == 0 ? 'no results' : `${match} found` }}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    const mark  = require('./../util/mark')

    export default {
        name: 'Search',
        data () {
            return {
                activeInput: false,
                searchText: '',
                marked: false,
                err: false,
                options: {
                    'default': {
                        'element': 'mark',
                        'diacritics': true,
                        'done': this.getMatches
                    },
                    'sensitive': {
                        'element': 'mark',
                        'caseSensitive': true,
                        'diacritics': true,
                        'done': this.getMatches
                    },
                    'selection': {
                        'element': 'mark',
                        'className': 'selection'
                    },
                    'whole': {
                                'element': 'mark',
                                'diacritics': true,
                                'separateWordSearch': false,
                                'accuracy': 'exactly',
                                'done': this.getMatches
                    }
                },
                match: 0
            }
        },
        watch: {
            activeNoteText: function (curr, prev) {
                this.search()
            },
            searchType: function (curr, prev) {
                if (curr != '') this.search()
            }
        },
        methods: {
            killTmp() {
                this.activeInput = false
                this.marked = false
            },
            setSelection() {
                if (!this.marked) {
                    let text = this.activeNoteText.slice(this.selectionRanges.start, this.selectionRanges.length)
                    if (this.selectionRanges.length) {
                        this.taInstance.markRanges([this.selectionRanges], this.options['selection'])
                        this.marked = true
                    }
                }
            },
            syncText() {
                if (this.showSPanel) {
                    document.getElementById('fake-ta').innerText = this.currentText
                }
            },
            getMatches(c) {
                this.match = c ? c : 0
            },
            getSelectionText() {
                let ta = document.getElementById('textarea')
                let text = ta.value.slice(ta.selectionStart, ta.selectionEnd)
                return text
            },
            search() {
                let regex = null
                this.err = ''
                this.match = 0
                this.syncText()
                this.taInstance.unmark(this.options['default'])

                // Perform Text Replacement only if the current searcht text is not empty
                if (this.searchText.length > 0) {
                    // Otherwise we add highlights to the text depending on the 'searchType'
                    if (this.searchType === "Fuzzy") {
                        this.$parent.$parent.exposeMispelled()
                        let regex = new RegExp(this.searchText.replace(/\$$|\+|\.|\*|\^|\(|\)|\[|\]|\{|\}|\\/g, '\\$&'), 'gi')

                        this.taInstance.markRegExp(regex, this.options['default'])
                    }

                    if (this.searchType === "Regex") {
                        this.$parent.$parent.exposeMispelled()

                        // This causes a lot of warn messages when 'regex' is not valid
                        try {
                            regex = new RegExp(this.searchText, 'g')
                            this.taInstance.markRegExp(regex, this.options['default'])
                            this.err = ''
                        } catch {
                            this.err = `Invalid regular expression '/${this.searchText}/g'`
                        }
                    }

                    if (this.searchType === "Case Sensitive") {
                        this.$parent.$parent.exposeMispelled()

                        regex = new RegExp(this.searchText, 'g')

                        this.taInstance.markRegExp(regex, this.options['sensitive'])
                    }

                    if (this.searchType === "Whole Word") {
                        this.$parent.$parent.exposeMispelled()

                        let pat = this.searchText
                        regex = new RegExp('\\b'.concat(pat).concat('\\b'), 'g')

                        this.taInstance.markRegExp(regex, this.options['whole'])
                    }
                }
            },
            setSearchType(type) {
                this.$store.dispatch("setSearchType", type)
            },
            closeSearchPanel() {
                this.searchText = ''
                this.taInstance.unmark(this.options['default'])
                this.$store.dispatch("toggleSpanel", true)
            }
        },
        computed: {
            selectionRange() {
                return this.$parent.$parent.selectionRange
            },
            selectionRanges() {
                return this.selectionRange ? {start: this.selectionRange[0], length: this.selectionRange[1] - this.selectionRange[0]} : {start: 0, length: this.selectionRange[1]}
            },
            showPanel() {
                return this.$store.getters.showSPanel
            },
            searchType() {
                return this.$store.getters.searchType
            },
            currentText() {
                return this.$store.getters.activeNote.text
            },
            activeNoteText() {
                return this.$store.getters.activeNote.text
            },
            markedown() {
                return this.$store.getters.live
            },
            taInstance() {
                return this.$parent.$parent.taInstance
            }
        }
    }
</script>

<style>
    .right-bound {
        display: inline-flex;
        margin-left: auto;
        margin-top: auto;
        margin-bottom: auto;
        margin-right: 16px;
        height: 25px;
    }

    .editor-search-bar-status-panel-info {
        font-size: 11px;
        margin-top: 3px;
        margin-left: 8px;
        margin-bottom: 0;
    }

    .editor-search-bar-status-panel-info-right {
        font-size: 11px;
        margin-top: -6px;
        margin-right: 16px;
    }

    .editor-search-bar-small-btn svg {
        margin-top: 1px;
    }

    .editor-search-bar-small-btn {
        outline: none;
        cursor: pointer;
    }

    .editor-search-bar-small-btn:nth-child(3) {
        border-left: none;
    }

    .editor-search-bar-small-btn:first-child {
        border-top-left-radius: 3px;
        border-bottom-left-radius: 3px;
        border-right: none;
    }

    .editor-search-bar-small-btn:last-child {
        border-top-right-radius: 3px;
        border-bottom-right-radius: 3px;
        border-left: none;
    }

    .editor-search-bar-input-container {
        width: 96%;
        height: 30px;
        left: 18px;
        position: relative;
        border-width: 1.5px;
        border-radius: 2.5px;
        border-style: solid;
    }

    .editor-search-bar-input {
        position: absolute;
        width: 90%;
        bottom: -3px;
        height: 10px;
        padding: 6px;
        margin-left: 8px;
        margin-bottom: 8px;
        outline: none;
        border: none;
    }

    .editor-search-bar-input-info {
        font-size: 9px;
        bottom: -2px;
        right: 18px;
        position: absolute;
    }

    .editor-search-bar-status-panel-buttons {
        display: inline-flex;
        margin: 0;
        padding: 0;
    }

    .editor-search-bar-close-btn {
        height: 20px;
        width: 20px;
        margin-right: 8px;
        margin-top: 10px;
        cursor: pointer;
    }

    .editor-search-bar-close-btn:hover {
        opacity: 0.85;
    }

    .editor-search-bar-container:first-child {
        margin-bottom: 8px;
        height: 40px;
    }

    .editor-search-bar-container {
        display: flex;
        flex-flow: row;
        justify-content: space-between;
    }

    .castAway {
        transform: translateY(140px);
        opacity: 0.3;
    }

    .appear {
        transform: translateY(0);
        opacity: 1;
    }

    .editor-search-bar {
        transition: 0.6s cubic-bezier(0.18, 0.89, 0.32, 1.28);
        width: 100%;
        height: 90px;
        display: flex;
        flex-flow: column;
        position: absolute;
        bottom: 38px;
    }
</style>
