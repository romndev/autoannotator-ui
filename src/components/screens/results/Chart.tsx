
import { useState, useEffect, useRef } from 'react';
import { Chart } from 'primereact/chart';

export default function BasicDemo({clusters}) {
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState(undefined);

    const chartRef = useRef(null)

    const delay = async (ms =0) => new Promise((resolve) => setTimeout(resolve, ms))

    const setData = async (data, options) =>{
        await delay(300);
        setChartData(data);
        setChartOptions(options);
    }

    useEffect(() => {

        console.log(clusters.length);
        const data = {
            labels: clusters.reduce((acc, cur) => [...acc, 'Person '+ cur.cluster_id], []),
            datasets: [
                {
                    label: 'Persons',
                    data: clusters.reduce((acc, cur) => [...acc, cur.faces.length], []),
                    backgroundColor: [
                        'rgba(255, 159, 64, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(153, 102, 255, 0.2)'
                    ],
                    borderColor: [
                        'rgb(255, 159, 64)',
                        'rgb(75, 192, 192)',
                        'rgb(54, 162, 235)',
                        'rgb(153, 102, 255)'
                    ],
                    borderWidth: 1
                }
            ]
        };
        const options = {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        };
        setData(data, options)

    }, [clusters, chartRef]);

    return (
        <>
            {chartData && <Chart type="bar" ref={chartRef} data={chartData} options={chartOptions} />}
        </>
    )
}
