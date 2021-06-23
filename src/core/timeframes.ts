export function timeframe(frame: number, suffix: string){
    if(suffix === "m") {
        return frame * 60 * 1000
    }
    else if(suffix === "h") {
        return frame * 60 * 60 * 1000
    }
    else if(suffix === "d") {
        return frame * 24 * 60 * 60 * 1000
    }
    return frame;
}

export function timelineToFrames(from: number, to: number, size: number) {
    let offset = to - from;
    let count = Math.floor(offset / size);

    let periods = [];
    if(count === 0){
        ///No period
        periods.push([from, to]);
        return periods;
    }

    let periodStart = from;

    for(let i = 0; i < count; i++){
        let start = periodStart;
        let end = start + size - 1;
        if(end >= to){
            end = to;
        }
        periods.push([start, end]);
        periodStart = end + 1;
    }
    return periods;
}