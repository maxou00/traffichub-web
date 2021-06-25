import { arc, pie, scaleOrdinal, select } from "d3";
import { useEffect } from "react";
import { createRef, useCallback } from "react";
import styles from "../../styles/OsChart.module.scss";

interface Props {
    from: Date;
    to: Date;
    periodSize: number;
    visitors: {
        total: number;
        os: string[];
    }
}

export default function OsChart(props: Props) {
    const osRef = createRef<SVGSVGElement>();

    const buildOsBar = useCallback(() => {

        if (!osRef.current) {
            return;
        }

        let arrayDataset = props.visitors.os.map((os: string) => {
            let parts = os.split("::");
            return [parts[0], parseInt(parts[1]), parts[2]]
        })

        let dataset: any = {};
        arrayDataset.forEach((os) => {
            dataset[os[0]] = os[1] as number;
        })

        let svg = select(osRef.current)

        svg.selectAll(".arc").remove();
        svg.selectAll(".labelLine").remove();
        svg.selectAll(".labelText").remove();

        let offset = 40;
        let svgWidth = parseFloat(svg.style('width'));
        let svgHeight = parseFloat(svg.style('height'));

        let radius = Math.min(svgWidth, svgHeight) / 2 - offset

        let center = {
            x: svgWidth / 2,
            y: svgHeight / 2
        }

        let g = svg.select(".pie")
            .attr("transform", `translate(${center.x},${center.y})`)

        let colors = scaleOrdinal(arrayDataset.map((e) => e[2]))

        let arcPath = arc()
            .innerRadius(radius * .55)
            .outerRadius(radius * .8);

        let outerArc = arc()
            .innerRadius(radius * .9)
            .outerRadius(radius * .9)

        let pieData = pie().value((d: any) => d[1])(arrayDataset as any)

        let arcs = g.selectAll(".arc")
            .data(pieData)
            .enter()
            .append("g")
            .attr("class", "arc")


        arcs.append("path")
            .style("fill", (d, i) => colors(i + "") as any)
            .attr("data-fill", (d, i) => colors(i + ""))
            .attr("d", arcPath as any)
            .on("mouseover", (ev) => {
                select(ev.currentTarget)
                    .style("fill", "blue");
            })
            .on("mouseout", (ev) => {
                let node = select(ev.currentTarget)
                let realFill = node.attr("data-fill")
                node.style("fill", realFill)
            })

    }, [props, osRef]);

    useEffect(() => {
        buildOsBar();
        const call = (ev: any) => {
            buildOsBar();
        }

        window.addEventListener("resize", call);

        return () => {
            window.removeEventListener("resize", call);
        }
    }, [buildOsBar]);

    return <>
        <svg ref={osRef}>
            <g className="pie"></g>
        </svg>
        <div className={styles.legend}>
            {
                props.visitors.os.map((os) => {
                    let parts = os.split("::");
                    return <div className={styles.os} key={os}>
                        <span className={styles.colour} style={{ background: parts[2] }}></span>
                        <span className={styles.name}>{parts[0]}</span>
                        <span className={styles.total}>{parts[1]}</span>
                    </div>
                })
            }
        </div>
    </>
}