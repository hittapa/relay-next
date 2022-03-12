import { useEffect, useState } from "react";
import { oembed } from "@loomhq/loom-embed";

export default function LoomEmbed({ loomSharedUrl }) {
    const [videoHTML, setVideoHTML] = useState("");
    useEffect(() => {
        async function setupEmbed() {
            const { html } = await oembed(loomSharedUrl, { width: 400 });
            setVideoHTML(html)
        }
        setupEmbed();
    }, []);
    return <div dangerouslySetInnerHTML={{ __html: videoHTML }}></div>
}