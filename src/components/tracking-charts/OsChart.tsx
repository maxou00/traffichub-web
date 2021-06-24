import { arc, axisBottom, axisLeft, curveNatural, line, max, pie, scaleBand, scaleLinear, scaleOrdinal, scaleTime, select } from "d3";
import { useEffect } from "react";
import { createRef, useCallback } from "react";

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

        if(!osRef.current) {
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

        let offset = 40;
        let svgWidth = parseFloat(svg.style('width'));
        let svgHeight = parseFloat(svg.style('height'));

        let radius = Math.min(svgWidth,svgHeight) / 2 - offset

        let center = {
            x: svgWidth / 2,
            y: svgHeight / 2
        }

        let g = svg.select(".pie")
            .attr("transform", `translate(${center.x},${center.y})`)

        console.log(arrayDataset.map((e) => e[2]));

        let colors = scaleOrdinal(arrayDataset.map((e) => e[2]))
        
        let arcPath = arc()
            .innerRadius(radius - 60)
            .outerRadius(radius);

        let pieData = pie().value((d: any)=> d[1])(arrayDataset as any)

        let arcs = g.selectAll(".arc")
            .data(pieData)
            .enter()
            .append("g")
            .attr("class", "arc")
            
        arcs.append("path")
            .attr("fill", (d,i) => colors(i+"") as any)
            .attr("d", arcPath as any);

    }, [props, osRef]);

    useEffect(() => {
        buildOsBar();
    }, [buildOsBar]);

    return <svg ref={osRef}>
        <g className="pie"></g>
    </svg>
}