import * as d3 from 'd3';
import geoJsonData from '../../data/countiesGeoJson.json' assert { type: 'json'};
import fs from 'fs';
console.log(process.cwd())
let transitData = fs.readFileSync('../data/transit_data_2020.csv', 'utf8', function (err, data) {
    if (err) throw err;
    const dataArray = data.split(/\r?\n/);
    return dataArray;
});
transitData = transitData.split('\n');
// for (let i=0; i< 100; i++) {
//     console.log(geoJsonData.features[i]);
// }

// geoJsonData = geoJson.json();

geoJsonData.features.forEach((c => {
    const filtered = transitData.filter(d => {
        const split = d.split(',');
        const countyFips = split[1];
        return parseInt(countyFips) === c.id;
    })
    // console.log(filtered[0])
    c.properties['unemployed'] = filtered.map(s => s.split(',')[4]);
    c.properties['transit'] = filtered.map(s => s.split(',')[5].split('\r')[0]);
})
);
// console.log(geoJsonData.features[1]);
const filtered = geoJsonData.features.filter(c => c.id === 1001)
for (let i=0; i<filtered.length; i++) {
    console.log(filtered[i]);
}

fs.writeFile('geoJsonData.json', JSON.stringify(geoJsonData), function (err) {
    if (err) {
        console.log(err);
    }
});