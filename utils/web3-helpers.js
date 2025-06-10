// Web3.js v4 Helper Utilities
// Handle BigInt conversions for contract return values

/**
 * Convert BigInt values from Web3.js v4 contract calls to regular numbers
 * @param {BigInt|Number} value - The value to convert
 * @returns {Number} - Regular JavaScript number
 */
export const toNumber = (value) => {
  if (typeof value === 'bigint') {
    return Number(value);
  }
  return Number(value);
};

/**
 * Convert array of BigInt values to array of numbers
 * @param {Array} values - Array of BigInt values
 * @returns {Array<Number>} - Array of regular numbers
 */
export const arrayToNumbers = (values) => {
  return values.map(value => toNumber(value));
};

/**
 * Convert contract response object with BigInt values to regular numbers
 * @param {Object} contractResponse - Response from Web3.js contract call
 * @returns {Object} - Object with converted number values
 */
export const convertContractResponse = (contractResponse) => {
  const converted = {};
  
  for (const [key, value] of Object.entries(contractResponse)) {
    if (typeof value === 'bigint') {
      converted[key] = Number(value);
    } else if (Array.isArray(value)) {
      converted[key] = arrayToNumbers(value);
    } else {
      converted[key] = value;
    }
  }
  
  return converted;
};

/**
 * Format timestamp from BigInt to readable date
 * @param {BigInt|Number} timestamp - Unix timestamp
 * @returns {Object} - Formatted date object
 */
export const formatTimestamp = (timestamp) => {
  const numericTimestamp = toNumber(timestamp);
  const date = new Date(numericTimestamp * 1000);
  
  return {
    date: date.toLocaleDateString(),
    time: date.toLocaleTimeString(),
    timestamp: numericTimestamp,
    full: date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
  };
};

/**
 * Safe BigInt to string conversion for large numbers
 * @param {BigInt|Number} value - The value to convert
 * @returns {String} - String representation
 */
export const toString = (value) => {
  if (typeof value === 'bigint') {
    return value.toString();
  }
  return String(value);
};

/**
 * Check if value is BigInt
 * @param {any} value - Value to check
 * @returns {Boolean} - True if BigInt
 */
export const isBigInt = (value) => {
  return typeof value === 'bigint';
};

/**
 * Convert Web3.js v4 contract status response to usable format
 * @param {Array} contractDetail - Array from getStatus() call
 * @returns {Object} - Formatted contract status
 */
export const parseContractStatus = (contractDetail) => {
  return {
    manager: contractDetail[0],
    totalChoices: toNumber(contractDetail[1]),
    fromDate: toNumber(contractDetail[2]),
    endDate: toNumber(contractDetail[3]),
    completed: contractDetail[4],
    totalVotersVoted: toNumber(contractDetail[5]),
    title: contractDetail[6] || 'Untitled Voting'
  };
};

// Export all utilities
export default {
  toNumber,
  arrayToNumbers,
  convertContractResponse,
  formatTimestamp,
  toString,
  isBigInt,
  parseContractStatus
}; 