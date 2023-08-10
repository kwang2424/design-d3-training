import { useState, useMemo } from 'react';
import Map from './components/Map';
import BarGraph from './components/BarGraph';
import './App.css';
import LineGraph from './components/LineGraph';
import transitYearData from '../data/transitYearData.json';
import transit2020Data from '../data/transit2020Data.json';

function App() {
    const [transit, setTransit] = useState(true);
    const [graph, setGraph] = useState('map');
    const [county, setCounty] = useState('Autauga County');
    const [state, setState] = useState('Alabama');
    const [barState, setBarState] = useState('Alabama');

    const states = [];
    const counties = Object.keys(transitYearData).map(fips => {
        if (!states.includes(transitYearData[fips].properties.state) && transitYearData[fips].properties.state) {
            states.push(transitYearData[fips].properties.state);
        }
        return [transitYearData[fips].properties.county, transitYearData[fips].properties.state];
    });
    states.push('None');


    const countiesMenu = () => {
        const filteredCounties = counties.filter(county => {
            if (state === 'None') return true;
            return county[1] === state
        });
        return <select onChange={(evt) => setCounty(evt.target.value)}>
            {filteredCounties.map(county => {
                return (
                    <option key={county[0]} value={county[0]}>{county[0]}</option>
                )
            })}
        </select>
    };

    const statesMenu = () => {
        return <select value={state} onChange={(evt) => setState(evt.target.value)}>
            {states.map(state => {
                return (
                    <option key={state} value={state}>{state}</option>
                )
            })}
        </select>
    }

    const barStatesMenu = () => {
        return <select value={barState} onChange={(evt) => setBarState(evt.target.value)}>
            {states.map(barState => {
                return (
                    <option key={barState} value={barState}>{barState}</option>
                )
            })}
        </select>
    }
    const currData = useMemo(() => {
        console.log(county, state)
        const fips = Object.keys(transitYearData).filter(fips => transitYearData[fips].properties.county === county && transitYearData[fips].properties.state === state);
        // console.log(fips)
        console.log(transitYearData[fips].data)
        return transitYearData[fips].data;
    }, [county]);

    const MapComponent = () => {
        return (
            <div className="map-buttons">
                <button onClick={() => setTransit(true)}>Transit</button>
                <button onClick={() => setTransit(false)}>Unemployment</button>
                <Map transit={transit} />
            </div>
        )
    };

    const LineComponent = () => {
        return (
            <>
                {countiesMenu()}
                {statesMenu()}
                <LineGraph currData={currData} county={county} />
            </>)
    };

    const BarGraphComponent = () => {
        return (
            <>
            <div>
                <p>
                    Here is the full data for public transportation usage and unemployment in 2020, transit usage is in red while 
                unemployment is in blue.
                </p>

                <p>Currently, the data is filtered by state, so by using the dropdown below, you can see the data for each county in your selected state.</p>
                <p>The intent of this graph is to be exploratory, allowing you to look around the different counties in America and see whether or not 
                    there exists a relationship between public transit and unemployment. Since unemployment is quite the complicated metric, it is pinpoint
                    specific metrics that cause unemployment, but it is interesting to see if there exists some relationship. 
                </p>
            </div>
            {barStatesMenu()}
            <BarGraph data={transit2020Data} state={barState}/>
            </>
        )
    };
    return (
        <>
            <div>
                <h1>Public Transportation and Unemployment</h1>
            </div>
            <div className="buttons-container">
                <button onClick={() => setGraph('map')}>Map</button>
                <button onClick={() => setGraph('line')}>Line Graph</button>
                <button onClick={() => setGraph('bar')}>See Data</button>
            </div>
            {graph === 'map' ? <MapComponent /> : (graph === 'line' ? <LineComponent /> : <BarGraphComponent />)}
        </>
    )
}

export default App
