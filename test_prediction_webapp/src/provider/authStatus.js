
import React, { useState } from "react";
import { useAuth } from "./useAuth";
import { InputSwitch } from 'primereact/inputswitch';
import { Link, useNavigate } from "react-router-dom";
import { Traduttore } from "../traduttore/traduttore";
import logo from '../img/logo_carabinieri.png';
import logoBlack from '../img/logo_carabinieri.png';
import { useTranslations } from "../traduttore/const";

export function AuthStatus(props) {
  const [checked, setChecked] = useState(props.theme === 'light' ? false : true);
  let auth = useAuth();
  let navigate = useNavigate();
  const translations = useTranslations()

  const switchTheme = () => {
    const newTheme = props.theme === 'light' ? 'dark' : 'light'
    props.setTheme(newTheme)
    setChecked(!checked)
  }

  return (
    <div className="row customBorderBottom">
      {window.location.pathname === '/login' ? (
        <div className="col-12">
          <p className="textWhite mb-0">{translations.AccediAllaPiattaformaInserendoLeTueCredenziali}</p>
        </div>
      ) : (window.location.pathname === '/' ? (
        <>
          <div className="col-12 col-md-3 d-flex justify-content-center align-items-center p-0 customBorderRight">
            <Link to={"/"}><img src={props.theme === 'light' ? logoBlack : logo} onError={(e) => e.target.src = props.theme === 'light' ? logoBlack : logo} alt="Logo" width="80" /></Link>
          </div>
          <div className="col-12 col-md-5 customBorderRight d-flex justify-content-center align-items-center">
            <ul className="d-flex justify-content-center align-items-center flex-row p-2 mb-0">
              <li className="p-3">
                <Link to="/">Home</Link>
              </li>
            </ul>
          </div>
          <div className="col-12 col-md-4 d-flex justify-content-around align-items-center p-2 customBorderLeft">
            <div className="d-flex flex-row align-items-center w-100">
              <div className="row w-100 m-0">
                <div className="col-4 d-flex flex-row align-items-center justify-content-center">
                  <i className="pi pi-sun textWhite mr-2"></i><InputSwitch checked={checked} onChange={switchTheme} /><i className="pi pi-moon textWhite ml-2"></i>
                </div>
                <div className="loginBox col-4">
                      <Traduttore />
                    </div>
                <div className="col-4 d-flex flex-row align-items-center justify-content-center">
                  <p className="textWhite username mb-0 mr-2">
                    <Link to={"/login"}>{translations.AreaRiservata}</Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          {window.location.pathname === '/management' ? (
            <>
              <div className="col-12 col-md-3 d-flex justify-content-center align-items-center p-0 customBorderRight">
                <Link to={"/management"}><img src={props.theme === 'light' ? logoBlack : logo} onError={(e) => e.target.src = props.theme === 'light' ? logoBlack : logo} alt="Logo" width="80" /></Link>
              </div>
              <div className="col-12 col-md-5 customBorderRight d-flex justify-content-center align-items-center">
                <ul className="d-flex justify-content-center align-items-center flex-row p-2 mb-0">
                  <li className="p-3">
                    <Link to="/management">Amministrazione</Link>
                  </li>
                </ul>
              </div>
            </>
          ) : (
            <>
              <div className="col-12 col-lg-3 d-flex justify-content-center align-items-center p-0 customBorderRight">
                <Link to={"/segnalazioni"}><img src={props.theme === 'light' ? logoBlack : logo} onError={(e) => e.target.src = props.theme === 'light' ? logoBlack : logo} alt="Logo" width="80" /></Link>
              </div>
              <div className="col-12 col-lg-5 customBorderRight d-flex justify-content-center align-items-center">
                <ul className="d-flex justify-content-center align-items-center flex-row p-2 mb-0">
                  <li className="p-3">
                    <Link to="/segnalazioni">Segnalazioni</Link>
                  </li>
                  <li className="p-3">
                    <Link to="/guasti">Guasti</Link>
                  </li>
                  <li className="p-3">
                    <Link to="/siteList">Siti bloccati</Link>
                  </li>
                  <li className="p-3">
                    <Link to="/bloccoparole">Parole bloccate</Link>
                  </li>
                  <li className="p-3">
                    <Link to="/stats">Statistiche</Link>
                  </li>
                </ul>
              </div>
            </>
          )
          }
          <div className="col-12 col-lg-4 d-flex justify-content-around align-items-center p-2 customBorderLeft">
            <div className="d-flex flex-row align-items-center w-100">
              <div className="row w-100 m-0">
                <div className="col-4">
                  <p className="textWhite username mb-0 mr-2">
                    {auth.user ||(localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user'))?.username : '')}
                  </p>
                  {/* <Avatar icon="pi pi-user" style={{ backgroundColor: '#363636', color: '#ffffff' }} shape="circle" /> */}
                </div>
                <div className="col-4 d-flex flex-row align-items-center justify-content-center">
                  <i className="pi pi-sun textWhite mr-2"></i><InputSwitch checked={checked} onChange={switchTheme} /><i className="pi pi-moon textWhite ml-2"></i>
                </div>
                <div className="col-4">
                  <button
                    onClick={() => {
                      auth.signout(() => navigate("/"));
                    }}
                  >
                    Esci
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )
      )
      }
    </div>
  );
}