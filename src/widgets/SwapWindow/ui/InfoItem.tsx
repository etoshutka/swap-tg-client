import { Typography } from '@/shared/ui/Typography/Typography';
import styles from './TokenInfoBlock.module.scss';


interface InfoItemProps {
    label: string;
    value: string;
    className?: string;
  }
  
  const InfoItem: React.FC<InfoItemProps> = ({ label, value, className }) => (
    <div className={styles.infoItem}>
      <Typography.Text text={label} className={styles.label} />
      <Typography.Text text={value} className={`${styles.value} ${className || ''}`} />
    </div>
  );

export default InfoItem;