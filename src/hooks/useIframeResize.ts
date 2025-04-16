import { useState, useEffect } from "react";

/**
* Whenever the EditorLayout content changes in size it communicates the new dimensions to our IFrame
*/
const useIframeResize = () => {
    const [editorSize, setEditorSize] = useState<{ width: number, height: number } | null>(null)

    useEffect(() => {
        const observer = new ResizeObserver((entries) => {
            const updatedSize = {
                width: entries[0].contentRect.width,
                height: entries[0].contentRect.height
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
        window.parent.postMessage(editorSize, "*");
    }, [editorSize])

}

export default useIframeResize