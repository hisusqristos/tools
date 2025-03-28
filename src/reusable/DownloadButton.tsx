import { JSX } from "react";
import { ImageDown } from "lucide-react";
import "./Download.css"

const DownloadButton = ({ onClickAction }: any): JSX.Element =>
    <div className="download-button">
        <ImageDown />
        <button className="button" onClick={onClickAction}> Download </button>
    </div>


export default DownloadButton