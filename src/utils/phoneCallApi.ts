
import axios from 'axios';

const BLAND_AI_API_KEY = 'org_85d4c78a825687942dd8a681be965e93a9b8197ed045696d4069f918a44290a3fd42ee42ffa9b0fd43ea69';

interface PhoneCallData {
  phone_number: string;
  task: string;
  voice?: string;
  max_duration?: number;
  language?: string;
}

export const makePhoneCall = async (callData: PhoneCallData) => {
  const headers = {
    'Authorization': BLAND_AI_API_KEY,
    'Content-Type': 'application/json'
  };

  const data = {
    phone_number: callData.phone_number,
    voice: callData.voice || "June",
    wait_for_greeting: false,
    record: true,
    answered_by_enabled: true,
    noise_cancellation: false,
    interruption_threshold: 100,
    block_interruptions: false,
    max_duration: callData.max_duration || 12,
    model: "base",
    language: callData.language || "en",
    background_track: "none",
    endpoint: "https://api.bland.ai",
    voicemail_action: "ignore",
    task: callData.task
  };

  try {
    const response = await axios.post('https://api.bland.ai/v1/calls', data, { headers });
    return response.data;
  } catch (error) {
    console.error('Phone call API error:', error);
    throw error;
  }
};
