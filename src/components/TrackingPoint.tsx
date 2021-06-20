import React from "react";
import { Button, Icon, Message } from "semantic-ui-react";
import styles from "../styles/TrackingPoint.module.scss";

interface Props {
    tracker: any;
}

function TrackingPoint(props: Props) {
    return <div>
        <h2>{props.tracker.title}</h2>
        <div>
            <Message>
                <Message.Header>Ajoutez ce code aux pages du site {props.tracker.url}</Message.Header>
                <Message.Content>
                    <code>
                        {`<script src="https://api.traffichub.co/report/${props.tracker.tag}" defer></script>`}
                    </code>
                    <Button color="blue">
                        <Icon name={"copy"} />
                        Copier
                    </Button>
                </Message.Content>
            </Message>
        </div>
    </div>
}

export default TrackingPoint;