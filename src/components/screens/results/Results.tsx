import styles from './Results.module.scss';
import './Results.scss';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import Chart from './Chart.tsx'
import {useState} from "react";
import dataMock from "./annotations.json";
import { Carousel } from 'primereact/carousel';
import moment from 'moment';

type dataType = typeof dataMock
export default ({data}: {data: dataType}) => {
    const [frames] = useState(data.frames);
    const [clusters] = useState(data.clusters);
    const [selectedFrame, setSelectedFrame] = useState(frames[0]);
    const [selectedCluster, setSelectedCluster] = useState(clusters[0]);
    const [selectedFace, setSelectedFace] = useState();

    const onFaceClick = (face) => {
        let cluster = clusters.find((el) => el.cluster_id === face.cluster_id);
        if(cluster){
            setSelectedCluster(cluster);
            let facing = cluster.faces.find((el) => el.face_id === face.face_id)
            if(facing){
                setSelectedFace(facing);
            }
        }
    }

    const facesList = selectedFrame.faces && selectedFrame.faces.length ? selectedFrame.faces.map((face) => {
        const faceStyle = {
            top: (face.y1 / selectedFrame.height) * 100 + '%',
            left: (face.x1 / selectedFrame.width) * 100 + '%',
            width: ((face.x2 - face.x1) / selectedFrame.width) * 100 + '%',
            height: ((face.y2 - face.y1) / selectedFrame.height) * 100 + '%',
        }
        let badgeFrom = face.y1
        if(face.y1 < 50){
            badgeFrom = face.y2+25;
        }
        const badgeStyle = {
            bottom: ((selectedFrame.height - badgeFrom) / selectedFrame.height) * 100 + '%',
            left: (face.x1 / selectedFrame.width) * 100 + '%',
        }
        const pointsList = face.points.map((point => {
            const pointStyle = {
                left: (point[0] / selectedFrame.width) * 100 + '%',
                top: (point[1] / selectedFrame.height) * 100 + '%',
            }
            return <div className={styles.point} style={pointStyle}></div>
        }))
        return (<>
            <div className={styles.badge} style={badgeStyle}>Person {face.cluster_id}</div>
            <div className={`${styles.face} ${selectedFace && face.face_id === selectedFace.face_id ? styles.faceActive : ''}`} style={faceStyle} onClick={() => onFaceClick(face)}></div>
            {pointsList}
        </>)
    }) : null


    type Frame = typeof frames[0];

    const itemTemplate = (item: Frame) => {
        return <div
            onClick={()=>{setSelectedFrame(item)}}
            className={`${styles.frameListItem} ${item === selectedFrame ? styles.active : ''}`}
            style={{"backgroundImage": `url(${item.image})`}}>
        </div>
    };

    const selectFace = (face: any) => {
        setSelectedFace(face);
        let frame = frames.find(el=> el.photo_id === face.photo_id);
        if(frame){
            setSelectedFrame(frame);
        }
    }

    const clusterFacesList = selectedCluster.faces.map((item) => {
        return <div
            onClick={() => selectFace(item)}
            className={`${styles.clusterFacesListItem} ${item === selectedFace ? styles.actives : ''}`}
            style={{"backgroundImage": `url(${item.image})`}}>
        </div>
    })

    const prevCluster = () => {
        const pos = clusters.indexOf(selectedCluster);
        if(pos >= 1 && clusters[pos-1] ){
            setSelectedCluster(clusters[pos-1]);
        }
    }

    const nextCluster = () => {
        const pos = clusters.indexOf(selectedCluster);
        if(pos < clusters.length && clusters[pos+1]){
            setSelectedCluster(clusters[pos+1]);
        }
    }

    const clusterListTitle = () => {
        return (
            <div className={styles.clusterListTitle}>
                Persons
                <div className={styles.clusterListNav}>
                    <Button icon="pi pi-arrow-left" rounded text onClick={prevCluster} />
                    Person {selectedCluster.cluster_id}
                    <Button icon="pi pi-arrow-right" rounded text onClick={nextCluster} />
                </div>
            </div>
        )
    }

    let tempTime = moment.duration(data.totalTime ?? 0);
    let duration = tempTime.minutes() ? tempTime.minutes() + ':' + tempTime.seconds() + 'm' : tempTime.seconds() + 's'

    return (
        <div className={styles.layout}>
            <div className={`${styles.block} ${styles.left}`}>
                <Card title="Summary" subTitle={
                    <div className={styles.cardSubtitle}>
                    <span>Total frames: {frames.length}</span>
                    <span>Found persons: {clusters.length}</span>
                    <span>Processing time: {duration}</span>
                    </div>
                }>
                    {(clusters.length) && <Chart clusters={clusters} />}
                </Card>
                <Card title={clusterListTitle} className={styles.clusterList} style={{'flex': 1}}>
                    <div className={styles.clusterFacesList}>
                        {clusterFacesList}
                    </div>
                </Card>
            </div>
            <div className={`${styles.block} ${styles.right}`}>
                <Card className={styles.photoPanel} title="">
                    <div className={styles.photoWrapper}>
                        <div className={styles.photoBox}>
                            <div className={styles.markup}>
                                {facesList}
                            </div>
                            <img src={selectedFrame.image} />
                        </div>
                    </div>
                </Card>
                <Card className={styles.photoList}>
                    <Carousel value={frames} numVisible={8} numScroll={5}  className="custom-carousel" circular showIndicators={false} itemTemplate={itemTemplate} />
                </Card>
            </div>
        </div>
    )
}
