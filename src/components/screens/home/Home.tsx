import { Button } from "primereact/button";
import { ProgressBar } from 'primereact/progressbar';
import styles from './Home.module.scss'
import './Home.scss'
import Results from "../results/Results.tsx";
import dataMock from "../results/annotations.json";
import {useState, useRef, ChangeEvent } from "react";


export default () => {
    const [files, setFiles] = useState<FileList>();
    const [isSuccess, setIsSuccess] = useState(false);
    const [progress, setProgress] = useState(0);
    const [result, setResult] = useState(dataMock);

    const filesInputRef = useRef<HTMLInputElement>(null)
    const folderInputRef = useRef<HTMLInputElement>(null)

    const onClick = (folder = false) => {
        if(folder){
            folderInputRef.current?.click();
        }else{
            filesInputRef.current?.click();
        }
    }

    const getProgress = (task_id: string) => {
        //Simple javascript code which listens to the stream.
        let source = new EventSource(`/api/task/${task_id}/stream`);
        source.addEventListener('progress', function(event) {
            setProgress(parseInt(event.data));
        }, false);
        source.addEventListener('result', function(event) {
            setProgress(100);
            console.log(event);
            try{
                setResult(JSON.parse(event.data));
                setIsSuccess(true);
            }catch(e){
                console.log(e);
            }
            source.close();
        }, false);
        source.addEventListener('error', function (event) {
            console.log("Error"+ event)
        }, false);
    }

    const onChange = async (e: ChangeEvent<HTMLInputElement>) => {
        if (!e?.target?.files) {
            return;
        }
        setFiles(e.target.files);


        const formData = new FormData();
        for(const file of e.target.files){
            formData.append('files', file);
        }
        //formData.append('files[]', file);


        fetch('/api/upload', {
            method: 'POST',
            body: formData
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('File upload failed');
                }
            })
            .then(data => {
                console.log('Server response:', data);
                getProgress(data.task_id);
            })
            .catch(error => {
                console.error('Error uploading file:', error);
            });



        // setIsSuccess(true);

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

    return (
        <>
        {!isSuccess ?
                (<div className={styles.layout}>
            <img src="/logo.png" className={styles.logo} onClick={() => setIsSuccess(true)}/>
            {!files?.length ? <UploadButtons /> : <div className={styles.progress}>
                Processing...
                <ProgressBar value={progress}/>
            </div>}
        </div>) : <Results data={result} />} </>)
}
