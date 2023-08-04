import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { APIRequest } from '../../services/axios';

function SegnalazioneGuasti() {
    let emptyResult = {
        descrizione: '',
        status: '',
        data: '',
        notaOperatore: '',
        idOperatoreUpdater: null
    };

    const [results, setResults] = useState(null);
    const [resultsDialog, setResultsDialog] = useState(false);
    const [result, setResult] = useState(emptyResult);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState(null);
    const stati = [{ name: 'Creata', value: 'CREATA' }, { name: 'Controllo', value: 'CONTROLLO' }, { name: 'Terminata', value: 'TERMINATA' }, { name: 'Annullata', value: 'ANNULLATA' }];
    const toast = useRef(null);
    const dt = useRef(null);

    useEffect(() => {
        async function trovaRisultato() {
            await APIRequest('GET', 'guasto/')
                .then(res => {
                    setResults(res.data);
                }).catch((e) => {
                    console.log(e)
                })
        }
        trovaRisultato();
    }, [])

    const hideDialog = () => {
        setResultsDialog(false);
    };

    const saveResult = async () => {
        let _results = [...results];
        result.idOperatoreUpdater = JSON.parse(localStorage.getItem('user')).id
        await APIRequest('PUT', `guasto/?id=${result.id}`, result)
            .then(res => {
                let find = _results.findIndex(el => el.id === res.data.id)
                if (find !== -1) {
                    _results[find] = res.data
                }
                setResults(_results);
                setResultsDialog(false);
                setResult(emptyResult);
                toast.current.show({ severity: 'success', summary: 'Ottimo', detail: "La segnalazione è stata modificata con successo", life: 3000 });
            }).catch((e) => {
                console.log(e)
                toast.current.show({ severity: 'error', summary: 'Siamo spiacenti', detail: `Non è stato possibile modificare la segnalazione. Messaggio errore: ${e.response?.data.detail !== undefined ? e.response?.data.detail : e.message}`, life: 3000 });
            })
    };

    const editResult = (result) => {
        let status = stati.find(el => el.value === result.status)
        setSelectedStatus(status.value)
        setResult({ ...result });
        setResultsDialog(true);
    };

    const onChangeHandler = (e) => {
        result.status = e.value
        setSelectedStatus(e.value)
    }

    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _result = { ...result };

        _result[`${name}`] = val;

        setResult(_result);
    };

    const dataBodyTemplate = (rowData) => {
        return (
            <span>{new Intl.DateTimeFormat('it-IT', { year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric", second: "numeric", hour12: false }).format(new Date(rowData.data))}</span>
        )
    };

    const rightToolbarTemplate = () => {
        return <Button label="Esporta" icon="pi pi-upload" className="p-button-help p-2 w-100" onClick={exportCSV} />;
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" rounded outlined className="actionColumnButton mr-2" onClick={() => editResult(rowData)} />
            </React.Fragment>
        );
    };

    const header = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <h4 className="textWhite m-0">Gestione guasti</h4>
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Cerca..." />
            </span>
        </div>
    );
    const resultDialogFooter = (
        <React.Fragment>
            <Button label="Elimina" icon="pi pi-times" outlined onClick={hideDialog} />
            <Button label="Salva" icon="pi pi-check" onClick={saveResult} />
        </React.Fragment>
    );

    return (
        <div className='fitBody'>
            <Toast ref={toast} />
            <div className="card">
                <Toolbar className="mb-4" end={rightToolbarTemplate}></Toolbar>

                <DataTable ref={dt} value={results}
                    dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]} sortField="id" sortOrder={-1}
                    emptyMessage='Non ci sono elementi disponibili al momento'
                    exportFilename={`Guasti-${new Intl.DateTimeFormat('it-IT', { year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric", second: "numeric", hour12: false }).format(new Date())}`} csvSeparator=';'
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="{totalRecords} elementi" globalFilter={globalFilter} header={header}>

                    <Column field="descrizione" header="Descrizione" sortable ></Column>
                    <Column field="status" header="Stato" sortable ></Column>
                    <Column field="data" header="Data" body={dataBodyTemplate} sortable ></Column>
                    <Column field="notaOperatore" header="Nota operatore" sortable ></Column>
                    <Column body={actionBodyTemplate} exportable={false} ></Column>

                </DataTable>
            </div>

            <Dialog visible={resultsDialog} style={{ width: '50rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header={result.id ? 'Modifica' : 'Crea'} modal className="p-fluid" footer={resultDialogFooter} onHide={hideDialog}>
                <div className="field">
                    <label htmlFor="status" className="font-bold">
                        Stato
                        <Button className='p-button-rounded tooltipButton ml-2' type="button" icon="pi pi-info" tooltip="Stato segnalazione" tooltipOptions={{ position: 'top', mouseTrack: true, mouseTrackTop: 15 }} />
                    </label>
                    <Dropdown id="status" value={selectedStatus} onChange={(e) => onChangeHandler(e)} options={stati} optionLabel="name"
                        showClear placeholder="Seleziona stato" />
                </div>
                <div className="field">
                    <label htmlFor="notaOperatore" className="font-bold">
                        Nota operatore
                        <Button className='p-button-rounded tooltipButton ml-2' type="button" icon="pi pi-info" tooltip="È possibile inserire delle ulteriori informazioni sulla corporate come notaOperatore" tooltipOptions={{ position: 'top', mouseTrack: true, mouseTrackTop: 15 }} />
                    </label>
                    <InputTextarea autoResize id="notaOperatore" value={result.notaOperatore || ''} onChange={(e) => onInputChange(e, 'notaOperatore')} rows={3} cols={20} />
                </div>
            </Dialog>
        </div>
    );
}

export default SegnalazioneGuasti;
