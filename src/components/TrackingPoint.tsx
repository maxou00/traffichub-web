import { gql, useQuery } from "@apollo/client";
import React, { createRef } from "react";
import { Button, Icon, Dropdown, Input, Popup, Grid, Form, Divider } from "semantic-ui-react";
import { isDev } from "../core/utils";
import { axisBottom, axisLeft, curveNatural, line, max, min, scaleLinear, scaleTime, select } from "d3";
import styles from "../styles/TrackingPoint.module.scss";
import { timeframe } from "../core/timeframes";

interface Props {
    project: any;
    tracker: any;
}

function TrackingPoint(props: Props) {
    const [copied, setCopied] = React.useState(false);

    const [from, setFrom] = React.useState(new Date(Date.parse("2021-06-20")));
    const [to, setTo] = React.useState(new Date(Date.now()));
    const [frameSize, setFrameSize] = React.useState([1, "h"]);

    const visitorsRef = createRef<SVGSVGElement>();

    const { data, loading, error } = useQuery(gql`
        {
            tracker(id: "${props.tracker.id}") {
                visitors(timeframe: ${timeframe(frameSize[0] as number, frameSize[1] as string)}) {
                    total
                    groups {
                        from
                        to
                        data {
                            id
                            pageTitle
                        }
                    }
                }
            }
        }
    `);

    React.useEffect(() => {
        buildVisitors();
        document.addEventListener("resize",(ev) => {
            alert("resized");
        });
    }, [data]);

    let url = `${isDev() ? "http://localhost:4000" : "https://api.traffichub.co"}/report/${props.tracker.tag}.js`
    let script = `<script src="${url}" defer></script>`;

    function buildVisitors() {
        if (!data || data.tracker.visitors.total === 0) {
            return;
        }

        let svg = select(visitorsRef.current)

        let offset = 40;
        let svgWidth = parseFloat(svg.style('width'));
        let svgHeight = parseFloat(svg.style('height'));

        let zone = {
            x: offset,
            y: offset,
            w: svgWidth - offset,
            h: svgHeight - 2 * offset
        }

        let zoneFraction = zone.w / data.tracker.visitors.groups.length;

        let yMinValue = min(data.tracker.visitors.groups, (d: any) => d.data.length) || "";
        let yMaxValue = max(data.tracker.visitors.groups, (d: any) => d.data.length) || "";

        let mapped = data.tracker.visitors.groups.map((frame: any, i: number) => {
            let ratio = frame.data.length / data.tracker.visitors.total;
            let yValue = zone.h - (ratio * zone.h)
            let xValue = offset + (i * zoneFraction);
            return [xValue , yValue];
        })

        let amountScale = scaleLinear().domain([parseInt(yMaxValue), 0]).range([offset, zone.h + offset]);
        let dateScale = scaleTime().domain([from.getTime(), to.getTime()]).range([offset, zone.w ]).nice();

        let x_axis: any = axisBottom(dateScale);
        let y_axis: any = axisLeft(amountScale);

        svg.select("g.axisBottom")
        .attr("transform", `translate(0, ${zone.h + offset})`)
        .call(x_axis)

        svg.select("g.axisLeft")
        .attr("transform", `translate(${offset})`)
        .call(y_axis)

        svg.on("resize", (ev) => {alert("Resized")})

        let curve = line().curve(curveNatural)(mapped);
        if(curve) {
            svg
            .selectAll(".curve")
            .attr("d", curve)
            .attr("stroke-width", 4)
            .attr("fill", "transparent")
            .attr("stroke", "url(#curveGradient)")
            .attr("box-shadow", "1px 1px 4px #777")
        }
    }

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
        <div className={styles.stats}>
            <div className={styles.stats__visitors}>
                <svg ref={visitorsRef}>
                    <defs>
                        <linearGradient id="curveGradient">
                            <stop offset="0%" stopColor="orange"/>
                            <stop offset="100%" stopColor="tomato"/>
                        </linearGradient>
                        <filter id="shadow">
                            <feDropShadow dx="1" dy="1" stdDeviation="4" floodColor="#777777"/>
                        </filter>
                    </defs>
                    <g color="grey" className="axisBottom"></g>
                    <g color="grey" className="axisLeft"></g>
                    <path className="curve" d="" filter="url(#shadow)" strokeLinecap="round"/>
                </svg>
            </div>
        </div>
    </div>
}

export default TrackingPoint;