/**
 * vCard and WiFi string generators
 */

export const generateVCard = ({
  firstName = '',
  lastName = '',
  phone = '',
  email = '',
  org = '',
  title = '',
  url = '',
  note = ''
}) => {
  const fullName = `${firstName} ${lastName}`.trim() || 'Contact';
  return [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `N:${lastName};${firstName};;;`,
    `FN:${fullName}`,
    org ? `ORG:${org}` : '',
    title ? `TITLE:${title}` : '',
    phone ? `TEL;TYPE=CELL,VOICE:${phone}` : '',
    email ? `EMAIL;TYPE=PREF,INTERNET:${email}` : '',
    url ? `URL:${url}` : '',
    note ? `NOTE:${note}` : '',
    'END:VCARD'
  ].filter(Boolean).join('\n');
};

export const generateWiFi = ({ ssid = '', password = '', encryption = 'WPA', hidden = false }) => {
  const enc = encryption === 'nopass' ? 'nopass' : encryption;
  const h = hidden ? 'H:true;' : '';
  return `WIFI:S:${ssid};T:${enc};P:${password};${h};`;
};
