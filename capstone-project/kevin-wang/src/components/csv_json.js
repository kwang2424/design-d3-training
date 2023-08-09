import fs from 'fs';
const getTransitYearData = () => {
    const file = fs.readFileSync('../../data/merged_public_transit.csv', 'utf-8', (err, data) => {
        if (err) throw err;
        return data.split(',');
    });

    const splitFile = file.split('\n');

    const json = {}

    for (let i=1; i<splitFile.length; i++) {
        const row = splitFile[i].split(',');
        const fips = row[11];
        const state = row[13];
        const county = row[14];
        json[fips] = {
            properties: {
                state, county
            }
        }
        // console.log(json)
        let data = [];
        for (let y=2010; y<=2020; y++) {
            data.push({
                year: y,
                transit: row[y-2010]
            })
            // console.log(year);
        }
        json[fips]['data'] = data;
    }

    fs.writeFile('transitYearData.json', JSON.stringify(json), function (err) {
        if (err) {
            console.log(err);
        }
    });
}

const get2020TransitUnemploymentData = () => {
    const file = fs.readFileSync('../../data/transit_data_2020.csv', 'utf-8', (err, data) => {
        if (err) throw err;
        return data.split(',');
    });
    
    const splitFile = file.split('\n');
    
    const json = {}
    
    for (let i=1; i<splitFile.length; i++) {
        const row = splitFile[i].split(',');
        const fips = row[1];
        const state = row[3];
        const county = row[4];
        json[fips] = {
            properties: {
                state, county
            }
        }
        let transit = "";
        if (row[6]) {
            transit = row[6].replace(/\n|\r/g, "");
        }
        // console.log(json)
        json[fips]['data'] = {
            transit,
            unemployed: row[5]
        }
    }
    
    fs.writeFile('transitYearData.json', JSON.stringify(json), function (err) {
        if (err) {
            console.log(err);
        }
    });
    
}


get2020TransitUnemploymentData();