import { JSX } from "react"


const ImageInput = ({ onUploadAction }: any): JSX.Element =>
    <> <input type="file" accept="image/*" onChange={onUploadAction} /> </>


export default ImageInput