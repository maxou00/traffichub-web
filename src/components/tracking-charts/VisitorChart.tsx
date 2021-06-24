import { axisBottom, axisLeft, curveNatural, line, max, scaleLinear, scaleTime, select } from "d3";
import { useEffect } from "react";
import { createRef, useCallback } from "react";

interface Props {
    from: Date;
    to: Date;
    periodSize: number;
    visitors: {
        total: number;
        groups: {
            from: number;
            to: number;
            count: number;
        }[]
    }
}

export default function VisitorChart(props: Props) {
    const visitorsRef = createRef<SVGSVGElement>();

    const buildVisitorsCurve = useCallback(() => {
        if (props.visitors.total === 0) {
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
            h: svgHeight - offset
        }

        let zoneFraction = (zone.w - offset) / props.visitors.groups.length;

        let yMaxValue = max(props.visitors.groups, (d: any) => d.count) || "";

        let mapped = props.visitors.groups.map((frame: any, i: number) => {
            let ratio = frame.count / parseInt(yMaxValue);
            let yValue = zone.h - (ratio * (zone.h - offset))
            let xValue = offset + (i * zoneFraction);
            return [xValue, yValue];
        })

        let amountScale = scaleLinear().domain([parseInt(yMaxValue), 0]).range([offset, zone.h]);
        let dateScale = scaleTime().domain([props.from.getTime(), props.to.getTime()]).range([offset, zone.w]).nice();

        let x_axis: any = axisBottom(dateScale);
        let y_axis: any = axisLeft(amountScale);

        svg.select("g.axisBottom")
            .attr("transform", `translate(0, ${zone.h})`)
            .call(x_axis)

        svg.select("g.axisLeft")
            .attr("transform", `translate(${offset})`)
            .call(y_axis)

        let curve = line().curve(curveNatural)(mapped as any);
        if (curve) {
            svg
                .selectAll(".curve")
                .attr("d", curve)
                .attr("stroke-width", 2.5)
                .attr("fill", "transparent")
                .attr("stroke", "url(#curveGradient)")
        }
    }, [visitorsRef, props, props.from, props.to]);


    useEffect(() => {
        buildVisitorsCurve();
    }, [buildVisitorsCurve]);

    return <svg ref={visitorsRef}>
        <defs>
            <linearGradient id="curveGradient">
                <stop offset="0%" stopColor="orange" />
                <stop offset="100%" stopColor="#2196f3" />
            </linearGradient>
            <filter id="shadow">
                <feDropShadow dx="1" dy="1" stdDeviation="1" floodColor="#ddd" />
            </filter>
        </defs>
        <g color="grey" className="axisBottom"></g>
        <g color="grey" className="axisLeft"></g>
        <path className="curve" d="" filter="url(#shadow)" strokeLinecap="round" />
    </svg>
}