<template>
    <div>
        <h1>Verbindungstest</h1>
        <button @click=onClick>"Get c:\windows\system32"</button>
    </div>
</template>

<script>

export default {
    methods: {
        async onClick() {
            const result = await extFs.getFiles(`c:\\windows\\system32`)
            console.log(result)
        }
    }
}
</script>

<style scoped>

</style>
