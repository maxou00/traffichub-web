import { gql, useQuery } from "@apollo/client";
import React, { createRef } from "react";
import { Button, Icon, Dropdown, Input, Popup, Grid, Form, Divider } from "semantic-ui-react";
import { isDev } from "../core/utils";
import { axisBottom, axisLeft, curveNatural, line, max, min, scaleBand, scaleLinear, scaleTime, select } from "d3";
import styles from "../styles/TrackingPoint.module.scss";
import { timeframe } from "../core/timeframes";
import VisitorChart from "./tracking-charts/VisitorChart";
import BrowserChart from "./tracking-charts/BrowserChart";
import OsChart from "./tracking-charts/OsChart";

interface Props {
    project: any;
    tracker: any;
}

function TrackingPoint(props: Props) {
    const [copied, setCopied] = React.useState(false);

    const [from, setFrom] = React.useState(new Date(Date.parse("2021-06-20")));
    const [to, setTo] = React.useState(new Date(Date.now()));
    const [frameSize, setFrameSize] = React.useState([30, "m"]);

    const { data, loading, error } = useQuery(gql`
        {
            tracker(id: "${props.tracker.id}") {
                visitors(timeframe: ${timeframe(frameSize[0] as number, frameSize[1] as string)}) {
                    total
                    browser
                    os
                    groups {
                        from
                        to
                        count
                    }
                }
            }
        }
    `);

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

    const frames = [
        { key: "m", value: "m", text: "minute" },
        { key: "h", value: "h", text: "heure" },
        { key: "d", value: "d", text: "jour" }
    ];
    return <div className={styles.page}>
        <div className={styles.head}>
            <h3>{props.project.title} <span>/</span> {props.tracker.title}</h3>
            <Button.Group>
                <Popup wide trigger={
                    <Button onClick={onCopy}>
                        <Icon fitted name={copied ? "check" : "code"} />
                    </Button>
                } on="hover" position="top center">
                    <div style={{ width: '250px' }}></div>
                    <Grid>
                        <Grid.Column>
                            <p>Cliquez pour copier le code d'intégration et ajoutez-le au code source de vos pages sur {props.tracker.url}</p>
                        </Grid.Column>
                    </Grid>
                </Popup>
                <Popup wide trigger={
                    <Button ><Icon name={"filter"} fitted /></Button>
                } on="click" position="bottom center">
                    <div style={{ width: '250px' }}></div>
                    <Grid>
                        <Grid.Column>
                            <Form>
                                <Input fluid value={5} labelPosition="right" label={<Dropdown value="m" options={frames} />} />
                                <Divider />
                                <Input fluid type="date" label="Du" />
                                <Divider />
                                <Input fluid type="date" label="Au" />
                            </Form>
                        </Grid.Column>
                    </Grid>
                </Popup>
            </Button.Group>
        </div>
        {
            data && data.tracker.visitors.total > 0 && <div className={styles.visitors_counter_wrapper}>
                <span>
                    <span className={styles.counter}>{data.tracker.visitors.total}</span>
                    <span>Visites enrégistrées</span>
                </span>
            </div>
        }
        <div className={styles.stats}>
            {data && <div className={styles.stats__visitors}>
                <VisitorChart visitors={data.tracker.visitors} from={from} to={to} periodSize={timeframe(frameSize[0] as number, frameSize[1] as string)} />
            </div>}
            {data && <div className={styles.stats__browsers}>
                <BrowserChart visitors={data.tracker.visitors} from={from} to={to} periodSize={timeframe(frameSize[0] as number, frameSize[1] as string)} />
            </div>}
            {data && <div className={styles.stats__oses}>
                <OsChart visitors={data.tracker.visitors} from={from} to={to} periodSize={timeframe(frameSize[0] as number, frameSize[1] as string)} />
            </div>}
        </div>
    </div>
}

export default TrackingPoint;
