import React, { useEffect, useRef } from "react";
import { Toast } from 'primereact/toast';
import { Card } from 'primereact/card';
import { Image } from 'primereact/image';
import image from '../img/carabinieri_nas_img.jpeg'
import { LinkToDownload } from "../components/linkToDownload";
import { useTranslations } from "../traduttore/const";

function Home() {
    const toast = useRef(null);
    const translations = useTranslations()

    useEffect(() => {

    }, []);

    return (
        <div className='fitBody row mx-0 w-100'>
            <Toast ref={toast} />
            <div className="col-12">
                <Card title="Prediction">
                    <p className="textWhite">
                        {translations.LoremIpsumTitle}
                        {/* L'app "Prediction" del NAS (Nucleo Antisofisticazione e Sanità) dei Carabinieri, un potente strumento per proteggere i tuoi figli online.
                        "Prediction" è il nostro progetto dedicato al controllo parentale, progettato per offrirti tranquillità e sicurezza mentre i tuoi figli esplorano il mondo digitale. */}
                    </p>
                </Card>
            </div>
            <div className="col-12 col-lg-6 my-4">
                <Card>
                    <Image src={image} alt="Image" width="auto" height="auto" className="homeImg" />
                </Card>
            </div>
            <div className="col-12 col-lg-6 my-4">
                <Card title={translations.Introduzione}>
                    <p className="textWhite">
                        {translations.LoremIpsum}
                        {/* La nostra app è stata sviluppata con l'obiettivo di bloccare l'accesso a siti web e contenuti che contengono sostanze psicotrope e precursori, per garantire la sicurezza e la protezione dei tuoi cari.
                        Con "Prediction", puoi creare facilmente profili per i tuoi figli direttamente dall'app mobile o desktop. Dopo aver scaricato l'applicazione sul dispositivo dei tuoi figli e aver effettuato l'accesso con il codice genitore, il blocco automatico si attiverà immediatamente, proteggendoli da siti web pericolosi e contenuti che possono costituire una minaccia per la loro salute e benessere.
                        La nostra app è disponibile sia per dispositivi desktop che per dispositivi mobili, consentendoti di gestire le impostazioni di blocco e monitorare l'attività dei tuoi figli in ogni momento e ovunque tu sia. Con un'interfaccia intuitiva e user-friendly, potrai controllare efficacemente le loro attività online e assicurarti che rimangano al sicuro durante la navigazione.
                        "Prediction" si basa su una blacklist aggiornata costantemente, che include siti web e contenuti noti per il loro coinvolgimento con sostanze psicotrope e precursori. La nostra tecnologia avanzata di blocco garantisce che i tuoi figli non possano accedere a tali siti o visualizzare tali contenuti indesiderati.
                        La sicurezza dei tuoi figli è la nostra massima priorità. Continueremo a lavorare costantemente per migliorare e aggiornare il nostro sistema di blocco, garantendo la massima efficacia nel prevenire l'accesso a siti web e contenuti inappropriati e pericolosi.
                        Unisciti a noi e alla nostra comunità di genitori responsabili che si preoccupano della sicurezza online dei propri figli. Scarica "Prediction" oggi stesso, sia per dispositivi desktop che per dispositivi mobili, e inizia a creare un ambiente digitale sicuro e protetto per i tuoi cari.
                        Siamo qui per te e per garantire la sicurezza dei tuoi figli nell'era digitale.
                        Cordiali saluti,
                        Il Team "Prediction" del NAS (Nucleo Antisofisticazione e Sanità) dei Carabinieri */}
                    </p>
                </Card>
            </div>
            <div className="d-flex justify-content-center w-100">
                <LinkToDownload />
            </div>
        </div>
    );
}

export default Home;
