import axios from 'axios';

type EventData = {
  date: string;
  memo: string;
};

export const llmStory = async (eventsData: EventData[], contentsType: number): Promise<string> => {
  try {
    const response = await axios.post('http://localhost:3000/api/openai', {
      eventsData,
      contentsType
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
