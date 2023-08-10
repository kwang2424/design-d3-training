import React, { useState, useEffect, useRef } from "react";
import geoJson from '../../data/geoJsonData.json';
import * as d3 from "d3";
import { legendColor } from 'd3-svg-legend'


const Map = ({ transit, linear }) => {
    const [data, setData] = useState(geoJson);
    const svgRef = useRef(null);
    const tooltipRef = useRef(null);
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
        const legendSvg = d3.select('#svg-color-quant');
        legendSvg.append("g")
            .attr("class", "legendSequential")
            .attr("transform", "translate(20,20)");

        svg.selectAll('*').remove();

        const g = svg
            .append('g')
            .attr('class', 'svg-group')
            .attr('transform', 'translate(' + margins.left + ',' + margins.top + ')');

        // load and parse data
        const projection = d3.geoAlbersUsa();
        const geoGen = d3.geoPath().projection(projection);

        const domain = transit ? d3.extent(data.features, d => parseFloat(d.properties.transit)): d3.extent(data.features, d => parseFloat(d.properties.unemployed))

        const colors = linear ? d3.scaleSequential(domain, d3.interpolateBlues) : d3.scaleSequentialSqrt(domain, d3.interpolateBlues)

        // const colors = d3.scaleSequentialQuantile(d3.interpolateBlues)
        //     .domain(domain)
            // .interpolator(d3.interpolateBlues)
        const unemployedColors = linear ? d3.scaleSequential(domain, d3.interpolateBlues): d3.scaleSequentialSqrt(domain, d3.interpolateBlues)

        const legendSequential = legendColor()
            .shapeWidth(100)
            .cells(9)
            .title(transit ? "Legend - Transit Use %" : "Legend - Unemployed %")
            .orient('vertical')
            .scale(colors)

        let tooltip = d3.select(tooltipRef.current)
            .append("div")
            .attr("class", "tooltip")
            .style("display", "none")
            .style('position', 'absolute')
            .style("color", "black")
            .style("background-color", "white")
            .style('width', '150px')
            .style("border", "solid")
            .style("border-width", "2px")
            .style("border-radius", "5px")
            .style("padding", "5px")

        const mouseover = function (d) {
            tooltip.style("display", "block")
            d3.select(this)
                .style("stroke-width", "2px")
                .style("opacity", 1)
        }
        const mousemove = function (evt, d) {
            const text = transit ? `${evt.srcElement.__data__.properties.name}: ${evt.srcElement.__data__.properties.transit}`
                : `${evt.srcElement.__data__.properties.name}: ${evt.srcElement.__data__.properties.unemployed}`
            tooltip
                .html(text)
                .style("top", d3.pointer(evt, this)[1] + 'px')
                .style("left", d3.pointer(evt, this)[0] + 'px')
        };

        const mouseleave = function (d) {
            tooltip
                .style("display", "none")
            d3.select(this)
                .style("stroke-width", "1px")
                .style("opacity", 1)
        }
        g.selectAll('path')
            .data(data.features)
            .join('path')
            .attr('d', geoGen)
            .attr('stroke', 'black')
            .attr('stroke-width', '1px')
            .attr('fill', d => transit ? colors(d.properties.transit) : unemployedColors(d.properties.unemployed))
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave)
        // svg.append('text')
        //     .attr('x', width / 2)
        //     .attr('y', margins.top)
        //     .attr('text-anchor', 'middle')
        //     .text(transit ? 'Map of Transit Use % by County' : 'Map of Unemployment % by County')

        legendSvg.select('.legendSequential')
            .call(legendSequential)
    }, [transit]);
    return (
        <>
            <div className="map-header">
                <h2>{transit ? "Map of Transit Use % By County" : "Map of Unemployment % by County"}</h2>
            </div>
            <div>
                <div className="tooltip" ref={tooltipRef} />
                <svg className="map" ref={svgRef} width={width} height={height}></svg>
                <svg height={600} id="svg-color-quant"></svg>
            </div>
            

        </>)
}

export default Map;