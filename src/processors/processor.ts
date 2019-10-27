import { isLinux, pathDelimiter } from '../platform'
import { getRootProcessor as getWindowsRootProcessor } from './windows/root'
import { getRootProcessor as getLinuxRootProcessor } from './linux/root'
// import { getDirectoryProcessor } from './directory'
// import { getServicesProcessor } from './services'
// import { getNetworkSharesProcessor } from './networkShares'
// import { getNetworkShareProcessor } from './networkShare'

export const ROOT = "root:"
export const SERVICES = "services:"
export const SHARES = "shares:"

// TODO: onAction: getShares mit starker Verzögerung, wenn dann bereits weiter geändert

export enum FolderType {
    DEFAULT,
    ROOT,
}

export interface FolderColumn {
    name: string
    isSortable?: boolean
    sortAscending?: boolean
    columnsType?: number
    width?: number | string
}

export interface FolderColumns {
    type: FolderType
    values: FolderColumn[]
}

export interface Processor {
    name: string
    dispose(): void
    getColumns(recentColumns: FolderColumns): FolderColumns
}

export function createProcessor(recentProcessor: Processor, path: string) {
 //   switch (path) {
//        case ROOT:
            return isLinux 
                ? getLinuxRootProcessor(recentProcessor) 
                : getWindowsRootProcessor(recentProcessor)
        // case SERVICES:
        //     return getServicesProcessor(recentProcessor)
        // case SHARES:
        //     return getNetworkSharesProcessor(recentProcessor)
        // default:
        //     return (path && path.startsWith("\\\\") && path.indexOf('\\', 2) == -1)
        //         ? getNetworkShareProcessor(recentProcessor, path)
        //         : getDirectoryProcessor(recentProcessor, path)
//    }
}

export function getDefaultProcessor(): Processor {
    return { 
        name: "default",
        dispose: () => {},
        getColumns: (recentColumns: FolderColumns) => { return { type: FolderType.DEFAULT, values: []} }
    }
}

export function combinePath(path1: string, path2: string) {
    if (path2 == "..") {
        let pos = path1.lastIndexOf(pathDelimiter, path1.length - 2)
        if (path1[pos - 1] == ':')
            pos += 1
        return pos != -1 ? path1.substr(0, pos) : null
    }
    return path1.endsWith(pathDelimiter) ? path1 + path2 : path1 + pathDelimiter + path2
}


