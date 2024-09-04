import axios from 'axios';

type EventData = {
  date: string;
  memo: string;
};

export const llmStory = async (eventsData: EventData[], contentsType: number): Promise<string> => {
  try {
    const response = await axios.post('https://zvhgtbs2iabsnxn6vkmqjxctza0mvhli.lambda-url.us-east-1.on.aws/', {
      eventsData,
      contentsType
    },{
      headers: {
          'Content-Type': 'application/json',
      }
    });

    const responses = response.data.choices?.[0]?.message?.content ?? '';

    if (!responses) {
      throw new Error('No response received from the LLM');
    }

    return responses;

  } catch (error) {
    console.error('Error generating LLM story:', error);
    throw error;
  }
};
