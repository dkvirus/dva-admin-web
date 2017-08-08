import React from 'react';
import styles from './Footer.less';
import { config } from '../../utils/index';

const Footer = () => <div className={styles.footer}>
  {config.footerText}
</div>;

export default Footer;
