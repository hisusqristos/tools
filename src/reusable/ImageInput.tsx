import { JSX } from "react"
import { FileUp } from "lucide-react"

const ImageInput = ({ onUploadAction }: any): JSX.Element =>
    <div> <FileUp /> <input type="file" accept="image/*" onChange={onUploadAction} /> </div>


export default ImageInput