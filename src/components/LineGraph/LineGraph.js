import React, { useEffect, useState } from 'react';
import './LineGraph.css';
import { Line } from 'react-chartjs-2';
import { buildChartData, mapOptions } from '../../util/util';


function LineGraph({ casesType = "cases", countryCode = "worldwide", countryName = "World-Wide" }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    let cancel = false;
    const url = countryCode === "worldwide"
      ? "https://disease.sh/v3/covid-19/historical/all?lastdays=120" :
      `https://disease.sh/v3/covid-19/historical/${countryCode}?lastdays=120`;
    fetch(url)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (!cancel) {
          if (countryCode === "worldwide") {
            setData(buildChartData(data, casesType))
          } else {
            setData(buildChartData(data.timeline, casesType))
          }
        }
      });
    return () => {
      cancel = true;
    }
  }, [casesType, countryCode]);

  return (
    <div className="lineGraph">
      <Line
        options={mapOptions}
        data={{
          datasets: [
            {
              backgroundColor: casesType === "recovered" ? "rgb(125,215,29,0.5)" : "rgba(204, 16, 52, 0.5)",
              borderColor: casesType === "recovered" ? "rgb(125,215,29)" : "#CC1034",
              data: data
            }
          ],
        }}
      />
    </div>
  );
}

export default LineGraph;
