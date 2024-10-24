import React, { useState } from 'react';
import Image from 'next/image';
import { Typography } from '@/shared/ui/Typography/Typography';
import styles from './TokenInfoBlock.module.scss';
import { Token } from '@/entities/Wallet';
import InfoItem from './InfoItem';
import { CopyFillIcon } from '@/shared/assets/icons/CopyFillIcon';
import { useToasts } from '@/shared/lib/hooks/useToasts/useToasts';
import { SuccessFillIcon } from '@/shared/assets/icons/SuccessFillIcon';
import { Line, Bar } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  TimeScale, 
  LinearScale, 
  PointElement, 
  LineElement,
  BarElement,
  Title, 
  Tooltip, 
  Legend, 
  ChartOptions, 
  ChartData,
  ScaleOptions,
  TimeScaleOptions
} from 'chart.js';
import 'chartjs-adapter-date-fns';

ChartJS.register(
  TimeScale, 
  LinearScale, 
  PointElement, 
  LineElement,
  BarElement,
  Title, 
  Tooltip, 
  Legend
);

interface TokenInfoBlockProps {
  token: Token;
  tokenExtendedInfo: any;
  tokenImage: string;
  historicalData: { timestamp: string; price: number }[];
}

type FloatingBarData = [number, number];

interface ProcessedBarData {
  x: Date;
  prices: FloatingBarData;
  color: string;
}

interface ChartDataset extends ChartData<'bar'> {
  datasets: [{
    data: FloatingBarData[];
    backgroundColor: string[];
    borderColor: string;
    borderWidth: number;
    borderSkipped: boolean;
    barPercentage: number;
    categoryPercentage: number;
    base: number;
  }];
}

const TokenInfoBlock: React.FC<TokenInfoBlockProps> = ({ token, tokenExtendedInfo, tokenImage, historicalData }) => {
  const { successToast } = useToasts();
  const [chartType, setChartType] = useState<'line' | 'floating'>('line');
  const [timeRange, setTimeRange] = useState<'7d' | '30d'>('30d');

  const getPriceChangeClass = (value: number | undefined) => {
    if (value === undefined) return '';
    return value < 0 ? styles.negativeChange : styles.positiveChange;
  };

  const formatPriceChange = (value: number | undefined) => {
    if (value === undefined) return 'N/A';
    return `${value > 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  const handleOnCopy = () => {
    navigator.clipboard.writeText(token.contract ?? '');
    successToast('Copied', { icon: <SuccessFillIcon width={21} height={21} /> });
  };

  const getFilteredData = () => {
    const now = new Date();
    const ranges = {
      '1d': 1,
      '7d': 7,
      '30d': 30
    };
    const days = ranges[timeRange];
    const cutoff = new Date(now.getTime() - (days * 24 * 60 * 60 * 1000));
    return historicalData.filter(data => new Date(data.timestamp) >= cutoff);
  };

  const getOptimalYAxisRange = (prices: number[]) => {
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const padding = (max - min) * 0.1; // 10% padding
    return {
      min: min - padding,
      max: max + padding
    };
  };

 
  const prepareLineChartData = (): ChartData<'line'> => {
    const filteredData = getFilteredData();
    return {
      labels: filteredData.map(data => new Date(data.timestamp)),
      datasets: [{
        label: 'Price',
        data: filteredData.map(data => data.price),
        borderColor: 'rgb(128, 128, 128)',
        backgroundColor: 'rgba(128, 128, 128, 0.1)',
        borderWidth: 2,
        pointRadius: 0,
        fill: true,
        tension: 0.1,
      }]
    };
  };

  const prepareFloatingBarsData = (): ChartData<'bar'> => {
    const filteredData = getFilteredData();
    const minPrice = Math.min(...filteredData.map(d => d.price));
    
    const dates = filteredData.slice(0, -1).map(data => new Date(data.timestamp));
    const values = filteredData.slice(0, -1).map((data, index) => {
      const currentPrice = data.price;
      const nextPrice = filteredData[index + 1].price;
      return [currentPrice, nextPrice] as [number, number];
    });
    const colors = values.map(([current, next]) => 
      next > current ? 'rgba(76, 175, 80, 0.6)' : 'rgba(244, 67, 54, 0.6)'
    );
  
    return {
      labels: dates,
      datasets: [{
        data: values,
        backgroundColor: colors,
        borderColor: 'transparent',
        borderWidth: 0,
        borderSkipped: false,
        barPercentage: 0.9,
        categoryPercentage: 1,
        base: minPrice
      }]
    };
  };

  
  const baseOptions: ChartOptions<'line' | 'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        mode: 'nearest',
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        displayColors: false,
        titleFont: {
          size: 14,
        },
        bodyFont: {
          size: 13,
        },
        callbacks: {
          label: function(context) {
            if (chartType === 'floating' && Array.isArray(context.raw)) {
              const [start, end] = context.raw;
              const change = ((end - start) / start * 100);
              return [
                `Start: $${start.toFixed(2)}`,
                `End: $${end.toFixed(2)}`,
                `Change: ${change.toFixed(2)}%`
              ];
            }
            return `$${Number(context.raw).toFixed(2)}`;
          },
          title: function(tooltipItems) {
            if (tooltipItems[0].parsed.x) {
              return new Date(tooltipItems[0].parsed.x).toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
              });
            }
            return '';
          },
          labelColor: function() {
            return {
              borderColor: 'transparent',
              backgroundColor: 'transparent',
              borderWidth: 0
            };
          }
        }
      }
    },
    scales: {
      x: {
        type: 'time',
        display: false,
        time: {
          unit: 'day',
        },
        grid: {
          display: false,
        }
      },
      y: {
        type: 'linear',
        display: false,
        grid: {
          display: false,
        },
        beginAtZero: false,
      }
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    },
  };
  
  const commonOptions = baseOptions as ChartOptions<'line' | 'bar'>;
  
  return (
    <div className={styles.tokenInfoBlock}>
      <div className={styles.header}>
        <div className={styles.tokenIdentity}>
          <Image src={tokenImage} alt={token.symbol} width={40} height={40} className={styles.tokenIcon} />
          <div className={styles.tokenDetails}>
            <Typography.Text text={token.symbol} className={styles.tokenSymbol} />
            <Typography.Text text={`$${tokenExtendedInfo.price?.toFixed(6) || 'N/A'}`} className={styles.price} />
          </div>
        </div>
        <div className={styles.tokenPriceChange}>
          <Typography.Text 
            text={formatPriceChange(tokenExtendedInfo.percent_change_24h)}
            className={`${styles.priceChange} ${getPriceChangeClass(tokenExtendedInfo.percent_change_24h)}`}
          />
        </div>
      </div>
      
      <Typography.Text 
        text={token.contract || 'Address not available'} 
        className={styles.tokenAddress}
        onClick={handleOnCopy}
      />
      <CopyFillIcon 
        className={styles.copyIcon} 
        onClick={handleOnCopy}
      />

      <div className={styles.chartControls}>
        <div className={styles.chartTypeButtons}>
          <button 
            className={`${styles.chartButton} ${chartType === 'line' ? styles.active : ''}`}
            onClick={() => setChartType('line')}
          >
            Line
          </button>
          <button 
            className={`${styles.chartButton} ${chartType === 'floating' ? styles.active : ''}`}
            onClick={() => setChartType('floating')}
          >
            Bars
          </button>
        </div>
        <div className={styles.timeRangeButtons}>
          <button 
            className={`${styles.timeButton} ${timeRange === '7d' ? styles.active : ''}`}
            onClick={() => setTimeRange('7d')}
          >
            7D
          </button>
          <button 
            className={`${styles.timeButton} ${timeRange === '30d' ? styles.active : ''}`}
            onClick={() => setTimeRange('30d')}
          >
            30D
          </button>
        </div>
      </div>
      
      <div className={styles.chartContainer}>
        {historicalData && historicalData.length > 0 ? (
          chartType === 'line' ? (
            <Line 
              data={prepareLineChartData()} 
              options={commonOptions} 
            />
          ) : (
            <Bar 
              data={prepareFloatingBarsData()} 
              options={commonOptions}
            />
          )
        ) : (
          <Typography.Text text="No historical data available" />
        )}
      </div>
      
      <div className={styles.infoGrid}>
        <InfoItem label="Total Supply" value={tokenExtendedInfo.total_supply?.toLocaleString() || 'N/A'} />
        <InfoItem label="Max Supply" value={tokenExtendedInfo.max_supply?.toLocaleString() || 'N/A'} />
        <InfoItem label="Market Cap" value={`$${tokenExtendedInfo.market_cap?.toLocaleString() || 'N/A'}`} />
        <InfoItem 
          label="24h Change" 
          value={formatPriceChange(tokenExtendedInfo.percent_change_24h)}
          className={getPriceChangeClass(tokenExtendedInfo.percent_change_24h)}
        />
        <InfoItem 
          label="7d Change" 
          value={formatPriceChange(tokenExtendedInfo.percent_change_7d)}
          className={getPriceChangeClass(tokenExtendedInfo.percent_change_7d)}
        />
        <InfoItem
          label="30d Change" 
          value={formatPriceChange(tokenExtendedInfo.percent_change_30d)}
          className={getPriceChangeClass(tokenExtendedInfo.percent_change_30d)}
        />
      </div>
    </div>
  );
};

export default TokenInfoBlock;