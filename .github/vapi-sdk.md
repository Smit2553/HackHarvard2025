Vapi SDK Integration Spec: Real-Time Code Context
1. High-Level Requirement
The primary objective is to dynamically transmit the user's code from the Monaco editor in our frontend to the active Vapi AI agent in real-time. This will allow the AI to provide context-aware feedback based on the user's specific implementation, not just their spoken words. The entire process must be initiated from the frontend using the Vapi Web SDK, with no backend server involved.
2. Specific Functional Requirements
FR1: Code Extraction: The system must implement a function that can reliably access the Monaco editor instance and retrieve its entire current text content as a string.
FR2: Data Packaging: The extracted code string must be packaged into a structured JSON object. This ensures our data is clean and allows for future expansion if we need to send more than just code.
FR3: SDK Transmission: The system must use the appropriate Vapi SDK function to send the JSON payload to the currently active Vapi call. This is the core of the integration.
FR4: User-Initiated Trigger: For the MVP, the transmission of code will be triggered by a manual button click from the user. This simplifies the logic and ensures context is only sent when the user is ready.
3. Core Function Specification: sendCodeToAgent
This is the central function your frontend team will build. It will live within your React application.
Function Name: sendCodeToAgent
Purpose: To retrieve code from the editor, format it, and send it to the active Vapi agent.
Parameters:
vapiInstance (object): The active Vapi SDK instance object that is managing the live call.
editorInstance (object): The instance of the Monaco editor.
Returns: Promise<void> - The function will be asynchronous and will resolve when the send operation is complete, or reject if there is an error.
Internal Logic:
Validate that both vapiInstance and editorInstance are not null.
Retrieve the full code content from the editor using a method like editorInstance.getValue().
Construct the JSON payload. The payload must be an object. We will use a type property to identify the message and a code property for the content.
code
JSON
{
  "type": "code_update",
  "code": "/* The user's full code string goes here */"
}
[CRITICAL STEP] Invoke the Vapi SDK's method for sending data.
Hypothetical Function Name: vapiInstance.send()
Disclaimer: The exact function name MUST be found in the Vapi Web SDK documentation. You are looking for the function that sends a message or event to the agent during a live call. It may also be called sendMessage, publish, or something similar.
The call will look like this: await vapiInstance.send({ type: "message", role: "user", message: JSON.stringify(payload) }); or a similar structure Vapi specifies for sending structured data.
Implement try...catch error handling to gracefully manage any failures during the API call (e.g., if the call has ended).
4. Technical Integration Plan (Button Implementation)
This section describes how to connect the sendCodeToAgent function to a button in your React UI.
Assumptions: You have the vapi instance and the Monaco editor instance available in your React component's state or as refs.
Step 1: Define the Handler Function in your Component
code
Jsx
const handleSendCodeClick = async () => {
  if (!vapi || !editor) {
    console.error("Vapi or Editor not initialized.");
    return;
  }
  try {
    console.log("Sending code to agent...");
    await sendCodeToAgent(vapi, editor); // The function we just specified
    console.log("Code sent successfully!");
  } catch (error) {
    console.error("Failed to send code to agent:", error);
  }
};
Step 2: Create the UI Button
Add a simple button to your component's JSX.
code
Jsx
<button
  onClick={handleSendCodeClick}
  disabled={!isCallActive} // Optional: disable button when call is not active
>
  Send Code to Interviewer
</button>
Step 3: Update the System Prompt in Vapi
To ensure the AI knows what to do with this new information, Eric must update the system prompt in the Vapi dashboard to include instructions for handling the code_update message type.
Add this to the "[RULES OF ENGAGEMENT]" section of your system prompt:
code
Code
You will receive messages with a "type" of "code_update". When you see this, the "code" field contains the candidate's latest code. You MUST analyze this new code to inform your very next response.
This specification provides a complete, end-to-end plan. The immediate next action is for Marvin and Smit to find the exact name of the vapi.send() function in the official documentation.