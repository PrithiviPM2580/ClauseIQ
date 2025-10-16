import { generateAIResponse } from '@/utils';

const detectContractType = async (contractText: string): Promise<string> => {
  const prompt = `
    Analyze the following contract text and determine the type of contract it is.
    Provide only the contract type as a single string (e.g., "Employment", "Non-Disclosure Agreement", "Sales", "Lease", etc.).
    Do not include any additional explanation or text.

    Contract text:
    ${contractText.substring(0, 2000)}
    `;

  const result = await generateAIResponse(prompt);

  return result;
};

export default detectContractType;
