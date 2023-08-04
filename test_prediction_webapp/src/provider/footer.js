
import React from "react";
import { Link } from "react-router-dom";
import logo from '../img/logo_nas_orizzontale.png';
import logoBlack from '../img/logo_nas_orizzontale.png';
import {
    EmailIcon,
    EmailShareButton,
    FacebookIcon,
    FacebookShareButton,
    LinkedinIcon,
    LinkedinShareButton,
    TelegramIcon,
    TelegramShareButton,
    TwitterIcon,
    TwitterShareButton,
    WhatsappIcon,
    WhatsappShareButton,
} from "react-share";

export function Footer(props) {
    const url = window.location.href


    return (
        <div className="footer row customBorderTop w-100 mx-0 py-2">
           {/*  <div className="col-12 col-lg-4 d-flex justify-content-center align-items-center">
                <Link to={"/"}><img src={props.theme === 'light' ? logoBlack : logo} onError={(e) => e.target.src = props.theme === 'light' ? logoBlack : logo} alt="Logo" width="200" /></Link>
            </div> */}
            <div className="col-12 col-lg-4 d-flex justify-content-center align-items-center"
            ></div>
            <div className="col-12 col-lg-4 d-flex justify-content-center align-items-center">
                <div className="containerShareIcon">
                    <FacebookShareButton className="shareButton" url={url}>
                        <FacebookIcon size={32} round />
                    </FacebookShareButton>
                </div>
                <div className="containerShareIcon">
                    <WhatsappShareButton className="shareButton" url={url}>
                        <WhatsappIcon size={32} round />
                    </WhatsappShareButton>
                </div>
                <div className="containerShareIcon">
                    <TelegramShareButton className="shareButton" url={url}>
                        <TelegramIcon size={32} round />
                    </TelegramShareButton>
                </div>
                <div className="containerShareIcon">
                    <TwitterShareButton className="shareButton" url={url}>
                        <TwitterIcon size={32} round={true} />
                    </TwitterShareButton>
                </div>
                <div className="containerShareIcon">
                    <EmailShareButton className="shareButton" url={url}>
                        <EmailIcon size={32} round />
                    </EmailShareButton>
                </div>
                <div className="containerShareIcon">
                    <LinkedinShareButton className="shareButton" url={url}>
                        <LinkedinIcon size={32} round />
                    </LinkedinShareButton>
                </div>
            </div>
        </div>
    );
}