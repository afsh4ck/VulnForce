'use server';

/**
 * @fileOverview An AI agent for generating finding templates based on provided data.
 *
 * - generateFindingTemplates - A function that generates finding templates.
 * - GenerateFindingTemplatesInput - The input type for the generateFindingTemplates function.
 * - GenerateFindingTemplatesOutput - The return type for the generateFindingTemplates function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateFindingTemplatesInputSchema = z.object({
  previousFindings: z.string().describe('A string containing previous findings data.'),
  currentFindingDetails: z.string().describe('Details about the current finding for context.'),
});
export type GenerateFindingTemplatesInput = z.infer<typeof GenerateFindingTemplatesInputSchema>;

const GenerateFindingTemplatesOutputSchema = z.object({
  descriptionSuggestion: z.string().describe('Suggested text for the description section.'),
  riskSuggestion: z.string().describe('Suggested text for the risk section.'),
  mitigationSuggestion: z.string().describe('Suggested text for the mitigation section.'),
});
export type GenerateFindingTemplatesOutput = z.infer<typeof GenerateFindingTemplatesOutputSchema>;

export async function generateFindingTemplates(
  input: GenerateFindingTemplatesInput
): Promise<GenerateFindingTemplatesOutput> {
  return generateFindingTemplatesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateFindingTemplatesPrompt',
  input: {schema: GenerateFindingTemplatesInputSchema},
  output: {schema: GenerateFindingTemplatesOutputSchema},
  prompt: `You are an AI assistant that specializes in generating templates for pentesting findings.

  Based on previous findings and the details of the current finding, suggest content for the description, risk, and mitigation sections.

  Previous Findings:
  {{previousFindings}}

  Current Finding Details:
  {{currentFindingDetails}}

  Consider the previous findings and the current finding details to generate the text for descriptionSuggestion, riskSuggestion, and mitigationSuggestion.
  The generated text must be tailored for use in a pentesting report.
  Return a JSON formatted object with descriptionSuggestion, riskSuggestion, and mitigationSuggestion fields.
  `,
});

const generateFindingTemplatesFlow = ai.defineFlow(
  {
    name: 'generateFindingTemplatesFlow',
    inputSchema: GenerateFindingTemplatesInputSchema,
    outputSchema: GenerateFindingTemplatesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);