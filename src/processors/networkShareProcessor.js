import { createProcessor, ROOT, SHARES } from './processor'
import { getRootProcessor } from './root'

export const SHARES_NAME = "Freigaben"

export function getNetworkShareProcessor(processor) {
    if (processor)
        processor.dispose()

    let sortIndex = null
    let sortDescending = false
    let items = []

    function getProcessor(path) { 
        return path == SHARES ? null : createProcessor(thisProcessor, path)
    }

    function checkPath(path) { return path == SHARES }

    function getColumns(columns) {
        return columns && columns.type == SHARES
            ? columns
            : {
                type: SHARES,
                values: [{
                        isSortable: true,
                        name: "Name"
                    }]
            }
    }
    async function getItems() {
        const shares = JSON.parse(localStorage["networkShares"] || "[]")
        const shareItems = shares.map(n => { return { name: n, isDirectory: true }})
        items = [{ name: "..", isDirectory: true }].concat(shareItems)
        items.forEach(n => {
            n.isSelected = false
        })
        return refresh(items)
    }

    function sort(items, index, descending) {
        sortIndex = index
        sortDescending = descending
        return refresh(items)
    }

    function refresh(items) {
        let parent = items.filter(n => n.name == "..")
        let services = items.filter(n => n.name != "..")

        const sort = (a, b) => a.name.localeCompare(b.name) 
        return parent.concat(services.sort((a, b) => (sortDescending ? -1 : 1) * sort(a, b)))
    }    

    function getItemWithPath(path, item) { return item.name }

    function onAction(items) {
        if (items.length == 1 && items[0].name == "..")
            return {
                done: false,
                newProcessor: createProcessor(thisProcessor, ROOT),
                path: ROOT,
                lastPath: SHARES_NAME
            }
        else {
            try {
                items.forEach(n => extFs.startService(n.name))
                return { done: true }
            } catch (ex) {
                extFs.startElevated()
                window.close()
            }
        }
    }    

    function canCreateFolder() { return true }
    function canDelete() { return true }

    async function createFolder(folderName) {
        var items = await extFs.getNetShares(folderName)
        if (items.length > 0) {
            const shares = JSON.parse(localStorage["networkShares"] || "[]")
            shares.push(folderName) 
            localStorage["networkShares"] = JSON.stringify(shares)
        }
    }

    async function deleteItems(folder, dialog, selectedItems) {
        const result = await dialog.show({
            ok: true, 
            cancel: true,
            defButton: "ok",
            text: "Möchtest Du die selektierten Freigaben entfernen?"
        })
        folder.focus()
        if (result.result == 1) {
            const toDeleteItems = selectedItems.map(n => n.name)
            const shares = JSON.parse(localStorage["networkShares"] || "[]").filter(n => !toDeleteItems.includes(n))
            localStorage["networkShares"] = JSON.stringify(shares)
            folder.refresh()
        }
    }

    function dispose() {}

    var thisProcessor = {
        name: "shares",
        path: SHARES,
        getProcessor,
        dispose,
        checkPath,
        getColumns,
        getItems,
        sort,
        refresh,
        getItemWithPath,
        onAction,
        canCreateFolder,
        canDelete,
        createFolder,
        deleteItems
    }
    return thisProcessor
}

