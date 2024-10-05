import React from 'react';
import Image from 'next/image';
import { Typography } from '@/shared/ui/Typography/Typography';
import styles from './TokenInfoBlock.module.scss';
import { Token } from '@/entities/Wallet';
import InfoItem from './InfoItem';
import { CopyFillIcon } from '@/shared/assets/icons/CopyFillIcon';
import { useToasts } from '@/shared/lib/hooks/useToasts/useToasts';
import { SuccessFillIcon } from '@/shared/assets/icons/SuccessFillIcon';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, TimeScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import 'chartjs-adapter-date-fns';

ChartJS.register(TimeScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);


interface TokenInfoBlockProps {
    token: Token;
    tokenExtendedInfo: any;
    tokenImage: string;
    historicalData: { timestamp: string; price: number }[];
}

  const TokenInfoBlock: React.FC<TokenInfoBlockProps> = ({ token, tokenExtendedInfo, tokenImage, historicalData }) => {
    const { successToast } = useToasts();

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

      const chartData = {
        datasets: [
          {
            label: 'Price',
            data: historicalData.map(data => ({
              x: new Date(data.timestamp),
              y: data.price
            })),
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
          }
        ]
      };
    
      const chartOptions = {
        responsive: true,
        plugins: {
          legend: {
            position: 'top' as const,
          },
          title: {
            display: true,
            text: 'Price History',
          },
        },
        scales: {
          x: {
            type: 'time' as const,
            time: {
              unit: 'day' as const
            },
            title: {
              display: true,
              text: 'Date'
            }
          },
          y: {
            type: 'linear' as const,
            title: {
              display: true,
              text: 'Price (USD)'
            }
          }
        }
      };
    
  
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
          onClick={() => handleOnCopy()}
        />
        <CopyFillIcon 
            className={styles.copyIcon} 
            onClick={() => handleOnCopy()}
        />
        
        <div className={styles.chartPlaceholder}>
        {historicalData && historicalData.length > 0 ? (
          <Line data={chartData} options={chartOptions} />
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