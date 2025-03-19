import { JSX } from "react";


const DownloadButton = ({ onClickAction }: any): JSX.Element =>
(<div>
    <button onClick={onClickAction}>
        Download
    </button>
</div>)

export default DownloadButton