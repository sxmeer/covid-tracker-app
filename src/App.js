import React, { useEffect, useState } from 'react';
import './App.css';
import { MenuItem, Select, FormControl, Card, CardContent } from '@material-ui/core';
import InfoBox from './components/InfoBox/InfoBox';
import Map from './components/Map/Map';
import Table from './components/Table/Table';
import LineGraph from './components/LineGraph/LineGraph';
import "leaflet/dist/leaflet.css";
import numeral from 'numeral';
import { log, prettyPrintStat } from './util/util';

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");
  const [mapCenter, setMapCenter] = useState([34.80746, -40.4796]);
  const [mapZoom, setMapZoom] = useState(3);

  const loadCountryInfo = async (selectedCountryCode = "worldwide") => {
    const url = selectedCountryCode === 'worldwide' ?
      'https://disease.sh/v3/covid-19/all' :
      `https://disease.sh/v3/covid-19/countries/${selectedCountryCode}`;
    await fetch(url)
      .then(response => response.json())
      .then(data => {
        log(`country info==>${selectedCountryCode}`, data)
        setCountryInfo(data);
        let mapCenter = selectedCountryCode === 'worldwide' ? [34.80746, -40.4796] : [data.countryInfo.lat, data.countryInfo.long]
        log(`map center==>${selectedCountryCode}`, mapCenter)
        setMapCenter(mapCenter)
        let mapZoom = selectedCountryCode === 'worldwide' ? 2 : 3;
        log(`map zoom==>${selectedCountryCode}`, mapZoom);
        setMapZoom(mapZoom);
      });
  }

  useEffect(() => {
    loadCountryInfo();
  }, []);

  useEffect(() => {
    const getCountries = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then(response => response.json())
        .then(data => {
          const countries = data.map((country) => (
            {
              name: country.country,
              value: country.countryInfo.iso2
            }
          ));
          log("countries==>", countries);
          setCountries(countries);
          log("MapCountries==>", data);
          setMapCountries(data);
          setTableData(data.sort((a, b) => b.cases - a.cases));
        })
    }
    getCountries();
  }, []);

  const optionChangeHandler = (event) => {
    let selectedCountryCode = event.target.value;
    loadCountryInfo(selectedCountryCode).then(() => setCountry(selectedCountryCode));
  }

  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>🔴 Covid-19 Tracker</h1>
          <FormControl className="app__dropdown">
            <Select
              variant="outlined"
              onChange={optionChangeHandler}
              value={country}>
              <MenuItem value="worldwide">World-Wide</MenuItem>
              {countries.map(country => (
                <MenuItem key={country.name} value={country.value}>{country.name}</MenuItem>
              ))}

            </Select>
          </FormControl>
        </div>

        <div className="app__stats">
          <InfoBox
            onClick={(e) => setCasesType("cases")}
            title="Coronavirus Cases"
            isRed
            active={casesType === "cases"}
            cases={prettyPrintStat(countryInfo.todayCases)}
            total={numeral(countryInfo.cases).format("0.0a")}
          />
          <InfoBox
            onClick={(e) => setCasesType("recovered")}
            title="Recovered"
            active={casesType === "recovered"}
            cases={prettyPrintStat(countryInfo.todayRecovered)}
            total={numeral(countryInfo.recovered).format("0.0a")}
          />
          <InfoBox
            onClick={(e) => setCasesType("deaths")}
            title="Deaths"
            isRed
            active={casesType === "deaths"}
            cases={prettyPrintStat(countryInfo.todayDeaths)}
            total={numeral(countryInfo.deaths).format("0.0a")}
          />
        </div>
        <Map
          countries={mapCountries}
          casesType={casesType}
          center={mapCenter}
          zoom={mapZoom}
          isMarkerVisible={country !== "worldwide"}
        />
      </div>
      <Card className="app__right">
        <CardContent>
          <div className="app__information">
            <h3>Latest Cases by Country</h3>
            <Table countries={tableData} />
            {countryInfo ? countryInfo.country === undefined ?
              <h3>{`World-Wide new ${casesType}`}</h3> :
              <h3>{`New ${casesType} in ${countryInfo.country}`}</h3> :
              <h3>{`World-Wide new ${casesType}`}</h3>}
            <LineGraph
              countryCode={country}
              casesType={casesType} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
