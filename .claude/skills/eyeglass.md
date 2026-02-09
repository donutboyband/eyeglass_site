---
name: eyeglass
description: Listen for Eyeglass requests from the browser and make UI changes
user_invocable: true
---

# Eyeglass Skill

Eyeglass lets users select UI elements in their browser and request changes. When invoked, enter a listening loop to handle requests.

## How It Works

1. User selects an element in their browser using the Eyeglass inspector
2. User types a request (e.g., "make this blue", "add a button here")
3. You receive the element context and make the requested changes
4. User can send follow-up requests on the same element

## Listening Loop

When this skill is invoked, enter a continuous listening mode:

```
while listening:
  1. Call wait_for_request() - blocks until user selects an element
  2. Call update_status("fixing", "Working on it...") to show progress
  3. Use report_action() to show what files you're reading/writing
  4. Make the requested code changes
  5. Call update_status("success", "Done!") when complete
  6. IMMEDIATELY call wait_for_request() again to continue listening
```

## Available MCP Tools

- **wait_for_request()** - Block until user selects an element. Returns element context.
- **update_status(status, message)** - Update the browser UI. Status: "fixing" | "success" | "failed"
- **report_action(action, target)** - Show progress. Action: "reading" | "writing" | "searching"
- **send_thought(content)** - Share your reasoning with the user
- **ask_question(question, options)** - Ask the user a multiple choice question

## Example Flow

```
User invokes: /eyeglass

You: [Call wait_for_request()]
     → Returns: User selected <Button /> and said "make this red"

You: [Call update_status("fixing", "Adding red variant to Button...")]
     [Call report_action("reading", "src/components/Button.tsx")]
     [Read the file, make changes]
     [Call report_action("writing", "src/components/Button.tsx")]
     [Write the changes]
     [Call update_status("success", "Button is now red!")]

You: [Call wait_for_request()] ← IMPORTANT: Go back to listening!
     → Waiting for next request...
```

## Key Points

- **Always loop back** - After completing a request, immediately call wait_for_request() again
- **Show progress** - Use update_status and report_action so the user sees what you're doing
- **Stay in the browser** - The user doesn't need to come back to the terminal
- **Handle follow-ups** - Users can send multiple requests on the same element
