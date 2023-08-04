import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';
import cookies from 'js-cookie';
import classNames from 'classnames';
import { IT, GB } from 'country-flag-icons/react/3x2'

const languages = [
  {
    code: 'it',
    name: 'Italiano',
    country_code: 'it',
  },
  {
    code: 'en',
    name: 'English',
    country_code: 'gb',
  },
]

export function Traduttore() {
  const currentLanguageCode = cookies.get('i18next') || 'it'
  const currentLanguage = languages.find((l) => l.code === currentLanguageCode)
  const { t } = useTranslation()
  //Chiamata axios effettuata una sola volta grazie a useEffect
  useEffect(() => {
  }, [currentLanguage, t])
  //Definisco le icone per le varie lingue
  const GlobeIcon = () => {
    document.documentElement.lang = currentLanguageCode  // <---- this line right here
    if (currentLanguageCode === 'it') {
      return (
        <IT title="Italiano" className="flag mx-2"/>
      )
    } else {
      return (
        <GB title="Inglese" className="flag mx-2"/>
      )
    }
  }
  return (
    <div className="language-select">
      <div className="d-flex justify-content-center align-items-center language-select-root">
        <div className="dropdown">
          <button
            className="btn btn-link dropdown-toggle"
            type="button"
            id="dropdownMenuButton1"
            data-toggle="dropdown"
            aria-expanded="false"
          >
            <GlobeIcon />
          </button>
          <ul className="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton1">
            {languages.map(({ code, name, country_code }) => (
              <li key={country_code}>
                <span
                  className={classNames('abandiera dropdown-item', {
                    disabled: currentLanguageCode === code,
                  })}
                  onClick={() => {
                    i18next.changeLanguage(code)
                  }}
                >
                  <span
                    className={`flag-icon flag-icon-${country_code} mr-2`}
                    style={{
                      opacity: currentLanguageCode === code ? 0.5 : 1,
                    }}
                  ></span>
                  {name}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}