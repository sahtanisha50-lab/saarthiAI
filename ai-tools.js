/**
 * Gemini Tool Definitions for Saarthi AI
 * These schemas allow Gemini 1.5 Pro to execute structured actions 
 * on the user's behalf (Function Calling).
 */

export const saarthiTools = [
  {
    "name": "create_senior_reminder",
    "description": "Sets a daily voice or visual reminder for medication or tasks",
    "parameters": {
      "type": "OBJECT",
      "properties": {
        "task_name": { 
          "type": "STRING",
          "description": "The name of the medication or task" 
        },
        "time_of_day": { 
          "type": "STRING", 
          "enum": ["Morning", "Afternoon", "Evening"],
          "description": "The general time of day the reminder should trigger"
        },
        "dosage_info": { 
          "type": "STRING",
          "description": "Optional dosage information if this is a medication"
        }
      },
      "required": ["task_name", "time_of_day"]
    }
  }
];

/**
 * Mock Execution Engine for local demos
 */
export function executeToolCall(toolCall) {
  if (toolCall.name === "create_senior_reminder") {
    const { task_name, time_of_day, dosage_info } = toolCall.args;
    console.log(`[Tool Executed] Reminder Set: ${task_name} for ${time_of_day}. Dosage: ${dosage_info || 'N/A'}`);
    
    // In a real app, this would push a new reminder object to the local database
    // and re-render the "Today at a Glance" UI.
    return { status: "success", message: `Reminder for ${task_name} saved successfully.` };
  }
  return { status: "error", message: "Tool not found" };
}
