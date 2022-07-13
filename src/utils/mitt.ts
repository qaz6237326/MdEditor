import mitt from "mitt"

export const emitter = mitt()

export enum EventType {
    Scroll = 'scroll',
    EditorShow = 'editor-show',
    KeyEvents = 'key-events',
    FileStatus='file-status',
    MdContent='md-content',
    EditorMdContent='editor-md-content',
    SaveArticle='save-article',
}
