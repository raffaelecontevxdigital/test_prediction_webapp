import React, { useState, useEffect, useRef } from 'react';
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { APIRequest } from '../../services/axios';

export function Management() {
    let emptyResult = {
        username: '',
        password: '',
        role: '',
        mail: ''
    };

    const [results, setResults] = useState(null);
    const [resultsDialog, setResultsDialog] = useState(false);
    const [deleteResultDialog, setDeleteResultDialog] = useState(false);
    const [deleteResultsDialog, setDeleteResultsDialog] = useState(false);
    const [result, setResult] = useState(emptyResult);
    const [selectedResults, setSelectedResults] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);

    useEffect(() => {
        async function trovaRisultato() {
            await APIRequest('GET', 'operatore/')
                .then(res => {
                    setResults(res.data);
                }).catch((e) => {
                    console.log(e)
                })
        }
        trovaRisultato();
    }, []);

    const openNew = () => {
        setResult(emptyResult);
        setSubmitted(false);
        setResultsDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setResultsDialog(false);
    };

    const hideDeleteResultDialog = () => {
        setDeleteResultDialog(false);
    };

    const hideDeleteResultsDialog = () => {
        setDeleteResultsDialog(false);
    };

    const saveResult = async () => {
        setSubmitted(true);
        let _results = [...results];
        if (!result.id) {
            result.role = 'OPERATORE'
            await APIRequest('POST', 'operatore/', result)
                .then(res => {
                    _results.push(res.data);
                    setResults(_results);
                    setResultsDialog(false);
                    setResult(emptyResult);
                    toast.current.show({ severity: 'success', summary: 'Ottimo', detail: "L'utente è stato inserito con successo", life: 3000 });
                }).catch((e) => {
                    console.log(e)
                    toast.current.show({ severity: 'error', summary: 'Siamo spiacenti', detail: `Non è stato possibile aggiungere l'elemento. Messaggio errore: ${e.response?.data.detail !== undefined ? e.response?.data.detail : e.message}`, life: 3000 });
                })
        } else {
            await APIRequest('PUT', `operatore/?id=${result.id}`, result)
                .then(res => {
                    let find = _results.findIndex(el => el.id === res.data.id)
                    if (find !== -1) {
                        _results[find] = res.data
                    }
                    setResults(_results);
                    setResultsDialog(false);
                    setResult(emptyResult);
                    toast.current.show({ severity: 'success', summary: 'Ottimo', detail: "L'utente è stato modificato con successo", life: 3000 });
                }).catch((e) => {
                    console.log(e)
                    toast.current.show({ severity: 'error', summary: 'Siamo spiacenti', detail: `Non è stato possibile aggiungere l'elemento. Messaggio errore: ${e.response?.data.detail !== undefined ? e.response?.data.detail : e.message}`, life: 3000 });
                })
        }
    };

    const editResult = (result) => {
        result.password = ''
        setResult({ ...result });
        setResultsDialog(true);
    };

    const confirmDeleteResult = (result) => {
        setResult(result);
        setDeleteResultDialog(true);
    };

    const deleteResult = async () => {
        await APIRequest('DELETE', `operatore/?id=${result.id}`)
            .then(res => {
                let _results = results.filter((val) => val.id !== result.id);

                setResults(_results);
                setDeleteResultDialog(false);
                setResult(emptyResult);
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Elemento eliminato correttamente', life: 3000 });
            }).catch((e) => {
                console.log(e)
                toast.current.show({ severity: 'error', summary: 'Siamo spiacenti', detail: `Non è stato possibile eliminare l'elemento. Messaggio errore: ${e.response?.data.detail !== undefined ? e.response?.data.detail : e.message}`, life: 3000 });
            })
    };

    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const confirmDeleteSelected = () => {
        setDeleteResultsDialog(true);
    };

    const deleteSelectedResults = async () => {
        await APIRequest('DELETE', `operatore/?id=${selectedResults.map(el => el.id)}`)
            .then(res => {
                let _results = results.filter((val) => !selectedResults.includes(val));
                setResults(_results);
                setDeleteResultsDialog(false);
                setSelectedResults(null);
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Elementi eliminati correttamente', life: 3000 });
            }).catch((e) => {
                console.log(e)
                toast.current.show({ severity: 'error', summary: 'Siamo spiacenti', detail: `Non è stato possibile eliminare gli elementi. Messaggio errore: ${e.response?.data.detail !== undefined ? e.response?.data.detail : e.message}`, life: 3000 });
            })
    };

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _result = { ...result };

        _result[`${name}`] = val;

        setResult(_result);
    };

    const leftToolbarTemplate = () => {
        return (
            <div className="d-flex flex-wrap gap-2">
                <Button className="p-2" label="Nuovo" icon="pi pi-plus" severity="success" onClick={openNew} />
                <Button className="p-2" label="Elimina" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedResults || !selectedResults.length} />
            </div>
        );
    };

    const rightToolbarTemplate = () => {
        return <Button label="Esporta" icon="pi pi-upload" className="p-button-help p-2 w-100" onClick={exportCSV} />;
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" rounded outlined className="actionColumnButton mr-2" onClick={() => editResult(rowData)} />
                <Button icon="pi pi-trash" rounded outlined className="actionColumnButton mr-2" severity="danger" onClick={() => confirmDeleteResult(rowData)} />
            </React.Fragment>
        );
    };

    const header = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <h4 className="textWhite m-0">Gestione operatori</h4>
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
    const deleteProductDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteResultDialog} />
            <Button label="Si" icon="pi pi-check" severity="danger" onClick={deleteResult} />
        </React.Fragment>
    );
    const deleteProductsDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteResultsDialog} />
            <Button label="Si" icon="pi pi-check" severity="danger" onClick={deleteSelectedResults} />
        </React.Fragment>
    );

    return (
        <div>
            <Toast ref={toast} />
            <div className="card">
                <Toolbar className="mb-4" start={leftToolbarTemplate} end={rightToolbarTemplate}></Toolbar>

                <DataTable ref={dt} value={results} selection={selectedResults} onSelectionChange={(e) => setSelectedResults(e.value)}
                    dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]} sortField="id" sortOrder={-1}
                    emptyMessage='Non ci sono elementi disponibili al momento'
                    exportFilename={`Operatori-${new Intl.DateTimeFormat('it-IT', { year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric", second: "numeric", hour12: false }).format(new Date())}`} csvSeparator=';'
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="{totalRecords} elementi" globalFilter={globalFilter} header={header}>

                    <Column selectionMode="multiple" exportable={false}></Column>
                    <Column field="id" header="Codice" sortable ></Column>
                    <Column field="username" header="Nome utente" sortable ></Column>
                    <Column field="role" header="Ruolo" sortable ></Column>
                    <Column body={actionBodyTemplate} exportable={false} ></Column>

                </DataTable>
            </div>

            <Dialog visible={resultsDialog} style={{ width: '50rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header={result.id ? 'Modifica' : 'Crea'} modal className="p-fluid" footer={resultDialogFooter} onHide={hideDialog}>
                <>
                    <div className="field">
                        <label htmlFor="email" className="font-bold">
                            Email
                            <Button className='p-button-rounded tooltipButton ml-2' type="button" icon="pi pi-info" tooltip="Nome utente per accedere alla piattaforma" tooltipOptions={{ position: 'top', mouseTrack: true, mouseTrackTop: 15 }} />
                        </label>
                        <InputText id="email" value={result.mail} onChange={(e) => onInputChange(e, 'mail')} required autoFocus className={classNames({ 'p-invalid': submitted && !result.mail })} />
                        {submitted && !result.mail && <small className="p-error">L'email è obbligatoria.</small>}
                    </div>
                    <div className="field">
                        <label htmlFor="username" className="font-bold">
                            Nome utente
                            <Button className='p-button-rounded tooltipButton ml-2' type="button" icon="pi pi-info" tooltip="Nome utente per accedere alla piattaforma" tooltipOptions={{ position: 'top', mouseTrack: true, mouseTrackTop: 15 }} />
                        </label>
                        <InputText id="username" value={result.username} onChange={(e) => onInputChange(e, 'username')} required autoFocus className={classNames({ 'p-invalid': submitted && !result.username })} />
                        {submitted && !result.username && <small className="p-error">Il nome utente è obbligatorio.</small>}
                    </div>
                    <div className="field">
                        <label htmlFor="password" className="font-bold">
                            Password
                            <Button className='p-button-rounded tooltipButton ml-2' type="button" icon="pi pi-info" tooltip="Password per accedere alla piattaforma" tooltipOptions={{ position: 'top', mouseTrack: true, mouseTrackTop: 15 }} />
                        </label>
                        <Password id="password" value={result.password} onChange={(e) => onInputChange(e, 'password')} toggleMask required autoFocus className={classNames({ 'p-invalid': submitted && !result.password })} />
                        {submitted && !result.password && <small className="p-error">La password è obbligatoria.</small>}
                    </div>
                </>
            </Dialog>

            <Dialog visible={deleteResultDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Conferma" modal footer={deleteProductDialogFooter} onHide={hideDeleteResultDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {result && (
                        <span>
                            Vuoi davvero eliminare <b>{result.username}</b>?
                        </span>
                    )}
                </div>
            </Dialog>

            <Dialog visible={deleteResultsDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Conferma" modal footer={deleteProductsDialogFooter} onHide={hideDeleteResultsDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {result && <span>Vuoi davvero eliminare gli elementi selezionati?</span>}
                </div>
            </Dialog>
        </div>
    );
}