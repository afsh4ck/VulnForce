'use server';

/**
 * @fileOverview This file imports all the Genkit flows that will be available in the application.
 *
 * - generateFindingTemplates - An AI agent for generating finding templates.
 * - translateText - An AI agent for translating text between languages.
 */

import '@/ai/flows/generate-finding-templates.ts';
import '@/ai/flows/translate-text-flow.ts';
