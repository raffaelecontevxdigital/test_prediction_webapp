import React, { useState, useEffect, useRef } from 'react';
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { APIRequest } from '../../services/axios';
import { Dropdown } from 'primereact/dropdown';

function BlockedWebSite() {
    let emptyResult = {
        url: '',
        status: '',
        createdAt: null,
    };

    const [results, setResults] = useState(null);
    const [resultsDialog, setResultsDialog] = useState(false);
    const [deleteResultDialog, setDeleteResultDialog] = useState(false);
    const [deleteResultsDialog, setDeleteResultsDialog] = useState(false);
    const [result, setResult] = useState(emptyResult);
    const [selectedResults, setSelectedResults] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState(null);
    const stati = [{ name: 'Whitelist', value: false }, { name: 'Blacklist', value: true }];
    const toast = useRef(null);
    const dt = useRef(null);

    useEffect(() => {
        async function trovaRisultato() {
            await APIRequest('GET', 'siteList/')
                .then(res => {
                    setResults(res.data);
                }).catch((e) => {
                    console.log(e)
                })
        }
        trovaRisultato();
    }, [])

    const openNew = () => {
        setResult(emptyResult);
        setSubmitted(false);
        setResultsDialog(true);
    };

    const onChangeHandler = (e) => {
        result.status = e.value
        setSelectedStatus(e.value)
    }

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
        if (!validateUrl(result.url)) {
            toast.current.show({ severity: 'error', summary: 'Siamo spiacenti', detail: 'URL non valido, per favore, inserisci un URL senza "www" o "https://"', life: 3000 });
            return;
        }
        if (!result.id) {
            await APIRequest('POST', 'siteList/', result)
                .then(res => {
                    _results.push(res.data);
                    setResults(_results);
                    setResultsDialog(false);
                    setResult(emptyResult);
                    setSelectedStatus(null)
                    toast.current.show({ severity: 'success', summary: 'Ottimo', detail: "Il sito è stato inserito nella lista di blocco", life: 3000 });
                }).catch((e) => {
                    setSelectedStatus(null)
                    console.log(e)
                    toast.current.show({ severity: 'error', summary: 'Siamo spiacenti', detail: `Non è stato possibile aggiungere l'elemento alla lista di blocco. Messaggio errore: ${e.response?.data.detail !== undefined ? e.response?.data.detail : e.message}`, life: 3000 });
                })
        } else {
            await APIRequest('PUT', `siteList/?id=${result.id}`, result)
                .then(res => {
                    let find = _results.findIndex(el => el.id === res.data.id)
                    if (find !== -1) {
                        _results[find] = res.data
                    }
                    setResults(_results);
                    setResultsDialog(false);
                    setResult(emptyResult);
                    setSelectedStatus(null)
                    toast.current.show({ severity: 'success', summary: 'Ottimo', detail: "Il sito è stato modificato con successo", life: 3000 });
                }).catch((e) => {
                    setSelectedStatus(null)
                    console.log(e)
                    toast.current.show({ severity: 'error', summary: 'Siamo spiacenti', detail: `Non è stato possibile modificare l'elemento. Messaggio errore: ${e.response?.data.detail !== undefined ? e.response?.data.detail : e.message}`, life: 3000 });
                })
        }
    };

    const editResult = (result) => {
        let find = stati.find(el => el.value === result.status)
        setSelectedStatus(find.value)
        setResult({ ...result });
        setResultsDialog(true);
    };

    const confirmDeleteResult = (result) => {
        setResult(result);
        setDeleteResultDialog(true);
    };

    const deleteResult = async () => {
        await APIRequest('DELETE', `siteList/?id=${result.id}`)
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
        await APIRequest('DELETE', `siteList/?id=${selectedResults.map(el => el.id)}`)
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

    const sync = async () => {
        await APIRequest('GET', 'siteList/sync')
            .then(res => {
                console.log(res)
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Sincronizzazione avviata correttamente', life: 3000 });
            }).catch((e) => {
                console.log(e)
                toast.current.show({ severity: 'error', summary: 'Siamo spiacenti', detail: `Non è stato possibile avviare la sincronizzazione. Messaggio errore: ${e.response?.data.detail !== undefined ? e.response?.data.detail : e.message}`, life: 3000 });
            })
    }

    const validateUrl = (url) => {
        // Regular expression to match simple URLs without www or http://
        const regex = new RegExp(/^(?!www\.)([A-Za-z0-9-]+\.)*[A-Za-z0-9-]+\.[A-Za-z]{2,4}$/);
    
        // Test the URL against the regex
        return regex.test(url);
    }

    const leftToolbarTemplate = () => {
        return (
            <div className="d-flex flex-wrap gap-2">
                <Button className="p-2" label="Nuovo" icon="pi pi-plus" severity="success" onClick={openNew} />
                <Button className="p-2" label="Elimina" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedResults || !selectedResults.length} />
            </div>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <div className="d-flex flex-row gap-2">
                <Button label="Sincronizza" icon="pi pi-sync" className="p-2 w-100 pr-4" onClick={sync} />
                <Button label="Esporta" icon="pi pi-upload" className="p-2 w-100" onClick={exportCSV} />
            </div>
        );
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" rounded outlined className="actionColumnButton mr-2" onClick={() => editResult(rowData)} />
                <Button icon="pi pi-trash" rounded outlined className="actionColumnButton mr-2" severity="danger" onClick={() => confirmDeleteResult(rowData)} />
            </React.Fragment>
        );
    };

    const createdAtBodyTemplate = (rowData) => {
        return (
            <span>{new Intl.DateTimeFormat('it-IT', { year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric", second: "numeric", hour12: false }).format(new Date(rowData.createAt))}</span>
        )
    };

    const statusBodyTemplate = (rowData) => {
        return (
            <span>{rowData.status === true ? 'Blacklist' : 'Whitelist'}</span>
        )
    }

    const header = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <h4 className="textWhite m-0">Gestione siti bloccati</h4>
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
        <div className='fitBody'>
            <Toast ref={toast} />
            <div className="card">
                <Toolbar className="mb-4" start={leftToolbarTemplate} end={rightToolbarTemplate}></Toolbar>

                <DataTable ref={dt} value={results} selection={selectedResults} onSelectionChange={(e) => setSelectedResults(e.value)}
                    dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]} sortField="id" sortOrder={-1}
                    emptyMessage='Non ci sono elementi disponibili al momento'
                    exportFilename={`Segnalazioni-${new Intl.DateTimeFormat('it-IT', { year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric", second: "numeric", hour12: false }).format(new Date())}`} csvSeparator=';'
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="{totalRecords} elementi" globalFilter={globalFilter} header={header}>

                    <Column selectionMode="multiple" exportable={false}></Column>
                    <Column field="url" header="Link" sortable ></Column>
                    <Column field="status" header="Stato" body={statusBodyTemplate} sortable ></Column>
                    <Column field="createAt" header="Data" body={createdAtBodyTemplate} sortable ></Column>
                    <Column body={actionBodyTemplate} exportable={false} ></Column>

                </DataTable>
            </div>

            <Dialog visible={resultsDialog} style={{ width: '50rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header={result.id ? 'Modifica' : 'Crea'} modal className="p-fluid" footer={resultDialogFooter} onHide={hideDialog}>
                <div className="field">
                    <label htmlFor="url" className="font-bold">
                        Link
                        <Button className='p-button-rounded tooltipButton ml-2' type="button" icon="pi pi-info" tooltip="Recapito/i url per il cliente" tooltipOptions={{ position: 'top', mouseTrack: true, mouseTrackTop: 15 }} />
                    </label>
                    <InputText
                        id="url"
                        value={result.url}
                        onChange={(e) => onInputChange(e, 'url')}
                        required
                        autoFocus
                        className={classNames({ 'p-invalid': submitted && !result.url && !validateUrl(result.url) })}
                    />
                    {submitted && !result.url && !validateUrl(result.url) &&
                        <small className="p-error">Per favore, inserisci un URL valido senza "www" o "https://".</small>}
                    {/* <InputText id="url" value={result.url} onChange={(e) => onInputChange(e, 'url')} required autoFocus className={classNames({ 'p-invalid': submitted && !result.url })} />
                    {submitted && !result.url && <small className="p-error">L'url è obbligatorio.</small>} */}
                </div>
                <div className="field">
                    <label htmlFor="status" className="font-bold">
                        Stato
                        <Button className='p-button-rounded tooltipButton ml-2' type="button" icon="pi pi-info" tooltip="Stato segnalazione" tooltipOptions={{ position: 'top', mouseTrack: true, mouseTrackTop: 15 }} />
                    </label>
                    <Dropdown id="status" value={selectedStatus} onChange={(e) => onChangeHandler(e)} options={stati} optionLabel="name"
                        showClear placeholder="Seleziona stato" />
                </div>
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

export default BlockedWebSite;
