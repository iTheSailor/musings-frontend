import React from 'react';
import { Segment, Grid, Header, Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, TimeScale } from 'chart.js';
import 'chartjs-adapter-date-fns';
import zoomPlugin from 'chartjs-plugin-zoom';

// Register the components for Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, TimeScale, zoomPlugin);


const StockAnalysis = ({ priceHistory, range, interval, setRange, setInterval }) => {
    const dates = Object.keys(priceHistory);
    const closes = dates.map(date => priceHistory[date].Close);
    const opens = dates.map(date => priceHistory[date].Open);
    const highs = dates.map(date => priceHistory[date].High);
    const lows = dates.map(date => priceHistory[date].Low);
    const volumes = dates.map(date => priceHistory[date].Volume);

    const data = {
        labels: dates,
        datasets: [
            {
                label: 'Close Price',
                data: closes,
                fill: false,
                backgroundColor: 'rgba(75,192,192,0.4)',
                borderColor: 'rgba(75,192,192,1)',
                tension: 0.1,
                yAxisID: 'y',
            },
            {
                label: 'Open Price',
                data: opens,
                fill: false,
                backgroundColor: 'rgba(153,102,255,0.4)',
                borderColor: 'rgba(153,102,255,1)',
                tension: 0.1,
                yAxisID: 'y',
            },
            {
                label: 'High Price',
                data: highs,
                fill: false,
                backgroundColor: 'rgba(255,159,64,0.4)',
                borderColor: 'rgba(255,159,64,1)',
                tension: 0.1,
                yAxisID: 'y',
            },
            {
                label: 'Low Price',
                data: lows,
                fill: false,
                backgroundColor: 'rgba(255,99,132,0.4)',
                borderColor: 'rgba(255,99,132,1)',
                tension: 0.1,
                yAxisID: 'y',
            },
            {
                label: 'Volume',
                data: volumes,
                type: 'bar',
                backgroundColor: 'rgba(54,162,235,0.5)',
                borderColor: 'rgba(54,162,235,1)',
                yAxisID: 'y1',
            }
        ],
    };

    const options = {
        responsive: true,
        scales: {
            x: {
                type: 'time',
                time: {
                    unit: interval === '1m' || interval === '5m' || interval === '15m' || interval === '30m' || interval === '1h' ? 'minute' :
                          interval === '1d' ? 'day' :
                          interval === '1wk' ? 'week' :
                          'month', // default to month
                },
                min: new Date(dates[0]).getTime(),
                max: new Date(dates[dates.length - 1]).getTime(),
            },
            y: {
                type: 'linear',
                display: true,
                position: 'left',
                min: Math.min(...lows) * 0.9,
                max: Math.max(...highs) * 1.1,
                ticks: {
                    beginAtZero: true,
                },
            },
            y1: {
                type: 'linear',
                display: true,
                position: 'right',
                min: 0,
                max: Math.max(...volumes) * 1.2,
                grid: {
                    drawOnChartArea: false,
                },
            },
        },
        plugins: {
            zoom: {
                limits: {
                    x: {
                        min: new Date(dates[0]).getTime(),
                        max: new Date(dates[dates.length - 1]).getTime(),
                        minRange: 1000 * 60 * 60 * 24, // 1 day in milliseconds
                        maxRange: 1000 * 60 * 60 * 24 * 30, // 30 days in milliseconds
                    },
                    y: {
                        min: Math.min(...lows) * 0.9,
                        max: Math.max(...highs) * 1.1,
                    },
                    y1: {
                        min: 0,
                        max: Math.max(...volumes) * 1.1,
                    },
                },
                pan: {
                    enabled: true,
                    mode: 'x',
                    threshold: 5,
                },
                zoom: {
                    wheel: {
                        enabled: true,
                    },
                    pinch: {
                        enabled: true,
                    },
                    mode: 'x',
                },
            },
        },
    };

    return (
        <Segment>
            <Grid columns={2}>
                <Grid.Column textAlign='left'>
                    <Header as='h2'>Price History</Header>
                </Grid.Column>
                <Grid.Column floated='right'>
                    <Button.Group floated='right' size='mini'>
                        <Button active={range === '1d'} onClick={() => setRange('1d')}>Day</Button>
                        <Button active={range === '5d'} onClick={() => setRange('5d')}>Week</Button>
                        <Button active={range === '1mo'} onClick={() => setRange('1mo')}>Month</Button>
                        <Button active={range === '3mo'} onClick={() => setRange('3mo')}>3M</Button>
                        <Button active={range === '6mo'} onClick={() => setRange('6mo')}>6M</Button>
                        <Button active={range === '1y'} onClick={() => setRange('1y')}>1Y</Button>
                        <Button active={range === '5y'} onClick={() => setRange('5y')}>5Y</Button>
                        <Button active={range === 'max'} onClick={() => setRange('max')}>Max</Button>
                    </Button.Group>
                    <Button.Group floated='right' size='mini' toggle>
                        <Button active={interval === '1m'} disabled={range !== '1d' && range !== '5d'} onClick={() => setInterval('1m')}>1m</Button>
                        <Button active={interval === '5m'} disabled={range !== '1d' && range !== '5d'} onClick={() => setInterval('5m')}>5m</Button>
                        <Button active={interval === '15m'} disabled={range !== '1d' && range !== '5d'} onClick={() => setInterval('15m')}>15m</Button>
                        <Button active={interval === '30m'} disabled={range !== '1d' && range !== '5d'} onClick={() => setInterval('30m')}>30m</Button>
                        <Button active={interval === '1h'} disabled={range !== '1d' && range !== '5d' && range !== '1mo'} onClick={() => setInterval('1h')}>1h</Button>
                        <Button active={interval === '1d'} onClick={() => setInterval('1d')}>1d</Button>
                        <Button active={interval === '1wk' } disabled={ range!== '1mo' && range !== '3mo' && range !== '6mo' && range !=='1y' && range !== '5y' && range !== 'max'} onClick={() => setInterval('1wk')}>1w</Button>
                        <Button active={interval === '1mo'} disabled={range !== '3mo' && range !== '6mo' && range !=='1y' && range !== '5y' && range !== 'max' }onClick={() => setInterval('1mo')}>1mo</Button>
                    </Button.Group>
                </Grid.Column>
            </Grid>
            <br />
            <Line data={data} options={options} />
        </Segment>
    );
};

StockAnalysis.propTypes = {
    priceHistory: PropTypes.object.isRequired,
    range: PropTypes.string.isRequired,
    interval: PropTypes.string.isRequired,
    setRange: PropTypes.func.isRequired,
    setInterval: PropTypes.func.isRequired,
};

export default StockAnalysis;
