import { Button } from "primereact/button";
import { ProgressBar } from 'primereact/progressbar';
import styles from './Home.module.scss'
import './Home.scss'
import Results from "../results/Results.tsx";
import {useState, useRef, ChangeEvent} from "react";

export default () => {
    const [files, setFiles] = useState<FileList>();
    const [isSuccess, setIsSuccess] = useState(false);
    const [progress, setProgress] = useState(0);

    const filesInputRef = useRef<HTMLInputElement>(null)
    const folderInputRef = useRef<HTMLInputElement>(null)

    const onClick = (folder = false) => {
        if(folder){
            folderInputRef.current?.click();
        }else{
            filesInputRef.current?.click();
        }
    }

    const sleep = (ms: number) => {
        return new Promise((resolve) => {
            setTimeout(resolve, ms);
        })
    }

    const onChange = async (e: ChangeEvent<HTMLInputElement>) => {
        if (!e?.target?.files) {
            return;
        }
        setFiles(e.target.files);

        for(let i=0; i<=100; i++){
            setProgress(i);
            await sleep(50);
        }

        setIsSuccess(true);

    }

    const UploadButtons = () => {
        return (<div className={styles.buttons}>
            <Button label="Select files" icon="pi pi-file" onClick={() => onClick()} />
            or
            <Button label="Choose folder" icon="pi pi-folder" onClick={() => onClick(true)} />
            {/* @ts-ignore */}
            <input className={styles.hiddenFileInput} ref={folderInputRef} type='file' multiple webkitdirectory='' onChange={onChange}/>
            <input className={styles.hiddenFileInput} ref={filesInputRef} type='file' multiple onChange={onChange}/>
        </div>)
    }

    const HomeScreen = () => {
        return (
        <div className={styles.layout}>
            <img src="/logo.png" className={styles.logo} onClick={() => setIsSuccess(true)}/>
            {!files?.length ? <UploadButtons /> : <div className={styles.progress}>
                Processing...
                <ProgressBar value={progress}/>
            </div>}
        </div>)
    }

    return (
        <>
            { isSuccess ? <Results /> : <HomeScreen /> }
        </>
    )
}
