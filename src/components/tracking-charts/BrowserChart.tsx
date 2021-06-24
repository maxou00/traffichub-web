import { axisBottom, axisLeft, curveNatural, line, max, scaleBand, scaleLinear, scaleTime, select } from "d3";
import { useEffect } from "react";
import { createRef, useCallback } from "react";

interface Props {
    from: Date;
    to: Date;
    periodSize: number;
    visitors: {
        total: number;
        browser: string[];
    }
}

export default function BrowserChart(props: Props) {
    const browserRef = createRef<SVGSVGElement>();

    const buildBrowserBar = useCallback(() => {
        if(!browserRef.current) {
            return;
        }

        let dataset = (props.visitors.browser).map((b: string) => {
            let parts = b.split("::");
            return { name: parts[0], count: parseInt(parts[1]), colour: parts[2] };
        })

        let svg = select(browserRef.current)

        let offset = 40;
        let svgWidth = parseFloat(svg.style('width'));
        let svgHeight = parseFloat(svg.style('height'));
        
        let zone = {
            x: offset,
            y: offset,
            w: svgWidth - offset,
            h: svgHeight - offset
        }

        let yMaxValue = max(dataset, (d: any) => d.count);

        let counterScale = scaleLinear().domain([parseInt(yMaxValue), 0]).range([offset, zone.h]);
        let bandScale = scaleBand().domain(dataset.map(d => d.name)).padding(.2).range([offset, zone.w]);

        let x_axis: any = axisBottom(bandScale);
        let y_axis: any = axisLeft(counterScale);

        svg.select("g.axisBottom")
            .attr("transform", `translate(0, ${zone.h})`)
            .call(x_axis)

        svg.select("g.axisLeft")
            .attr("transform", `translate(${offset})`)
            .call(y_axis)

        svg
            .selectAll(".bar")
            .data(dataset)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", (d) => { console.log(bandScale(d.name)); return bandScale(d.name) as any })
            .attr("y", (d) => { console.log(counterScale(d.count)); return counterScale(d.count) })
            .attr("width", bandScale.bandwidth())
            .attr("height", (d) => { return zone.h - counterScale(d.count) })
            .attr("stroke-width", 2)
            .attr("rx", 4)
            .attr("fill", (d) => d.colour)
    }, [props, browserRef]);


    useEffect(() => {
        buildBrowserBar();
    }, [buildBrowserBar]);

    return <svg ref={browserRef}>
        <g color="grey" className="axisBottom"></g>
        <g color="grey" className="axisLeft"></g>
    </svg>
}