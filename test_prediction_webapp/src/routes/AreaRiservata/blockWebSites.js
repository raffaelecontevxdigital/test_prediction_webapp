import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { APIRequest } from '../../services/axios';

function BlockWebSites() {
    let emptyResult = {
        nome: '',
        rank: null
    };

    const [results, setResults] = useState(null);
    const [results2, setResults2] = useState(null);
    const [totalRecords, setTotalRecords] = useState(null);
    const [resultsDialog, setResultsDialog] = useState(false);
    const [result, setResult] = useState(emptyResult);
    const [selectedResults, setSelectedResults] = useState(null);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [globalFilter2, setGlobalFilter2] = useState(null);
    const [lazyParams, setLazyParams] = useState({
        first: 0,
        rows: 20,
        page: 0,
        sortField: null,
        sortOrder: null,
        filters: {}
    })
    const toast = useRef(null);
    const dt = useRef(null);

    useEffect(() => {
        async function trovaRisultato() {
            await APIRequest('GET', 'parola/')
                .then(res => {
                    setResults(res.data);
                }).catch((e) => {
                    console.log(e)
                })
            let url = 'timeconsumingop?command=ProcessUrl&controller=WebSemantic&take=' + lazyParams.rows + '&skip=' + lazyParams.page
            await APIRequest('GET', url)
                .then(res => {

                    setResults2(res.data.TCops)
                    setTotalRecords(res.data.totalCount)
                    setLazyParams({ first: lazyParams.first, rows: lazyParams.rows, page: lazyParams.page, pageCount: res.data.totalCount / lazyParams.rows, })

                }).catch((e) => {
                    console.log(e);
                    toast.current.show({ severity: 'error', summary: 'Siamo spiacenti', detail: `Non è stato possibile visualizzare gli ordini da Alyante. Messaggio errore: ${e.response?.data !== undefined ? e.response?.data : e.message}`, life: 3000 });
                })
        }
        trovaRisultato();
    }, [lazyParams.first, lazyParams.page, lazyParams.rows])

    const hideDialog = () => {
        setResultsDialog(false);
    };

    const saveResult = async () => {

        if (selectedResults && selectedResults.length > 0) {
            let body = {
                words: selectedResults.map(el => el.nome)
            }
            await APIRequest('POST', 'webSemantic/', body)
                .then(res => {
                    setResult(emptyResult);
                    toast.current.show({ severity: 'success', summary: "L'elaborazione è stata avviata con successo", detail: "Alla fine dell'esecuzione verrà prodotto un log consultabile nella tabella sottostante", life: 3000 });
                    window.location.reload()
                }).catch((e) => {
                    console.log(e)
                    toast.current.show({ severity: 'error', summary: 'Siamo spiacenti', detail: `L'elaborazione non è stata avviata correttamente. Messaggio errore: ${e.response?.data.detail !== undefined ? e.response?.data.detail : e.message}`, life: 3000 });
                })
        } else {
            toast.current.show({ severity: 'warn', summary: 'Attenzione!', detail: `È obbligatorio selezionare almeno una parola dalla lista per avviare l'elaborazione`, life: 3000 });
        }

    };

    const exportCSV = () => {
        dt.current.exportCSV();
    };


    const rightToolbarTemplate = () => {
        return <Button label="Esporta" icon="pi pi-upload" className="p-button-help p-2 w-100" onClick={exportCSV} />;
    };

    const dateBodyTemplate = (rowData) => {
        return (
            <span>{new Intl.DateTimeFormat('it-IT', { year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric", second: "numeric", hour12: false }).format(new Date(rowData.date))}</span>
        )
    };

    const onRowSelect = (result) => {
        result.data.status.forEach((element, key) => {
            element.id = key
        })
        setResult(result)
        setResultsDialog(true)
    }

    const onPage = async (event) => {

        var url = 'timeconsumingop?command=ProcessUrl&controller=WebSemantic&take=' + event.rows + '&skip=' + event.page;
        await APIRequest("GET", url)
            .then((res) => {

                setResults2(res.data.TCops)
                setTotalRecords(res.data.totalCount)
                setLazyParams(event)

            })
            .catch((e) => {
                console.log(e);
                toast.current.show({
                    severity: "error",
                    summary: "Siamo spiacenti",
                    detail: `Non è stato possibile visualizzare la lista dei Log. Messaggio errore: ${e.response?.data !== undefined ? e.response?.data : e.message}`,
                    life: 3000,
                });
            });

    }
    const onSort = async (event) => {

        var url = 'timeconsumingop?command=ProcessUrl&controller=WebSemantic&take=' + lazyParams.rows + '&skip=' + lazyParams.page + '&field=' + event.sortField + '&sorting=' + (event.sortOrder === 1 ? 'ASC' : 'DESC');
        await APIRequest("GET", url)
            .then((res) => {

                setResults2(res.data.TCops)
                setTotalRecords(res.data.totalCount)
                setLazyParams({ ...lazyParams, sortField: event.sortField, sortOrder: event.sortOrder })

            })
            .catch((e) => {
                console.log(e);
                toast.current.show({
                    severity: "error",
                    summary: "Siamo spiacenti",
                    detail: `Non è stato possibile visualizzare la lista dei Log. Messaggio errore: ${e.response?.data !== undefined ? e.response?.data : e.message}`,
                    life: 3000,
                });
            });

    }

    const onFilter = (event) => {
        event['first'] = 0;
        setLazyParams(event)
    }

    const header = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <h4 className="textWhite m-0">Parole bloccate</h4>
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Cerca..." />
            </span>
        </div>
    );
    const header2 = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <h4 className="textWhite m-0">Log delle operazioni</h4>
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter2(e.target.value)} placeholder="Cerca..." />
            </span>
        </div>
    );
    const resultDialogFooter = (
        <React.Fragment>
            <Button label="Chiudi" icon="pi pi-times" outlined onClick={hideDialog} />
        </React.Fragment>
    );

    return (
        <div className='fitBody'>
            <Toast ref={toast} />
            <div className="card">

                <DataTable ref={dt} value={results} selection={selectedResults} onSelectionChange={(e) => setSelectedResults(e.value)}
                    dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]} sortField="id" sortOrder={-1}
                    emptyMessage='Non ci sono elementi disponibili al momento'
                    exportFilename={`Segnalazioni-${new Intl.DateTimeFormat('it-IT', { year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric", second: "numeric", hour12: false }).format(new Date())}`} csvSeparator=';'
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="{totalRecords} elementi" globalFilter={globalFilter} header={header}>

                    <Column selectionMode="multiple" exportable={false}></Column>
                    <Column field="nome" header="Parola" sortable ></Column>
                    <Column field="rank" header="Rank" sortable ></Column>

                </DataTable>
                <div className='d-flex justify-content-center align-items-center my-4'>
                    <Button label="Avvia elaborazione" icon="pi pi-play" className='w-auto' outlined onClick={saveResult} />
                </div>

                <Toolbar className="mb-4" end={rightToolbarTemplate}></Toolbar>

                <DataTable ref={dt} value={results2}
                    dataKey="id"
                    emptyMessage='Non ci sono elementi disponibili al momento'
                    exportFilename={`LogOperazioni-${new Intl.DateTimeFormat('it-IT', { year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric", second: "numeric", hour12: false }).format(new Date())}`} csvSeparator=';'
                    paginator rowsPerPageOptions={[5, 10, 25]}
                    onPage={onPage}
                    onRowSelect={onRowSelect}
                    onSort={onSort}
                    onFilter={onFilter}
                    first={lazyParams.first}
                    totalRecords={totalRecords}
                    rows={lazyParams.rows}
                    selectionMode="single"
                    sortField={lazyParams.sortField}
                    sortOrder={lazyParams.sortOrder}

                    filters={lazyParams.filters}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="{totalRecords} elementi" globalFilter={globalFilter2} header={header2}>

                    <Column field="date" header="Data" body={dateBodyTemplate} sortable ></Column>

                </DataTable>
            </div>

            <Dialog visible={resultsDialog} style={{ maxWidth: '70rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header={'Dettaglio'} modal className="p-fluid" footer={resultDialogFooter} onHide={hideDialog}>
                <DataTable
                    ref={dt}
                    dataKey="id"
                    value={result?.data?.status}
                >

                    <Column field="id" header="ID" sortable ></Column>
                    <Column field="name" header="nome" sortable ></Column>
                    <Column field="status" header="Stato" sortable ></Column>
                    <Column field="message" header="Messaggio" sortable ></Column>

                </DataTable>
            </Dialog>
        </div>
    );
}

export default BlockWebSites;
