<template>
    <div id="editor">
        <textarea
            id="textarea"
            :value="activeNoteText"
            @input="editNote"
            class="form-control">
        </textarea>
    </div>
</template>

<script>

export default {
    computed: {
        activeNoteText () {
            return this.$store.state.activeNote.text
        }
    },
    methods: {
        editNote (e) {
            this.$store.dispatch("editNote", e.target.value)
        }
    }
};
</script>
