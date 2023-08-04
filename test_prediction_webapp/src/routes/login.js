import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../provider/useAuth";
import { APIRequest } from "../services/axios";
import logo from '../img/logo_carabinieri.png';
import logoBlack from '../img/logo_carabinieri.png';
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import ReCAPTCHA from "react-google-recaptcha";
import { useTranslations } from "../traduttore/const";

export default function Login(props) {
  let emptyResult = {
    operatore: null,
    otp: '',
  };
  const [result, setResult] = useState(emptyResult);
  const [resultsDialog, setResultsDialog] = useState(false);
  const [recaptchaVerified, setRecaptchaVerified] = useState(false);
  let navigate = useNavigate();
  let location = useLocation();
  const translations = useTranslations()
  let auth = useAuth();

  let from = location.state?.from?.pathname || "/segnalazioni";

  useEffect(() => {
    if (props.token) {
      let token = localStorage.getItem('token')
      let role = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).role : ''
      if (token === props.token) {
        let path = role === 'ADMIN' ? '/management' : from
        navigate(path, { replace: true });
      }
    }
  }, [props.token, from, navigate])

  async function handleSubmit(event) {
    event.preventDefault();

    let formData = new FormData(event.currentTarget);
    let credentials = { username: formData.get("username"), password: formData.get("password") };
    await APIRequest('POST', 'auth/', credentials).then(resp => {
      delete resp.data.operatore.otp
      let operatore = resp.data.operatore
      localStorage.setItem('user', JSON.stringify(operatore));
      setResult({ ...result, operatore })
      setResultsDialog(true)
    }).catch((e) => {
      alert(e.response.data);
    })
  }

  async function sendOtp() {
    await APIRequest('POST', 'auth/validateotp', result).then(resp => {
      localStorage.setItem('token', resp.data.token);
      let path = resp.data.operatore.role === 'ADMIN' ? '/management' : from
      let credentials = { username: resp.data.operatore.username };
      auth.signin(credentials, () => {
        // Send them back to the page they tried to visit when they were
        // redirected to the login page. Use { replace: true } so we don't create
        // another entry in the history stack for the login page.  This means that
        // when they get to the protected page and click the back button, they
        // won't end up back on the login page, which is also really nice for the
        // user experience.
        navigate(path, { replace: true });
      });
    }).catch((e) => {
      alert(e.response.data);
    })
  }

  async function resendOtp() {
    await APIRequest('POST', 'auth/rigenerateotp', { mail: result.operatore.mail }).then(resp => {
      alert('Email inviata correttamente');
    }).catch((e) => {
      alert(e.response.data);
    })
  }

  const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || '';
    let _result = { ...result };

    _result[`${name}`] = val;

    setResult(_result);
  };

  const hideDialog = () => {
    setResultsDialog(false);
  };

  async function handleRecaptcha(value) {
    // value is the recaptcha token. If it's null, recaptcha has expired or failed
    if (value !== null) {
      await APIRequest('POST', 'auth/validaterecaptcha', {token: value}).then(resp => {
        setRecaptchaVerified(true);
      }).catch((e) => {
        setRecaptchaVerified(false);
        alert(e.response.data);
      })
    } else {
      setRecaptchaVerified(false);
    }
  }

  const resultDialogFooter = (
    <React.Fragment>
      <Button label={translations.Chiudi} icon="pi pi-times" outlined onClick={hideDialog} />
      <Button label={translations.Invia} icon="pi pi-check" onClick={sendOtp} />
    </React.Fragment>
  );

  return (
    <>
      <div className="d-flex justify-content-start align-items-center mt-2 ml-2">
        <button className="d-flex align-items-center w-auto" type="submit" onClick={() => window.location.pathname = '/'}><i className="pi pi-arrow-left mr-2"></i>{translations.TornaIndietro}</button>
      </div>
      <div className='fitBody d-flex justify-content-center flex-column'>

        <div className="d-flex justify-content-center align-items-center p-3">
          <form onSubmit={handleSubmit}>
            <div className="d-flex flex-column align-items-center border rounded p-5">
              <img src={props.theme === 'light' ? logoBlack : logo} onError={(e) => e.target.src = props.theme === 'light' ? logoBlack : logo} alt="Logo" width="200" />
              <label className="border-top">
                <div className="d-flex flex-column align-items-center p-2">
                  <span className="textWhite mb-2">Username:</span>
                  <input name="username" type="text" />
                </div>
              </label>{" "}
              <label>
                <div className="d-flex flex-column align-items-center p-2">
                  <span className="textWhite mb-2">Password:</span>
                  <input name="password" type="password" />
                </div>
              </label>{" "}
              <button className="mt-2" type="submit">Login</button>
            </div>
          </form>
        </div>
      </div>
      <Dialog visible={resultsDialog} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header={translations.InserireCodiceOTP} modal className="p-fluid" footer={resultDialogFooter} onHide={hideDialog}>
        <div className="card p-4">
          {recaptchaVerified ? (
            <>
              <div className="d-flex justify-content-start">
                <p className="textWhite mb-0">{translations.ÈStatoInviatoUnOtpAllaMail} <b>{result.operatore?.mail}</b></p>
              </div>
              <hr />
              <div className="field mb-0">
                <label htmlFor="otp" className="font-bold">
                  OTP
                  <Button className='p-button-rounded tooltipButton ml-2' type="button" icon="pi pi-info" tooltip={`Inserire il codice otp inviato sulla mail ${result.operatore?.mail}`} tooltipOptions={{ position: 'top', mouseTrack: true, mouseTrackTop: 15 }} />
                </label>
                <InputText id="otp" value={result.otp} onChange={(e) => onInputChange(e, 'otp')} required autoFocus />
                <div className="d-flex justify-content-end">
                  <button className="resetOtpButton mt-2" onClick={resendOtp}>*{translations.NonHoRicevutoLOtp}</button>
                </div>
              </div>
            </>
          ) : (
            <div className="field mb-0">
              <ReCAPTCHA
                sitekey={'6LfFIt4mAAAAAK5mJYS22Iyx7uty0GkuHBSTxH3a'} // replace with your Site key
                onChange={handleRecaptcha}
              />
            </div>
          )
          }
        </div>
      </Dialog>
    </>
  );
}