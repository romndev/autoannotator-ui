import styles from './Results.module.scss';
import './Results.scss';
import { Card } from 'primereact/card';
import Chart from './Chart.tsx'
import {useState} from "react";
import dataMock from "./mock.json";
import { Carousel } from 'primereact/carousel';
export default () => {
    const [isLoading, setIsLoading] = useState(false);
    const [frames] = useState(dataMock.frames);
    const [clusters] = useState(dataMock.clusters);
    const [selectedFrame, setSelectedFrame] = useState(frames[0]);
    const [selectedCluster] = useState(clusters[0]);
    const [selectedFace, setSelectedFace] = useState();

    setTimeout(() => setIsLoading(true), 400);

    const facesList = selectedFrame.faces && selectedFrame.faces.length ? selectedFrame.faces.map((face) => {
        const faceStyle = {
            top: (face.y1 / selectedFrame.height) * 100 + '%',
            left: (face.x1 / selectedFrame.width) * 100 + '%',
            width: ((face.x2 - face.x1) / selectedFrame.width) * 100 + '%',
            height: ((face.y2 - face.y1) / selectedFrame.width) * 100 + '%',
        }
        const badgeStyle = {
            bottom: ((selectedFrame.height - face.y1) / selectedFrame.height) * 100 + '%',
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
            <div className={styles.face} style={faceStyle}></div>
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
        console.log(face);
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

    return (
        <div className={styles.layout}>
            <div className={`${styles.block} ${styles.left}`}>
                <Card title="Summary" subTitle={
                    <div className={styles.cardSubtitle}>
                    <span>Total frames: 100</span>
                    <span>Found persons: 100</span>
                    <span>Processing time: 100</span>
                    <span>Processing time: 100</span>
                    </div>
                }>{isLoading && <Chart />}</Card>
                <Card title="Persons" className={styles.clusterList} style={{'flex': 1}}>
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
