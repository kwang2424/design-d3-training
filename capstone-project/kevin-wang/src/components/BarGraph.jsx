import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const BarGraph = ({ data, state }) => {
    const svgRef = useRef(null);
    const height = 1300;
    const width = 1000;
    const margins = {
        top: 50,
        right: 50,
        bottom: 50,
        left: 50,
    };
    useEffect(() => {
        const svg = d3.select(svgRef.current);
        svg.selectAll('*').remove();

        const g = svg
            .append('g')
            .attr('class', 'svg-group')
            .attr('transform', 'translate(' + (margins.left * 3 - 10) + ',' + margins.top / 2+ ')');

        // const color = d3.scaleOrdinal()
        //     .domain(['year', 'transit'])
        //     .range(['#41b248', '#f9c74f']);

        // want data in state, county, year, transit format
        const fips = Object.keys(data);
        const stateFips = fips.filter(f => data[f].properties.state === state);
        const relevantData = stateFips.map(f => {
            const countyData = data[f];
            
            return [countyData.properties.county, countyData.data];
        })

        // const minTransit = d3.min(relevantData, d => parseFloat(d[1].transit));
        // const maxTransit = d3.max(relevantData, d => parseFloat(d[1].transit));
        // const minUnemployment = d3.min(relevantData, d => parseFloat(d[1].unemployed));
        // const maxUnemployment = d3.max(relevantData, d => parseFloat(d[1].unemployed));

        const xScale = d3.scaleLinear()
            .domain([0, 100])
            .range([margins.left, width - margins.right * 2])

        const yDomain = relevantData.map(d => d[0])

        const yScale = d3.scalePoint()
            .domain(yDomain)
            .range([0, height - margins.bottom - margins.top])

        console.log(relevantData)
        const bars = g.selectAll("rect")
            .data(relevantData)
            .join("rect")
            .attr("y", d => {
                console.log(d[0], yScale(d[0]))
                return yScale(d[0])- 5 + 'px'
            })
            .attr("width", d => xScale(parseFloat(d[1].unemployed)))
            .attr("height", '5px')
            .attr("fill", "blue"); // Choose a color for the unemployed bars
        const transitBars = g.selectAll(".transit-bars")
            .data(relevantData)
            .join("rect")
            .attr("y", d => {
                console.log(d[0], yScale(d[0]))
                return yScale(d[0])
            })
            .attr("width", d => xScale(parseFloat(d[1].transit)))
            .attr("height", '5px')
            .attr("fill", "red"); // Choose a color for the unemployed bars
        
        g.append("text")
            .text("Unemployment and Transit Usage by County in " + state)
            .attr("x", (width - margins.left - margins.right) / 2)
            .attr("y", -margins.top / 4)
            .attr("text-anchor", "middle")

        g.append("g")
            .attr("transform", "translate(" + -(margins.left) + "," + (height - margins.top - margins.bottom + 5) + ")")
            .call(d3.axisBottom(xScale));
        g.append("g")
            .attr('transform', 'translate(' - (margins.left) + ',0)')	
            .call(d3.axisLeft(yScale));
        
        
    }, [data, state])

    return (
        <div>
            <svg ref={svgRef} width={width} height={height}></svg>
        </div>
    )
}

export default BarGraph;