import OpenAI from 'openai';
import type { DeescalationScript, LegalCardContent, Jurisdiction, InteractionScenario } from '@/types';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Generate state-specific legal rights content
export async function generateLegalCard(
  jurisdiction: Jurisdiction,
  language: 'en' | 'es' = 'en'
): Promise<LegalCardContent['contentJson']> {
  const prompt = `Generate comprehensive legal rights information for ${jurisdiction} jurisdiction in ${language === 'es' ? 'Spanish' : 'English'}. 

Include:
1. Core constitutional rights during police interactions
2. State-specific laws and regulations
3. Clear dos and don'ts
4. Emergency contact numbers
5. Basic de-escalation phrases

Format as JSON with the following structure:
{
  "rights": ["right1", "right2", ...],
  "dosDonts": {
    "dos": ["do1", "do2", ...],
    "donts": ["dont1", "dont2", ...]
  },
  "keyLaws": ["law1", "law2", ...],
  "emergencyNumbers": ["911", "local_number", ...],
  "scripts": []
}

Keep it concise, accurate, and mobile-friendly. Focus on practical, actionable information.`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a legal expert specializing in civil rights and police interaction law. Provide accurate, up-to-date legal information that could help protect someone's rights during a police encounter."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 2000
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No content generated');
    }

    return JSON.parse(content);
  } catch (error) {
    console.error('Error generating legal card:', error);
    
    // Fallback content
    return {
      rights: [
        "You have the right to remain silent",
        "You have the right to refuse searches without a warrant",
        "You have the right to ask if you are free to leave",
        "You have the right to an attorney"
      ],
      dosDonts: {
        dos: [
          "Stay calm and polite",
          "Keep your hands visible",
          "Ask 'Am I free to leave?'",
          "Remember details for later"
        ],
        donts: [
          "Don't argue or resist",
          "Don't consent to searches",
          "Don't answer questions without a lawyer",
          "Don't make sudden movements"
        ]
      },
      keyLaws: [
        "Fourth Amendment - Protection against unreasonable searches",
        "Fifth Amendment - Right against self-incrimination",
        "Miranda Rights - Must be read upon arrest"
      ],
      emergencyNumbers: ["911", "ACLU Hotline: 877-328-2258"],
      scripts: []
    };
  }
}

// Generate context-aware de-escalation scripts
export async function generateDeescalationScript(
  scenario: InteractionScenario,
  language: 'en' | 'es' = 'en',
  isPremium: boolean = false
): Promise<DeescalationScript> {
  const scenarioDescriptions = {
    traffic_stop: 'during a traffic stop',
    street_questioning: 'when being questioned on the street',
    home_visit: 'when police visit your home',
    workplace_visit: 'when police visit your workplace',
    search_request: 'when police request to search you or your property',
    arrest_situation: 'during an arrest situation',
    checkpoint: 'at a police checkpoint',
    protest_or_demonstration: 'during a protest or demonstration',
    general_interaction: 'during a general police interaction'
  };

  const premiumNote = isPremium ? 
    "This is a premium script that has been reviewed by legal experts. Include more detailed, nuanced language and specific legal references." : 
    "This is a basic script. Keep it simple and straightforward.";

  const prompt = `Generate a de-escalation script for ${scenarioDescriptions[scenario]} in ${language === 'es' ? 'Spanish' : 'English'}.

${premiumNote}

The script should:
1. Be respectful and non-confrontational
2. Assert rights clearly but politely
3. De-escalate tension
4. Be easy to remember under stress
5. Include specific phrases to use

Provide a JSON response with:
{
  "script": "The actual script text with clear phrases",
  "context": "Brief explanation of when and how to use this script"
}

Keep the script concise but effective.`;

  try {
    const completion = await openai.chat.completions.create({
      model: isPremium ? "gpt-4" : "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an expert in conflict de-escalation and civil rights. Create scripts that help people communicate effectively with law enforcement while protecting their rights."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.2,
      max_tokens: 800
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No content generated');
    }

    const parsed = JSON.parse(content);
    
    return {
      id: `script_${Date.now()}`,
      scenario,
      language,
      script: parsed.script,
      context: parsed.context,
      isPremium
    };
  } catch (error) {
    console.error('Error generating de-escalation script:', error);
    
    // Fallback script
    const fallbackScripts = {
      en: {
        traffic_stop: {
          script: "Officer, I understand you're doing your job. I'm going to keep my hands visible and follow your instructions. I want to exercise my right to remain silent. Am I free to leave?",
          context: "Use this during traffic stops to assert your rights while remaining cooperative."
        },
        general_interaction: {
          script: "Officer, I want to be respectful. I'm exercising my right to remain silent. Am I being detained or am I free to leave?",
          context: "Use this for general interactions when you're unsure of the situation."
        }
      },
      es: {
        traffic_stop: {
          script: "Oficial, entiendo que está haciendo su trabajo. Voy a mantener mis manos visibles y seguir sus instrucciones. Quiero ejercer mi derecho a permanecer en silencio. ¿Soy libre de irme?",
          context: "Use esto durante paradas de tráfico para afirmar sus derechos mientras se mantiene cooperativo."
        },
        general_interaction: {
          script: "Oficial, quiero ser respetuoso. Estoy ejerciendo mi derecho a permanecer en silencio. ¿Estoy siendo detenido o soy libre de irme?",
          context: "Use esto para interacciones generales cuando no esté seguro de la situación."
        }
      }
    };

    const scriptKey = scenario in fallbackScripts[language] ? scenario : 'general_interaction';
    const fallback = fallbackScripts[language][scriptKey as keyof typeof fallbackScripts[typeof language]];

    return {
      id: `fallback_${Date.now()}`,
      scenario,
      language,
      script: fallback.script,
      context: fallback.context,
      isPremium
    };
  }
}

// Generate emergency alert message
export async function generateEmergencyMessage(
  location: { address?: string; latitude: number; longitude: number },
  userInfo: { name?: string; phone?: string },
  language: 'en' | 'es' = 'en'
): Promise<string> {
  const prompt = `Generate an emergency alert message in ${language === 'es' ? 'Spanish' : 'English'} for someone who has triggered an emergency alert during a police interaction.

Include:
- Clear emergency indicator
- Person's information: ${userInfo.name || 'Unknown name'}, ${userInfo.phone || 'No phone provided'}
- Location: ${location.address || `${location.latitude}, ${location.longitude}`}
- Current timestamp
- Instructions for the recipient
- App identification

Keep it urgent but clear, suitable for SMS/text message.`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are creating emergency alert messages that need to be clear, urgent, and actionable."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.1,
      max_tokens: 300
    });

    return completion.choices[0]?.message?.content || generateFallbackEmergencyMessage(location, userInfo, language);
  } catch (error) {
    console.error('Error generating emergency message:', error);
    return generateFallbackEmergencyMessage(location, userInfo, language);
  }
}

function generateFallbackEmergencyMessage(
  location: { address?: string; latitude: number; longitude: number },
  userInfo: { name?: string; phone?: string },
  language: 'en' | 'es'
): string {
  const locationText = location.address || `${location.latitude}, ${location.longitude}`;
  const userName = userInfo.name || 'Unknown';
  const timestamp = new Date().toLocaleString();

  if (language === 'es') {
    return `🚨 ALERTA DE EMERGENCIA 🚨\n\n${userName} ha activado una alerta de emergencia durante una interacción policial.\n\nUbicación: ${locationText}\nHora: ${timestamp}\n\nPor favor verifique su estado inmediatamente o contacte a las autoridades locales si es necesario.\n\nEste es un mensaje automatizado de la aplicación KnowYourRights Now.`;
  }

  return `🚨 EMERGENCY ALERT 🚨\n\n${userName} has triggered an emergency alert during a police interaction.\n\nLocation: ${locationText}\nTime: ${timestamp}\n\nPlease check on them immediately or contact local authorities if needed.\n\nThis is an automated message from KnowYourRights Now app.`;
}

// Analyze interaction context for better script recommendations
export async function analyzeInteractionContext(
  description: string,
  location?: { jurisdiction: string }
): Promise<{
  recommendedScenario: InteractionScenario;
  confidence: number;
  suggestions: string[];
}> {
  const prompt = `Analyze this police interaction description and provide recommendations:

Description: "${description}"
${location ? `Jurisdiction: ${location.jurisdiction}` : ''}

Determine:
1. Most likely scenario type
2. Confidence level (0-1)
3. Specific suggestions for handling this situation

Respond with JSON:
{
  "recommendedScenario": "scenario_type",
  "confidence": 0.85,
  "suggestions": ["suggestion1", "suggestion2", ...]
}

Available scenarios: traffic_stop, street_questioning, home_visit, workplace_visit, search_request, arrest_situation, checkpoint, protest_or_demonstration, general_interaction`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an expert in analyzing police interaction scenarios to provide appropriate guidance."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 500
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No content generated');
    }

    return JSON.parse(content);
  } catch (error) {
    console.error('Error analyzing interaction context:', error);
    
    // Fallback analysis
    return {
      recommendedScenario: 'general_interaction',
      confidence: 0.5,
      suggestions: [
        "Stay calm and polite",
        "Keep your hands visible",
        "Ask if you are free to leave",
        "Exercise your right to remain silent"
      ]
    };
  }
}

