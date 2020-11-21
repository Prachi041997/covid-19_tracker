import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import numeral from "numeral";
const options = {
  legend: {
    display: false,
  },
  elements: {
    point: {
      radius: 0,
    },
  },
  maintainAspectRatio: false,
  tooltips: {
    mode: "index",
    intersect: false,
    callbacks: {
      label: function (tooltipItem, data) {
        return numeral(tooltipItem.value).format("+0,0");
      },
    },
  },
  scales: {
    xAxes: [
      {
        type: "time",
        time: {
          unit: 'month',
          tooltipFormat: "ll",
        },
      },
    ],
    yAxes: [
      {
        gridLines: {
          display: false,
        },
        ticks: {
          // Include a dollar sign in the ticks
          callback: function (value, index, values) {
            return numeral(value).format("0a");
          },
        },
      },
    ],
  },
};

const buildChartData = (data, casesType) => {
  let chartData = [];
  let lastDataPoint;
  for (let date in data.cases) {
    if (lastDataPoint) {
      let newDataPoint = {
        x: date,
        y: data[casesType][date] - lastDataPoint,
      };
      chartData.push(newDataPoint);
    }
    lastDataPoint = data[casesType][date];
  }
  return chartData;
};

function LineGraph({ casesType }) {
  const [data, setData] = useState({});
  const [bgColor, setBgColor] = useState('#b128467c');
  const [borderColor, setBorderColor] = useState('#D10A35');
  const changebgcolor = ()=> {
    if(casesType == 'recovered'){
      setBgColor(' #5fd87c5b')
   }else if(casesType == 'deaths'){
     setBgColor(' #6c757d5d')
   }else if(casesType == 'cases'){
     setBgColor('#b128467c')
   }
   return bgColor
  }
  const changeBorderColor = ()=> {
    if(casesType == 'recovered'){
      setBorderColor('#36bd55')
   }else if(casesType == 'deaths'){
      setBorderColor('#6C757D')
   }else if(casesType == 'cases'){
    setBorderColor('#D10A35')
  }
   return borderColor
  }
  useEffect(() => {
    const fetchData = async () => {
      await fetch("https://disease.sh/v3/covid-19/historical/all?lastdays=120")
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          let chartData = buildChartData(data, casesType);
          setData(chartData);
          console.log(chartData);
          // buildChart(chartData);
        });
    };

    fetchData();
  }, [casesType]);

  return (
    <div>
      {data?.length > 0 && (
        <Line
          data={{
            datasets: [
              {
                backgroundColor: changebgcolor,
                borderColor: changeBorderColor,
                borderWidth: 2,
                data: data,
              },
            ],
          }}
          options={options}
        />
      )}
    </div>
  );
}

export default LineGraph;