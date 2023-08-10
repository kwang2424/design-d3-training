import { useEffect, useRef } from 'react';
import *  as d3 from 'd3';

const LineGraph = ({ currData, county }) => {
    console.log(currData)
    const svgRef = useRef(null);
    const height = 700;
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
            .attr('transform', 'translate(' + margins.left + ',' + margins.top + ')');

        const xScale = d3.scaleLinear()
            .domain([2010, 2020])
            .range([margins.left, width - margins.right * 2])

        const minTransit = d3.min(currData, d => d.transit);
        const maxTransit = d3.max(currData, d => d.transit);

        const yScale = d3.scaleLinear()
            .domain([minTransit, maxTransit+1])
            .range([height - margins.bottom * 2, margins.top]);
            

        const line = d3.line()
            .x(d => xScale(parseInt(d.year)))
            .y(d => yScale(parseFloat(d.transit)))

        g.selectAll('path')
            .data([currData])
            .join('path')
            .attr('d', d => line(d))
            .attr('fill', 'none')
            .attr('stroke', '#41b248')
            .attr('stroke-width', 1.5)
        g.selectAll('circle')
            .data(currData)
            .join('circle')
            .attr('cx', d => xScale(parseInt(d.year)))
            .attr('cy', d => {
                console.log(d.transit, d.year)
                return yScale(parseFloat(d.transit))}
                )
            .attr('r', 3)
            .attr('fill', 'black')

        const xAxis = d3.axisBottom(xScale).ticks(10).tickFormat(x => x);

        g.append('g')
            .attr('class', 'x-axis')
            .attr('transform', `translate(0, ${height - margins.bottom * 2})`)
            .call(xAxis)

        g.append('g')
            .attr('class', 'y-axis')
            .attr('transform', `translate(${margins.left}, 0)`)
            .call(d3.axisLeft(yScale))
            

        svg.append('text')
            .attr('x', width / 2)
            .attr('y', margins.top)
            .attr('text-anchor', 'middle')
            .style('font-size', '20px')
            .text('Public Transit Use by Year in ' + county)

        svg.append('text')
            .attr('transform', 'rotate(-90)')
            .attr('x', -height / 2)
            .attr('y', margins.left)
            .attr('text-anchor', 'middle')
            .text('Public Transit Use')

        svg.append('text')
            .attr('x', width / 2)
            .attr('y', height)
            .attr('text-anchor', 'middle')
            .text('Year')
    }, [currData])
    return (
        <>
            <div>
                <svg ref={svgRef} width={width} height={height}></svg>
            </div>
        </>
    )
}
export default LineGraph;