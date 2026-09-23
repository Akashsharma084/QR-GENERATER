import QRCodeStyling from 'qr-code-styling';

/**
 * Builds and initializes a QRCodeStyling instance with customizable presets
 */
export const createQRCodeInstance = (options = {}) => {
  const {
    data = 'https://omni-qr.app',
    width = 260,
    height = 260,
    dotType = 'rounded',
    dotColor = '#6366f1',
    gradient = null, // { type: 'linear', rotation: 45, colorStops: [...] }
    cornerSquareType = 'extra-rounded',
    cornerSquareColor = '#4338ca',
    cornerDotType = 'dot',
    cornerDotColor = '#4338ca',
    bgColor = '#ffffff',
    logo = '',
    margin = 8
  } = options;

  const dotsOptions = {
    type: dotType
  };

  if (gradient && gradient.colorStops && gradient.colorStops.length > 1) {
    dotsOptions.gradient = {
      type: gradient.type || 'linear',
      rotation: gradient.rotation || 0,
      colorStops: gradient.colorStops
    };
  } else {
    dotsOptions.color = dotColor;
  }

  const qrConfig = {
    width,
    height,
    type: 'svg',
    data,
    margin,
    qrOptions: {
      typeNumber: 0,
      mode: 'Byte',
      errorCorrectionLevel: 'Q' // High redundancy to support center logos
    },
    imageOptions: {
      hideBackgroundDots: true,
      imageSize: 0.3,
      margin: 4,
      crossOrigin: 'anonymous'
    },
    dotsOptions,
    backgroundOptions: {
      color: bgColor
    },
    cornersSquareOptions: {
      type: cornerSquareType,
      color: cornerSquareColor || dotColor
    },
    cornersDotOptions: {
      type: cornerDotType,
      color: cornerDotColor || dotColor
    }
  };

  if (logo) {
    qrConfig.image = logo;
  }

  return new QRCodeStyling(qrConfig);
};

/**
 * Helper to download QR Code in requested format
 */
export const downloadQRCode = (qrCodeInstance, fileName = 'omni-qr', format = 'png') => {
  if (!qrCodeInstance) return;
  qrCodeInstance.download({
    name: fileName,
    extension: format
  });
};
