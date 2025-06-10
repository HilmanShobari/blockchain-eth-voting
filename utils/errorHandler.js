/**
 * Extract user-friendly error message from blockchain errors
 * @param {Error|string} error - The error object or message
 * @returns {object} - { message: string, details: string }
 */
const parseBlockchainError = (error) => {
  let errorMessage = '';
  let errorDetails = '';

  try {
    // Convert error to string if it's an object
    const errorString = typeof error === 'string' ? error : error.message || error.toString();
    errorDetails = errorString;

    // Extract execution reverted message
    const executionRevertedMatch = errorString.match(/execution reverted: "([^"]+)"/);
    if (executionRevertedMatch) {
      errorMessage = executionRevertedMatch[1];
      return { message: errorMessage, details: errorDetails };
    }

    // Extract reason from revert object
    const reasonMatch = errorString.match(/reason="([^"]+)"/);
    if (reasonMatch) {
      errorMessage = reasonMatch[1];
      return { message: errorMessage, details: errorDetails };
    }

    // Extract args from revert object (for Error(string) type)
    const argsMatch = errorString.match(/"args":\s*\[\s*"([^"]+)"/);
    if (argsMatch) {
      errorMessage = argsMatch[1];
      return { message: errorMessage, details: errorDetails };
    }

    // Check for common MetaMask errors
    if (errorString.includes('User denied transaction signature')) {
      errorMessage = 'Transaction was cancelled by user';
      return { message: errorMessage, details: errorDetails };
    }

    if (errorString.includes('insufficient funds')) {
      errorMessage = 'Insufficient funds for transaction';
      return { message: errorMessage, details: errorDetails };
    }

    if (errorString.includes('MetaMask is not installed')) {
      errorMessage = 'MetaMask wallet is not installed';
      return { message: errorMessage, details: errorDetails };
    }

    if (errorString.includes('No Ethereum provider')) {
      errorMessage = 'No wallet detected. Please install MetaMask.';
      return { message: errorMessage, details: errorDetails };
    }

    if (errorString.includes('network')) {
      errorMessage = 'Network connection error. Please check your connection.';
      return { message: errorMessage, details: errorDetails };
    }

    // If no specific pattern found, try to get a clean message
    if (errorString.includes('Error:')) {
      const cleanMatch = errorString.match(/Error:\s*(.+?)(?:\s*\(|$)/);
      if (cleanMatch) {
        errorMessage = cleanMatch[1].trim();
        return { message: errorMessage, details: errorDetails };
      }
    }

    // Fallback to shortened version
    errorMessage = errorString.length > 100 
      ? errorString.substring(0, 100) + '...' 
      : errorString;

  } catch (parseError) {
    console.error('Error parsing blockchain error:', parseError);
    errorMessage = 'An unexpected error occurred';
    errorDetails = error?.toString() || 'Unknown error';
  }

  return { message: errorMessage, details: errorDetails };
};

/**
 * Get user-friendly suggestions based on error type
 * @param {string} errorMessage - The parsed error message
 * @returns {string[]} - Array of suggestion strings
 */
const getErrorSuggestions = (errorMessage) => {
  const message = errorMessage.toLowerCase();

  if (message.includes('not allowed') || message.includes('not authorized')) {
    return [
      'Make sure you have permission to perform this action',
      'Check if voting is still active',
      'Verify you are using the correct wallet address',
      'Contact the voting administrator for access'
    ];
  }

  if (message.includes('insufficient funds')) {
    return [
      'Add more ETH to your wallet for gas fees',
      'Check your wallet balance',
      'Try reducing the gas price if possible',
      'Wait for network congestion to reduce'
    ];
  }

  if (message.includes('cancelled') || message.includes('denied')) {
    return [
      'Click "Confirm" in your wallet to proceed',
      'Make sure you want to complete this transaction',
      'Check the transaction details in your wallet',
      'Try the transaction again'
    ];
  }

  if (message.includes('metamask') || message.includes('wallet')) {
    return [
      'Install MetaMask browser extension',
      'Unlock your MetaMask wallet',
      'Connect your wallet to the website',
      'Refresh the page and try again'
    ];
  }

  if (message.includes('network') || message.includes('connection')) {
    return [
      'Check your internet connection',
      'Try switching to a different network',
      'Refresh the page',
      'Wait a moment and try again'
    ];
  }

  // Default suggestions
  return [
    'Make sure MetaMask is installed and unlocked',
    'Check your wallet connection',
    'Verify you\'re on the correct network',
    'Try refreshing the page'
  ];
};

// Export for ES6 modules (React components)
export { parseBlockchainError, getErrorSuggestions }; 