import React from "react";
import { Button, Icon, Message, Container } from "semantic-ui-react";
import { isDev } from "../core/utils";
import styles from "../styles/TrackingPoint.module.scss";

interface Props {
    tracker: any;
}

function TrackingPoint(props: Props) {
    const [copied, setCopied] = React.useState(false);

    let url = `${isDev() ? "http://localhost:4000" : "https://api.traffichub.co"}/report/${props.tracker.tag}.js`
    let script = `<script src="${url}" defer></script>`;

    function onCopy() {
        navigator
            .clipboard
            .writeText(script)
            .then((done) => {
                setCopied(true);
                setTimeout(() => {
                    setCopied(false);
                }, 3000);
            })
    }

    return <div>
        <h2>{props.tracker.title}</h2>
        <Message style={{ background: '#434343', color: 'wheat' }}>
            <Message.Header>Ajoutez ce code aux pages du site {props.tracker.url}</Message.Header>
            <Message.Content style={{ flexDirection: 'column' }}>
                <code style={{ background: '#636363', display: 'block', padding: '8px 16px', borderRadius: '4px', margin: '16px 0px' }}>
                    {script}
                </code>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
                    <Button color={copied ? "green" : "blue"} onClick={onCopy} disabled={copied}>
                        <Icon name={copied ? "check" : "copy"} />
                        {copied ? "Copié" : "Copier"}
                    </Button>
                </div>
            </Message.Content>
        </Message>
    </div>
}

export default TrackingPoint;