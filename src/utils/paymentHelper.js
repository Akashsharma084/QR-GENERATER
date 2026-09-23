/**
 * Payment URI & deep link utilities
 */

export const generatePaymentURI = ({
  method = 'upi',
  upiId = '',
  payeeName = '',
  amount = '',
  currency = 'INR',
  note = '',
  paypalHandle = '',
  stripeLink = '',
  cryptoType = 'BTC',
  cryptoAddress = ''
}) => {
  switch (method) {
    case 'upi': {
      if (!upiId) return '';
      const params = new URLSearchParams();
      params.append('pa', upiId.trim());
      if (payeeName) params.append('pn', payeeName.trim());
      if (amount && Number(amount) > 0) params.append('am', Number(amount).toFixed(2));
      params.append('cu', currency || 'INR');
      if (note) params.append('tn', note.trim());
      return `upi://pay?${params.toString()}`;
    }

    case 'paypal': {
      if (!paypalHandle) return '';
      const handle = paypalHandle.replace(/^@/, '').trim();
      const amt = amount && Number(amount) > 0 ? `/${amount}${currency !== 'USD' ? currency : ''}` : '';
      return `https://paypal.me/${handle}${amt}`;
    }

    case 'stripe': {
      if (!stripeLink) return '';
      return stripeLink.startsWith('http') ? stripeLink : `https://${stripeLink}`;
    }

    case 'crypto': {
      if (!cryptoAddress) return '';
      const prefix = cryptoType.toLowerCase();
      const amtParam = amount && Number(amount) > 0 ? `?amount=${amount}` : '';
      return `${prefix}:${cryptoAddress.trim()}${amtParam}`;
    }

    default:
      return '';
  }
};
