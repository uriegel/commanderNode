<template>
    <div class="root">
        <h3>Folder Test</h3>
        <folder ref="folder" class="folder" id="test"></folder>
        <footer>Status</footer>
    </div>
</template>

<script>
import Folder from '../controls/Folder'
export default {
    components: {
        Folder
    },
    mounted() { this.$refs.folder.focus() }
}
</script>

<style scoped>
.root {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
} 
.folder {
    flex-grow: 1;
    margin: 10px 50px;
}
footer {
    margin: 10px;
}
</style>
