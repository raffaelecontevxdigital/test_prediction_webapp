import { GooglePlayButton, AppStoreButton, ButtonsContainer, } from "react-mobile-app-button";
import storeWindows from '../img/microsoft-store.png'

export const LinkToDownload = () => {
    const APKUrl =
        "https://play.google.com/store/apps/details?id=host.exp.exponent";
    const iOSUrl = "https://apps.apple.com/us/app/expo-go/id982107779";

    function openWindowsStore() {
        window.location.href = "ms-windows-store://pdp/?ProductId={your-app-id}";
    }

    function openMacAppStore() {
        window.location.href = "macappstore://itunes.apple.com/app/{your-app-id}";
    }

    return (
        <div className="customBorderTop p-4 d-flex justify-content-center w-100">
            <ButtonsContainer>
                <GooglePlayButton
                    url={APKUrl}
                    theme={"light"}
                    className={"custom-style"}
                />
                <AppStoreButton
                    url={iOSUrl}
                    theme={"light"}
                    className={"custom-style"}
                />
                <div className="custom-style d-flex align-items-center" style={{ height: "50px", width: "200px", borderRadius: "10px", cursor: 'pointer' }} onClick={openWindowsStore}>
                    <img className="mx-2" src={storeWindows} alt="Windows Store" />
                    <div className="button-text-container">
                        <span className="button-title">GET IT ON</span>
                        <span className="button-store-name">Windows Store</span>
                    </div>
                </div>
                <div className="custom-style d-flex align-items-center" style={{ height: "50px", width: "200px", borderRadius: "10px", cursor: 'pointer' }} onClick={openMacAppStore}>
                    <img className="mx-2" src="/static/media/Apple.71320a89dc7cdb815431216cf0bc1dd2.svg" alt="App Store" />
                    <div className="button-text-container">
                        <span className="button-title">GET IT ON</span>
                        <span className="button-store-name">Mac App Store</span>
                    </div>
                </div>
            </ButtonsContainer>
        </div>
    );
};