/*
*
* Winet e-procurement GUI
* 2020 - Viniexport.com (C)
*
* Traduzione - Variabili per la traduzione 
*
*/

import { useTranslation } from "react-i18next";

/* import React from 'react';
import { Translation } from "react-i18next"; */

export function useTranslations() {
    const { t } = useTranslation();

    return {
        //Generale
        Introduzione: t('Generale.Introduzione'),
        Chiudi: t('Generale.Chiudi'),
        Invia: t('Generale.Invia'),


        //Specifico
        LoremIpsumTitle: t('Specifico.LoremIpsumTitle'),
        LoremIpsum: t('Specifico.LoremIpsum'),
        AreaRiservata: t('Specifico.AreaRiservata'),
        AccediAllaPiattaformaInserendoLeTueCredenziali: t('Specifico.AccediAllaPiattaformaInserendoLeTueCredenziali'),
        TornaIndietro: t('Specifico.TornaIndietro'),
        ÈStatoInviatoUnOtpAllaMail: t('Specifico.ÈStatoInviatoUnOtpAllaMail'),
        NonHoRicevutoLOtp: t('Specifico.NonHoRicevutoLOtp'),
        InserireCodiceOTP: t('Specifico.InserireCodiceOTP')
        // aggiungi qui altre traduzioni...
    };
}