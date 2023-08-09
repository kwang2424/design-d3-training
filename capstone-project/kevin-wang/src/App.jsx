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
        return <select onChange={(evt) => setState(evt.target.value)}>
            {states.map(state => {
                return (
                    <option key={state} value={state}>{state}</option>
                )
            })}
        </select>
    }

    const barStatesMenu = () => {
        return <select onChange={(evt) => setBarState(evt.target.value)}>
            {states.map(barState => {
                return (
                    <option key={barState} value={barState}>{barState}</option>
                )
            })}
        </select>
    }
    const currData = useMemo(() => {
        const fips = Object.keys(transitYearData).filter(fips => transitYearData[fips].properties.county === county && transitYearData[fips].properties.state === state);
        console.log(transitYearData[fips].data)
        return transitYearData[fips].data;
    }, [county, state]);
    const MapComponent = () => {
        return (
            <>
                <button onClick={() => setTransit(false)}>Unemployment</button>
                <button onClick={() => setTransit(true)}>Transit</button>
                <Map transit={transit} />
            </>
        )
    }

    const LineComponent = () => {
        return (
            <>
                {countiesMenu()}
                {statesMenu()}
                <LineGraph currData={currData} county={county} />
            </>)
    }

    return (
        <>
            <button onClick={() => setGraph('map')}>Map</button>
            <button onClick={() => setGraph('line')}>Line Graph</button>
            {graph === 'map' ? <MapComponent /> : <LineComponent />}
            {barStatesMenu()}
            <BarGraph data={transit2020Data} state={barState}/>
        </>
    )
}

export default App
