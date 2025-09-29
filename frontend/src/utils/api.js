// const BASE_URL = typeof process !== "undefined" && process.env && process.env.REACT_APP_BASE_URL 
//   ? process.env.REACT_APP_BASE_URL 
//   : 'http://localhost:4000';

// const makeRequest = async (url, options = {}) => {
//   const token = localStorage.getItem('token');
  
//   const config = {
//     headers: {
//       'Content-Type': 'application/json',
//       ...(token && { Authorization: `Bearer ${token}` }),
//       ...options.headers,
//     },
//     ...options,
//   };

//   const response = await fetch(`${BASE_URL}${url}`, config);
  
//   if (!response.ok) {
//     const errorData = await response.json().catch(() => ({}));
//     throw new Error(errorData.message || errorData.error || `HTTP error! status: ${response.status}`);
//   }
  
//   return response.json();
// };

// export const pollAPI = {
//   create: async (pollData) => {
//     return makeRequest('/api/polls', {
//       method: 'POST',
//       body: JSON.stringify(pollData),
//     });
//   },

//   getList: async (params = {}) => {
//     const searchParams = new URLSearchParams();
    
//     Object.entries(params).forEach(([key, value]) => {
//       if (value !== undefined && value !== null && value !== '') {
//         searchParams.append(key, value);
//       }
//     });
    
//     const queryString = searchParams.toString();
//     const url = `/api/polls/list${queryString ? `?${queryString}` : ''}`;
    
//     return makeRequest(url);
//   },

//   getById: async (pollId) => {
//     return makeRequest(`/api/polls/${pollId}`);
//   },

//   vote: async (pollId, selectedOption) => {
//     return makeRequest(`/api/polls/${pollId}/vote`, {
//       method: 'POST',
//       body: JSON.stringify({ selectedOption }),
//     });
//   },
// };

// export default pollAPI;


const BASE_URL = typeof process !== "undefined" && process.env && process.env.REACT_APP_BASE_URL 
  ? process.env.REACT_APP_BASE_URL 
  : 'http://localhost:4000';

const makeRequest = async (url, options = {}) => {
  const token = localStorage.getItem('token');
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  console.log('Making request to:', `${BASE_URL}${url}`);
  console.log('Request config:', config);

  try {
    const response = await fetch(`${BASE_URL}${url}`, config);
    
    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);
    
    // Check if response is JSON
    const contentType = response.headers.get('content-type');
    const isJson = contentType && contentType.includes('application/json');
    
    if (!response.ok) {
      let errorData = {};
      
      if (isJson) {
        try {
          errorData = await response.json();
        } catch (jsonError) {
          console.error('Error parsing error response JSON:', jsonError);
        }
      } else {
        // Handle non-JSON error responses
        const textResponse = await response.text();
        console.error('Non-JSON error response:', textResponse);
        errorData = { message: `HTTP ${response.status}: ${textResponse || response.statusText}` };
      }
      
      const errorMessage = errorData.message || errorData.error || `HTTP error! status: ${response.status}`;
      console.error('Request failed:', errorMessage, errorData);
      throw new Error(errorMessage);
    }
    
    if (isJson) {
      const data = await response.json();
      console.log('Response data:', data);
      return data;
    } else {
      const textData = await response.text();
      console.log('Response text:', textData);
      return textData;
    }
  } catch (error) {
    console.error('Request error:', error);
    
    // Handle network errors
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Network error: Unable to connect to the server. Please check your internet connection.');
    }
    
    // Re-throw other errors as-is
    throw error;
  }
};

export const pollAPI = {
  create: async (pollData) => {
    console.log('Creating poll with data:', pollData);
    return makeRequest('/api/polls', {
      method: 'POST',
      body: JSON.stringify(pollData),
    });
  },

  getList: async (params = {}) => {
    console.log('Fetching polls with params:', params);
    
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, value);
      }
    });
    
    const queryString = searchParams.toString();
    const url = `/api/polls/list${queryString ? `?${queryString}` : ''}`;
    
    return makeRequest(url);
  },

  getById: async (pollId) => {
    console.log('Fetching poll by ID:', pollId);
    return makeRequest(`/api/polls/${pollId}`);
  },

  vote: async (pollId, selectedOption) => {
    console.log('Submitting vote:', { pollId, selectedOption });
    
    // Ensure selectedOption is sent as the correct type
    const voteData = {
      selectedOption: selectedOption.toString() // Ensure it's a string
    };
    
    console.log('Vote payload:', voteData);
    
    try {
      const result = await makeRequest(`/api/polls/${pollId}/vote`, {
        method: 'POST',
        body: JSON.stringify(voteData),
      });
      
      console.log('Vote successful:', result);
      return result;
    } catch (error) {
      console.error('Vote failed:', error);
      
      // Provide more specific error messages for common voting issues
      if (error.message.includes('already voted')) {
        throw new Error('You have already voted on this poll.');
      } else if (error.message.includes('poll is closed')) {
        throw new Error('This poll is no longer accepting votes.');
      } else if (error.message.includes('invalid option')) {
        throw new Error('Invalid voting option selected.');
      } else if (error.message.includes('authentication')) {
        throw new Error('Please log in to vote on this poll.');
      } else if (error.message.includes('permission') || error.message.includes('authorized')) {
        throw new Error('You do not have permission to vote on this poll.');
      }
      
      // Re-throw the original error if no specific handling applies
      throw error;
    }
  },

  // Additional utility method to check if user has voted (if supported by backend)
  checkVoteStatus: async (pollId) => {
    console.log('Checking vote status for poll:', pollId);
    try {
      return makeRequest(`/api/polls/${pollId}/vote-status`);
    } catch (error) {
      console.log('Vote status check not supported or failed:', error);
      return { hasVoted: false, selectedOption: null };
    }
  }
};

export default pollAPI;