import { useState, useEffect } from "react";

/**
* Whenever the EditorLayout content changes in size it communicates the new dimensions to our IFrame
*/
const useIframeResize = () => {
    const [editorSize, setEditorSize] = useState<{ width: number, height: number } | null>(null)

    useEffect(() => {
        const observer = new ResizeObserver(([entry]) => {
            const updatedSize = {
                width: Math.round(entry.contentRect.width),
                height: Math.round(entry.contentRect.height)
            }
            setEditorSize(updatedSize)
        });

        const editor = document.getElementById("editor");
        if (!editor) return
        observer.observe(editor)

        return () => observer.disconnect();

    }, [])

    useEffect(() => {
        if (!editorSize) return

        const timeout = setTimeout(() => {
            window.parent.postMessage(editorSize, "*")
            console.log(JSON.stringify(editorSize))
        }, 100)

        return () => clearTimeout(timeout)
    }, [editorSize])

}

export default useIframeResize