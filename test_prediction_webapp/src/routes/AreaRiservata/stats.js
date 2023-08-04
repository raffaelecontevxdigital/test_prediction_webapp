import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { InputText } from 'primereact/inputtext';
import { Chart } from 'primereact/chart';
import { APIRequest } from '../../services/axios';
import { onlyUniqueDate } from '../../middleware/utils';

function Stats() {

    const [results, setResults] = useState(null);
    const [percentualiTA, setPercentualiTA] = useState(null);
    const [genitori, setGenitori] = useState(null);
    const [figli, setFigli] = useState(null);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});
    const [chartDataDoughnut, setChartDataDoughnut] = useState({});
    const [chartOptionsDoughnut, setChartOptionsDoughnut] = useState({});
    const [chartDataVerticalBar, setChartDataVerticalBar] = useState({});
    const [chartOptionsVerticalBar, setChartOptionsVerticalBar] = useState({});
    const toast = useRef(null);
    const dt = useRef(null);

    useEffect(() => {
        async function trovaRisultato() {
            let genitori = []
            let figli = []
            let fullGenitori = null
            let fullFigli = null
            let date = []
            let fullArray = []
            let tentativoAccesso = []
            let dateTentativiAccesso = []
            let fullTentativiAccesso = []
            const currentMonth = new Date().getMonth() + 1; // Ottieni il numero del mese corrente (1-12)
            await APIRequest('GET', 'tentativoAccesso/')
                .then(res => {
                    setResults(res.data)
                    let urls = res.data.map(el => el.url)
                    const counts = {};
                    const percentages = [];

                    // Conta le occorrenze di ogni sito
                    urls.forEach(function (site) {
                        if (site in counts) {
                            counts[site]++;
                        } else {
                            counts[site] = 1;
                        }
                    });

                    // Calcola la percentuale per ogni sito
                    const total = urls.length;
                    for (let site in counts) {
                        percentages.push({ url: site, perc: (counts[site] / total) * 100 });
                    }

                    setPercentualiTA(percentages);

                    res.data.forEach(element => {
                        const formattedDate = new Intl.DateTimeFormat('it-IT', { year: "numeric", month: "numeric", day: "numeric" }).format(new Date(element.createAt));

                        // Controlla se la data appartiene al mese corrente
                        const dateComponents = formattedDate.split("/");
                        const month = parseInt(dateComponents[1], 10);

                        if (month === currentMonth) {
                            fullTentativiAccesso.push({ [element.url]: { data: formattedDate } });
                            dateTentativiAccesso.push(formattedDate);
                        }
                    });
                }).catch((e) => {
                    console.log(e)
                })
            await APIRequest('GET', 'genitore/')
                .then(res => {
                    fullGenitori = res.data.length
                    res.data.forEach(element => {
                        const formattedDate = new Intl.DateTimeFormat('it-IT', { year: "numeric", month: "numeric", day: "numeric" }).format(new Date(element.createAt));

                        // Controlla se la data appartiene al mese corrente
                        const dateComponents = formattedDate.split("/");
                        const month = parseInt(dateComponents[1], 10);

                        if (month === currentMonth) {
                            fullArray.push({ genitori: { data: formattedDate } });
                            date.push(formattedDate);
                        }
                    });
                }).catch((e) => {
                    console.log(e)
                })
            await APIRequest('GET', 'figlio/')
                .then(res => {
                    fullFigli = res.data.length
                    res.data.forEach(element => {
                        const formattedDate = new Intl.DateTimeFormat('it-IT', { year: "numeric", month: "numeric", day: "numeric" }).format(new Date(element.createAt));

                        // Controlla se la data appartiene al mese corrente
                        const dateComponents = formattedDate.split("/");
                        const month = parseInt(dateComponents[1], 10);

                        if (month === currentMonth) {
                            fullArray.push({ figli: { data: formattedDate } });
                            date.push(formattedDate);
                        }
                    });
                }).catch((e) => {
                    console.log(e)
                })

            let unique = onlyUniqueDate(date)

            unique = unique.sort((a, b) => {
                const dateAComponents = a.split("/").map(component => parseInt(component, 10));
                const dateBComponents = b.split("/").map(component => parseInt(component, 10));

                const dateA = new Date(dateAComponents[2], dateAComponents[1] - 1, dateAComponents[0]);
                const dateB = new Date(dateBComponents[2], dateBComponents[1] - 1, dateBComponents[0]);

                if (dateA > dateB) {
                    return 1;
                } else if (dateA < dateB) {
                    return -1;
                } else {
                    return 0;
                }
            });

            unique.forEach(element => {
                let filterGenitore = fullArray.filter(el => el.genitori?.data === element)
                if (filterGenitore) {
                    genitori.push(filterGenitore.length)
                }
                let filterFiglio = fullArray.filter(el => el.figli?.data === element)
                if (filterFiglio) {
                    figli.push(filterFiglio.length)
                }
            })

            const documentStyle = getComputedStyle(document.documentElement);
            const textColor = documentStyle.getPropertyValue('--text-color');
            const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
            const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
            const data = {
                labels: unique,
                datasets: [
                    {
                        type: 'bar',
                        label: 'Genitori',
                        backgroundColor: documentStyle.getPropertyValue('--blue-500'),
                        data: genitori
                    },
                    {
                        type: 'bar',
                        label: 'Figli',
                        backgroundColor: documentStyle.getPropertyValue('--green-500'),
                        data: figli
                    }
                ]
            };
            const options = {
                maintainAspectRatio: false,
                aspectRatio: 0.8,
                plugins: {
                    tooltips: {
                        mode: 'index',
                        intersect: false
                    },
                    legend: {
                        labels: {
                            color: textColor
                        }
                    }
                },
                scales: {
                    x: {
                        stacked: true,
                        ticks: {
                            color: textColorSecondary
                        },
                        grid: {
                            color: '#ffffff00'
                        }
                    },
                    y: {
                        stacked: true,
                        ticks: {
                            color: textColorSecondary
                        },
                        grid: {
                            color: surfaceBorder
                        }
                    }
                }
            };

            setChartData(data);
            setChartOptions(options);

            const dataDoughnut = {
                labels: ['Genitori', 'Figli'],
                datasets: [
                    {
                        data: [fullGenitori, fullFigli],
                        backgroundColor: [
                            documentStyle.getPropertyValue('--blue-500'),
                            documentStyle.getPropertyValue('--green-500')
                        ],
                        hoverBackgroundColor: [
                            documentStyle.getPropertyValue('--blue-400'),
                            documentStyle.getPropertyValue('--green-400')
                        ]
                    }
                ]
            };
            const optionsDoughnut = {
                cutout: '60%'
            };

            setChartDataDoughnut(dataDoughnut);
            setChartOptionsDoughnut(optionsDoughnut);

            let uniqueTentativiAccesso = onlyUniqueDate(dateTentativiAccesso)

            uniqueTentativiAccesso = uniqueTentativiAccesso.sort((a, b) => {
                const dateAComponents = a.split("/").map(component => parseInt(component, 10));
                const dateBComponents = b.split("/").map(component => parseInt(component, 10));

                const dateA = new Date(dateAComponents[2], dateAComponents[1] - 1, dateAComponents[0]);
                const dateB = new Date(dateBComponents[2], dateBComponents[1] - 1, dateBComponents[0]);

                if (dateA > dateB) {
                    return 1;
                } else if (dateA < dateB) {
                    return -1;
                } else {
                    return 0;
                }
            });

            uniqueTentativiAccesso.forEach(element => {
                let filterTentativiAccesso = fullTentativiAccesso.filter(el => Object.values(Object.values(el))[0].data === element)
                if (filterTentativiAccesso) {
                    tentativoAccesso.push(filterTentativiAccesso.length)
                }
            })

            const textColorVerticalBar = documentStyle.getPropertyValue('--text-color');
            const textColorSecondaryVerticalBar = documentStyle.getPropertyValue('--text-color-secondary');
            const surfaceBorderVerticalBar = documentStyle.getPropertyValue('--surface-border');
            const dataVerticalBar = {
                labels: uniqueTentativiAccesso,
                datasets: [{
                    label: 'Tentativi accesso',
                    backgroundColor: documentStyle.getPropertyValue('--blue-500'),
                    borderColor: documentStyle.getPropertyValue('--blue-500'),
                    data: tentativoAccesso
                }]
            };

            const optionsVerticalBar = {
                maintainAspectRatio: false,
                aspectRatio: 0.8,
                plugins: {
                    legend: {
                        labels: {
                            fontColor: textColorVerticalBar
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            color: textColorSecondaryVerticalBar,
                            font: {
                                weight: 500
                            }
                        },
                        grid: {
                            display: false,
                            drawBorder: false
                        }
                    },
                    y: {
                        ticks: {
                            color: textColorSecondaryVerticalBar
                        },
                        grid: {
                            color: surfaceBorderVerticalBar,
                            drawBorder: false
                        }
                    }
                }
            };

            setChartDataVerticalBar(dataVerticalBar);
            setChartOptionsVerticalBar(optionsVerticalBar);

            setGenitori(fullGenitori)
            setFigli(fullFigli)

        }
        trovaRisultato();
    }, []);

    const createAtBodyTemplate = (rowData) => {
        return (
            <span>{new Intl.DateTimeFormat('it-IT', { year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric", second: "numeric", hour12: false }).format(new Date(rowData.createAt))}</span>
        )
    };

    const header = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <h4 className="textWhite m-0">Totale tentativi di accesso</h4>
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Cerca..." />
            </span>
        </div>
    );

    return (
        <div className='fitBody'>
            <Toast ref={toast} />

            <div className='row customBorderBottom w-100 mx-0 my-2 py-1'>
                <div className='col-12 col-lg-8'>
                    <div className='d-flex justify-content-center'>
                        <div className="card noBorder w-100">
                            <p className='textWhite text-left'><b>Account genitori e figli nell'ultimo mese</b></p>
                            <Chart type="bar" data={chartData} options={chartOptions} />
                        </div>
                    </div>
                </div>
                <div className='col-12 col-lg-4'>
                    <div className='d-flex justify-content-center'>
                        <div className="card noBorder">
                            <p className='textWhite text-center'><b>Totale account genitori e figli</b></p>
                            <Chart type="doughnut" data={chartDataDoughnut} options={chartOptionsDoughnut} />
                            <div className='d-flex flex-row justify-content-center w-100 mt-4'>
                                <p className='textWhite text-center mr-2'><b>Genitori: </b>{genitori}</p>
                                <p className='textWhite text-center ml-2'><b>Figli: </b>{figli}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='row customBorderBottom w-100 mx-0 py-1'>
                <div className='col-12 col-lg-8'>
                    <div className='d-flex justify-content-center'>
                        <div className="card noBorder w-100">
                            <p className='textWhite text-left'><b>Accesso ai siti non consentiti nell'ultimo mese</b></p>
                            <Chart type="bar" data={chartDataVerticalBar} options={chartOptionsVerticalBar} />
                        </div>
                    </div>
                </div>
                <div className='col-12 col-lg-4'>
                    {percentualiTA &&
                        <>
                            <p className='textWhite'><b>Percentuali visualizzazioni</b></p>
                            <div className='row customBorder statsList p-4 mx-2 h-100'>
                                {percentualiTA.map((el, key) => {
                                    return (
                                        <React.Fragment key={key}>
                                            <div className='col-12 col-lg-6'>
                                                <p className='textWhite'>{el.url}</p>
                                            </div>
                                            <div className='col-12 col-lg-6'>
                                                <p className='textWhite'>{el.perc}%</p>
                                            </div>
                                        </React.Fragment>
                                    )
                                })
                                }
                            </div>
                        </>
                    }
                </div>
                <div className='col-12'>
                    <div className="card noBorder">

                        <DataTable ref={dt} value={results}
                            dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]} sortField="id" sortOrder={-1}
                            emptyMessage='Non ci sono elementi disponibili al momento'
                            exportFilename={`Segnalazioni-${new Intl.DateTimeFormat('it-IT', { year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric", second: "numeric", hour12: false }).format(new Date())}`} csvSeparator=';'
                            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                            currentPageReportTemplate="{totalRecords} elementi" globalFilter={globalFilter} header={header}>

                            <Column field="url" header="Link" sortable ></Column>
                            <Column field="createdAt" header="Data" body={createAtBodyTemplate} sortable ></Column>

                        </DataTable>
                    </div>
                </div>
            </div>




        </div>
    );
}

export default Stats;
