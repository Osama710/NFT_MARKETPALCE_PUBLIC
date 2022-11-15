import React from 'react';
import {displayAddress} from '../../utils/converters';

const Address = ({ address, long }) => {
  const [copied, setCopied] = React.useState(false)

  React.useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 1500);

      return () => clearTimeout(timer);
    }
  }, [copied]);

  if (!address) {
    return null;
  }

  const copyToClipboard = (str) => {
    navigator.clipboard.writeText(str);
    setCopied(true);
  };

  return (
    <a onClick={() => copyToClipboard(address)} className={'d-flex align-items-center text-white'}>
      {displayAddress(address, long)}&nbsp;

      <i className={`${copied ? 'text-success ri-checkbox-multiple-fill' : 'text-white ri-checkbox-multiple-blank-fill'}`} />
    </a>
  );
};

export default Address;
