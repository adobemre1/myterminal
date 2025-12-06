
import { GoogleGenAI, Schema, Type } from "@google/genai";
import { SupportedLanguage, GeneratedProject, OrchestraRole, LibraryDefinition, LessonContent, PythonPackage, NpmPackage, UniversalPackage } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// --- AGENT PERSONAS ---

const PERSONA_ARCHITECT = `
You are the **Chief Architect**.
Your goal: Design a robust, scalable, and standard-compliant folder structure.
Focus: Separation of concerns, modularity, and global best practices (Clean Architecture).
Output: JSON structure only. No code implementation yet.
`;

const PERSONA_DEVELOPER = `
You are a **Senior Developer**.
Your goal: Implement production-ready code for the provided architecture.
Focus: Error handling, typing (PEP8/ESLint), comments, and performance.
Output: Full source code for every file.
`;

const PERSONA_QA = `
You are a **QA & Security Engineer**.
Your goal: Review code for bugs, security vulnerabilities, and missing dependencies.
Focus: Self-healing. If you find errors, you must fix them in the final output.
`;

const PERSONA_REFACTOR = `
You are a **Code Optimization Expert**.
Your goal: Analyze the provided code snippet and user instruction.
Action: Rewrite the code to be cleaner, faster, or fixed based on the instruction.
Output: ONLY the new code block. No markdown fencing around it if possible, just the raw code replacement.
`;

const PERSONA_SENTINEL = `
You are the **System Sentinel**.
Your goal: Analyze the user's request for a technology that is NOT in the database.
Action: Research the requested technology (assume access to global knowledge up to current date).
Output: A strict JSON 'ModelFile' definition that allows the rest of the system to use this technology effectively.
`;

const PERSONA_PROFESSOR = `
You are **Professor Code**, a world-class computer science educator.
Your goal: Create high-quality, W3Schools-style educational content.
Style: Clear, concise, professional, structured.
Output: JSON containing HTML for the article and a raw string for the runnable code example.
`;

const PERSONA_LIBRARIAN = `
You are the **Global Python Librarian**.
Your goal: Provide accurate, up-to-date information about Python packages (PyPI).
Focus: License compliance (MIT/Apache), Security Scores, and Dependency trees.
Output: Strict JSON matching the PythonPackage schema.
`;

const PERSONA_NPM_EXPERT = `
You are the **Node.js Ecosystem Expert**.
Your goal: Provide accurate data about NPM packages.
Focus: TypeScript definitions (@types), Weekly Downloads, Peer Dependencies, and License.
Output: Strict JSON matching the NpmPackage schema.
`;

const PERSONA_UNIVERSAL_REGISTRY = `
You are the **Universal Package Registry Interface**.
Your goal: Simulate the API of ANY package manager (Maven, Crates.io, RubyGems, Packagist, Nuget, etc.).
Input: User will provide a language/ecosystem and a query.
Output: Accurate JSON data mimicking the real registry for that language.
`;

const PERSONA_SYSTEM_REWRITER = `
You are the **Meta-Architect (System Rewriter)**.
Your goal: Rewrite the entire source code of THIS application (OmniCode Studio) into a different technology stack.
Context: Currently it is React+TypeScript. The user will ask for a target (e.g., Rust+Tauri, Go+HTMX, Vue+Vite).
Output: A complete JSON file structure for the NEW implementation.
`;

// --- SCHEMAS ---

const pythonPackageSchema: Schema = {
    type: Type.OBJECT,
    properties: {
        name: { type: Type.STRING },
        version: { type: Type.STRING },
        summary: { type: Type.STRING },
        author: { type: Type.STRING },
        description: { type: Type.STRING, description: "Detailed description in Markdown format." },
        installCmd: { type: Type.STRING },
        health: {
            type: Type.OBJECT,
            properties: {
                score: { type: Type.NUMBER },
                securityIssues: { type: Type.NUMBER },
                lastRelease: { type: Type.STRING },
                license: { type: Type.STRING },
                popularity: { type: Type.STRING, enum: ["High", "Medium", "Low"] }
            }
        },
        tags: { type: Type.ARRAY, items: { type: Type.STRING } },
        dependencies: { type: Type.ARRAY, items: { type: Type.STRING } }
    },
    required: ["name", "version", "summary", "health", "installCmd"]
};

const npmPackageSchema: Schema = {
    type: Type.OBJECT,
    properties: {
        name: { type: Type.STRING },
        version: { type: Type.STRING },
        description: { type: Type.STRING },
        author: { type: Type.STRING },
        keywords: { type: Type.ARRAY, items: { type: Type.STRING } },
        downloads: { type: Type.STRING, description: "e.g. '5.4M/week'" },
        license: { type: Type.STRING },
        health: {
             type: Type.OBJECT,
             properties: {
                score: { type: Type.NUMBER },
                securityIssues: { type: Type.NUMBER },
                lastRelease: { type: Type.STRING },
                license: { type: Type.STRING },
                popularity: { type: Type.STRING }
            }
        },
        installCmd: { type: Type.STRING },
        peerDependencies: { type: Type.ARRAY, items: { type: Type.STRING } }
    },
    required: ["name", "version", "downloads", "installCmd"]
};

const universalPackageSchema: Schema = {
    type: Type.OBJECT,
    properties: {
        language: { type: Type.STRING },
        registry: { type: Type.STRING },
        name: { type: Type.STRING },
        version: { type: Type.STRING },
        description: { type: Type.STRING },
        installCmd: { type: Type.STRING },
        stats: {
            type: Type.OBJECT,
            properties: {
                downloads: { type: Type.STRING },
                stars: { type: Type.STRING }
            }
        },
        health: {
             type: Type.OBJECT,
             properties: {
                score: { type: Type.NUMBER },
                securityIssues: { type: Type.NUMBER },
                lastRelease: { type: Type.STRING },
                license: { type: Type.STRING },
                popularity: { type: Type.STRING }
            }
        }
    },
    required: ["language", "registry", "name", "version", "installCmd"]
};

const lessonSchema: Schema = {
    type: Type.OBJECT,
    properties: {
        title: { type: Type.STRING },
        htmlContent: { type: Type.STRING, description: "The HTML article. Use <h2>, <p>, <ul>, <li>, <code> tags. style with Tailwind classes like 'text-blue-400', 'bg-gray-800' etc." },
        runnableCode: { type: Type.STRING, description: "A complete, runnable script demonstrating the concept." }
    },
    required: ["title", "htmlContent", "runnableCode"]
};

// 1. Architecture Phase Schema
const architectureSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING },
    description: { type: Type.STRING },
    architecture_plan: { type: Type.STRING },
    proposed_files: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: "File path" },
          purpose: { type: Type.STRING, description: "What this file does" }
        },
        required: ["name", "purpose"]
      }
    }
  },
  required: ["title", "description", "architecture_plan", "proposed_files"]
};

// 2. Implementation Phase Schema (Full Code)
const implementationSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    files: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          language: { type: Type.STRING },
          content: { type: Type.STRING }
        },
        required: ["name", "language", "content"]
      }
    }
  },
  required: ["files"]
};

// 3. ModelFile Generation Schema
const modelFileSchema: Schema = {
    type: Type.OBJECT,
    properties: {
        name: { type: Type.STRING, description: "Official name, e.g., 'Bun.js'" },
        description: { type: Type.STRING, description: "Short, high-impact description." },
        language: { type: Type.STRING, description: "Closest SupportedLanguage enum value" },
        icon: { type: Type.STRING, description: "A representative emoji" },
        specializedPrompt: { type: Type.STRING, description: "A highly detailed System Instruction for an Agent to become an expert in this." }
    },
    required: ["name", "description", "language", "icon", "specializedPrompt"]
}

// --- API METHODS ---

export const agentSearchPyPi = async (query: string): Promise<PythonPackage> => {
    const prompt = `Search PyPI for the python package: "${query}". Provide real metadata.`;

    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: {
            systemInstruction: PERSONA_LIBRARIAN,
            responseMimeType: "application/json",
            responseSchema: pythonPackageSchema,
            temperature: 0.1
        }
    });

    return JSON.parse(response.text || "{}");
}

export const agentSearchNpm = async (query: string): Promise<NpmPackage> => {
    const prompt = `Search the NPM registry for the package: "${query}". 
    Provide real stats like weekly downloads, peer dependencies, and license.
    Estimate health score based on Snyk/OpenSSF standards.`;

    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: {
            systemInstruction: PERSONA_NPM_EXPERT,
            responseMimeType: "application/json",
            responseSchema: npmPackageSchema,
            temperature: 0.1
        }
    });

    return JSON.parse(response.text || "{}");
}

export const agentSearchUniversalRegistry = async (language: string, query: string): Promise<UniversalPackage> => {
    const prompt = `
    Act as the official registry for language: "${language}". 
    Search for package: "${query}".
    Determine the correct registry name (e.g. Maven, Crates.io, Packagist, RubyGems, Packagist, Nuget, etc.).
    Provide realistic install commands (e.g. 'cargo add', 'composer require').
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: {
            systemInstruction: PERSONA_UNIVERSAL_REGISTRY,
            responseMimeType: "application/json",
            responseSchema: universalPackageSchema,
            temperature: 0.1
        }
    });

    return JSON.parse(response.text || "{}");
}

export const agentGenerateLesson = async (topicPrompt: string): Promise<LessonContent> => {
    const prompt = `
    Create a detailed lesson about: "${topicPrompt}".
    
    Requirements:
    1. Explain the concept clearly (History, Why, How).
    2. Use HTML for the content part. Use Tailwind CSS classes for styling.
    3. Provide a 'runnableCode' string that is a perfect example of this concept.
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: {
            systemInstruction: PERSONA_PROFESSOR,
            responseMimeType: "application/json",
            responseSchema: lessonSchema,
            temperature: 0.3
        }
    });

    return JSON.parse(response.text || "{}");
}

export const agentGenerateModelFile = async (techName: string): Promise<LibraryDefinition> => {
    const prompt = `
    The user wants to use a technology called "${techName}" which is currently missing from your database.
    Create a 'ModelFile' definition for it.
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: {
            systemInstruction: PERSONA_SENTINEL,
            responseMimeType: "application/json",
            responseSchema: modelFileSchema,
            temperature: 0.5
        }
    });

    const data = JSON.parse(response.text || "{}");
    
    return {
        id: techName.toLowerCase().replace(/\s+/g, '-'),
        name: data.name,
        category: 'Emerging_Tech',
        description: data.description,
        icon: data.icon || "🚀",
        language: data.language as SupportedLanguage || SupportedLanguage.MARKDOWN,
        specializedPrompt: data.specializedPrompt,
        isGenerated: true
    };
}

// --- SYSTEM REWRITER ---
export const agentRewriteSystem = async (targetStack: string): Promise<GeneratedProject> => {
    const prompt = `
    REWRITE OMNICODE STUDIO.
    Target Stack: ${targetStack}.
    The user wants a full rebuild of this application logic (IDE, Sidebar, Agent, Terminal) in the new stack.
    Include all necessary configuration files (Cargo.toml, go.mod, etc.).
    `;

    // 1. Architecture
    const archResponse = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: {
            systemInstruction: PERSONA_SYSTEM_REWRITER,
            responseMimeType: "application/json",
            responseSchema: architectureSchema,
            temperature: 0.3
        }
    });
    
    const archData = JSON.parse(archResponse.text || "{}");

    // 2. Implementation
    const implResponse = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Implement the architecture: ${JSON.stringify(archData)}`,
        config: {
            systemInstruction: PERSONA_SYSTEM_REWRITER,
            responseMimeType: "application/json",
            responseSchema: implementationSchema,
            temperature: 0.1
        }
    });

    const implData = JSON.parse(implResponse.text || "{}");

    return {
        id: crypto.randomUUID(),
        title: `OmniCode (${targetStack})`,
        description: `Full rewrite of OmniCode Studio in ${targetStack}`,
        architecture_plan: archData.architecture_plan,
        files: implData.files,
        tasks: [],
        testSuites: [],
        problems: [],
        createdAt: Date.now(),
        modelContext: `System Rewrite: ${targetStack}`
    };
};

// --- VISION TO CODE (v6.0) ---
export const agentVisionToCode = async (imageBase64: string): Promise<GeneratedProject> => {
    const prompt = `
    Analyze this UI screenshot.
    Generate a complete HTML/Tailwind CSS project that replicates this design pixel-perfectly.
    Include a 'README.md' explaining what was detected.
    `;

    const imagePart = {
        inlineData: {
            mimeType: 'image/png',
            data: imageBase64
        }
    };
    
    // 1. Architecture Phase
    const archResponse = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: {
            parts: [imagePart, { text: prompt + " PHASE 1: Architecture JSON" }]
        },
        config: {
            systemInstruction: PERSONA_ARCHITECT,
            responseMimeType: "application/json",
            responseSchema: architectureSchema
        }
    });
    const archData = JSON.parse(archResponse.text || "{}");

    // 2. Implementation Phase
    const implResponse = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: {
            parts: [imagePart, { text: `Implement this architecture: ${JSON.stringify(archData)}` }]
        },
        config: {
            systemInstruction: PERSONA_DEVELOPER,
            responseMimeType: "application/json",
            responseSchema: implementationSchema
        }
    });
    const implData = JSON.parse(implResponse.text || "{}");

    return {
        id: crypto.randomUUID(),
        title: "Vision Import",
        description: "Generated from Image Drop",
        architecture_plan: archData.architecture_plan,
        files: implData.files,
        tasks: [],
        testSuites: [],
        problems: [],
        createdAt: Date.now(),
        modelContext: "Vision-to-Code"
    };
}

// --- SMART REFACTORING (v7.0) ---
export const agentSmartRefactor = async (code: string, instruction: string, language: string): Promise<string> => {
    const prompt = `
    LANGUAGE: ${language}
    CODE:
    ${code}
    
    INSTRUCTION: ${instruction}
    
    Return ONLY the updated code block.
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash', // Fast model for refactoring
        contents: prompt,
        config: {
            systemInstruction: PERSONA_REFACTOR,
            temperature: 0.1
        }
    });

    return response.text?.replace(/```[\w]*\n/g, '').replace(/\n```/g, '').trim() || code;
}

export const agentExplainCode = async (code: string): Promise<string> => {
    const prompt = `
    EXPLAIN THIS CODE:
    ${code}
    
    Provide a concise, developer-focused explanation of what this code does.
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            systemInstruction: "You are a Senior Developer explaining code to a junior colleague.",
            temperature: 0.2
        }
    });

    return response.text || "No explanation generated.";
}


export const agentDesignArchitecture = async (
  userPrompt: string,
  modelContext: string,
  specializedInstruction: string
): Promise<any> => {
  const systemPrompt = `
    ${PERSONA_ARCHITECT}
    CONTEXT: ${modelContext}
    SPECIALIZED INSTRUCTION: ${specializedInstruction}
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Design the architecture for: "${userPrompt}"`,
    config: {
      systemInstruction: systemPrompt,
      responseMimeType: "application/json",
      responseSchema: architectureSchema,
      temperature: 0.3,
    },
  });

  return JSON.parse(response.text || "{}");
};

export const agentImplementCode = async (
  architectureData: any,
  modelContext: string,
  specializedInstruction: string
): Promise<any> => {
  const systemPrompt = `
    ${PERSONA_DEVELOPER}
    ${PERSONA_QA}
    CONTEXT: ${modelContext}
    SPECIALIZED INSTRUCTION: ${specializedInstruction}
  `;

  const prompt = `
    PROJECT TITLE: ${architectureData.title}
    PLAN: ${architectureData.architecture_plan}
    FILES TO IMPLEMENT: ${JSON.stringify(architectureData.proposed_files, null, 2)}
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt,
    config: {
      systemInstruction: systemPrompt,
      responseMimeType: "application/json",
      responseSchema: implementationSchema,
      temperature: 0.1,
    },
  });

  return JSON.parse(response.text || "{}");
};
