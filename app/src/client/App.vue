<template>
    <div id='app'>
        <notes-list></notes-list>
        <editor></editor>
        <bottom></bottom>
    </div>
</template>

<script>
    import NotesList  from './components/NotesList.vue'
    import Editor     from './components/Editor.vue'
    import Bottom     from './components/Bottom.vue'

    export default {
        components: {
            NotesList,
            Editor,
            Bottom
        }
    }
</script>

<style>
    @import './css/main.css';
</style>
