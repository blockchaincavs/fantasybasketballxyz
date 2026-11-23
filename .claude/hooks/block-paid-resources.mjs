#!/usr/bin/env node
// PreToolUse hook: blocks creating Appwrite projects, project environments or organizations.
// Each extra project costs $15/month. The only project is `fbx-dev` (Dev and Prod databases
// inside it). Only the user creates projects, in the console, when they decide to.
// Exit 2 = block the tool call and show the reason to Claude.
let raw = '';
process.stdin.on('data', (c) => (raw += c));
process.stdin.on('end', () => {
  let input;
  try {
    input = JSON.parse(raw);
  } catch {
    process.exit(0);
  }
  const reason = blockedReason(input.tool_name ?? '', input.tool_input ?? {});
  if (reason) {
    process.stderr.write(
      `Blocked: ${reason}. Never create an Appwrite project, environment or organization ` +
        '(paid). Use the single project fbx-dev; ask the user instead.\n',
    );
    process.exit(2);
  }
  process.exit(0);
});

/** Returns why the call is blocked, or '' to allow it. Exported shape kept simple for tests. */
function blockedReason(toolName, toolInput) {
  if (/appwrite/i.test(toolName)) {
    const name = String(toolInput.tool_name ?? '').toLowerCase();
    // Registering a platform (web/apple/android…) inside fbx-dev is free and creates no project.
    if (/^project_create_[a-z]+_platform$/.test(name)) return '';
    if (/^(projects?|organizations?|teams?_create_org)/.test(name) && /create/.test(name)) {
      return `Appwrite plugin call ${toolInput.tool_name}`;
    }
    if (/environment/.test(name) && /create/.test(name)) {
      return `Appwrite plugin call ${toolInput.tool_name}`;
    }
  }
  if (toolName === 'Bash') {
    const cmd = String(toolInput.command ?? '');
    if (/appwrite\s+(projects|organizations)\s+create/i.test(cmd)) return 'Appwrite CLI create';
    if (/createProject|createOrganization|projects\.create\(/.test(cmd))
      return 'SDK project create';
    if (
      /\/v1\/(projects|organizations)\b/.test(cmd) &&
      /-X\s*POST|--request\s+POST|-d\s|--data/i.test(cmd)
    ) {
      return 'POST to the Appwrite projects/organizations API';
    }
  }
  return '';
}
