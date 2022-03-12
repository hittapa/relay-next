import { useEffect, useState } from "react";
import { setup, isSupported } from "@loomhq/loom-sdk";
import { oembed } from "@loomhq/loom-embed";
import { Textarea, Button, Stack } from "@chakra-ui/react"

const PUBLIC_APP_ID = 'edc280e5-dc2c-49d5-b72c-38f06fbd8851';
const BUTTON_ID = "loom-sdk-button";

export default function Loom({ setLoomSharedUrl }) {
    const [videoHTML, setVideoHTML] = useState("");

    useEffect(() => {
        async function setupLoom() {
            const button = document.getElementById(BUTTON_ID);

            if (!button) {
                return;
            }

            const { configureButton } = await setup({
                publicAppId: PUBLIC_APP_ID,
            });

            const sdkButton = configureButton({ element: button });

            sdkButton.on("insert-click", async (video) => {
                setLoomSharedUrl(video.sharedUrl);
                const { html } = await oembed(video.sharedUrl, { width: 400 });
                setVideoHTML(html)
            });
        }

        setupLoom();
    }, []);

    return (
        <>
            <Button colorScheme='purple' id={BUTTON_ID} borderRadius={20}>
                <svg
                    width="110mm"
                    height="110mm"
                    viewBox="0 0 110 110"
                    version="1.1"
                    id="svg5"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ width: "30px", height: "30px", marginRight: "10px" }}
                >
                    <g id="layer1">
                        <path
                            style={{ fill: "#ffffff", fillOpacity: 1, stroke: "none", strokeWidth: 0.264583 }}
                            d="M 49.524637,2.4889474 V 33.180616 h -0.26458 l -5.44407,-9.78958 -9.63718,-16.6687506 -10.05417,5.5562506 4.23333,7.9375 10.58334,18.52083 c -6.56696,-3.06599 -12.7544,-7.29377 -19.05,-10.88774 -1.53207,-0.87458 -5.30032,-4.06566 -7.0874,-3.6966 -0.89011,0.18381 -1.43573,1.71284 -1.834121,2.41351 -1.3485997,2.37188 -3.2185699,4.80298 -4.0430699,7.40833 l 16.6687509,9.63718 9.78959,5.44407 v 0.26458 H 2.6933861 v 11.64167 H 33.120467 v 0.26458 c -8.86753,4.1402 -18.02325,9.69196 -26.1937509,15.08125 l 5.5562509,10.05417 8.46667,-4.5511 17.99167,-10.26557 -10.3159,17.99167 -4.50077,8.46667 10.05417,5.556264 9.94277,-17.197934 5.40306,-8.99583 V 107.79313 H 61.166311 V 77.366036 h 0.26458 c 4.18888,8.97175 9.91023,17.7464 15.08125,26.193764 l 10.05417,-5.556264 -4.5511,-8.46667 -10.26557,-17.99167 18.52084,10.58334 7.9375,4.23333 5.556259,-10.05417 -17.462519,-10.12851 -8.99583,-4.95274 v -0.26458 H 107.99757 V 49.320196 H 77.305891 v -0.26458 l 9.78958,-5.44486 16.668769,-9.63639 -5.556259,-10.05417 -8.20209,4.38563 -18.25625,10.43104 10.26557,-17.99167 4.5511,-8.46666 -10.05417,-5.5562506 -10.12851,17.4625006 -4.95274,8.99583 h -0.26458 V 2.4889474 H 49.524637 m -10.31875,36.2479186 -0.26458,0.26458 0.26458,-0.26458 m 32.543754,0 -0.26458,0.26458 0.26458,-0.26458 m -17.462504,0.33999 c 16.778824,-1.99999 22.718984,21.55031 9.260424,29.80425 -1.87193,1.14803 -4.16613,1.8714 -6.35,2.08968 -16.354434,1.63539 -24.305164,-19.76067 -10.847924,-29.20709 2.35664,-1.65444 5.11625,-2.35029 7.9375,-2.68684 m -15.08125,32.20376 -0.26458,0.26458 0.26458,-0.26458 m 32.543754,0 -0.26458,0.26458 z"
                            id="path111" />
                    </g>
                </svg>
                Record Loom</Button>
            <div dangerouslySetInnerHTML={{ __html: videoHTML }}></div>
        </>
    );
}