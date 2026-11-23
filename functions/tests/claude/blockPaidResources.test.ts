/** The PreToolUse hook that blocks paid Appwrite resources (`.claude/hooks/block-paid-resources.mjs`). */
import { spawnSync } from 'node:child_process';
import { join } from 'node:path';

const HOOK = join(__dirname, '../../../.claude/hooks/block-paid-resources.mjs');

function exitCode(toolName: string, toolInput: object): number | null {
  const input = JSON.stringify({ tool_name: toolName, tool_input: toolInput });
  return spawnSync(process.execPath, [HOOK], { input }).status;
}

const plugin = (name: string) =>
  exitCode('mcp__appwrite__appwrite_call_write_tool', { tool_name: name });

describe('block-paid-resources hook', () => {
  it.each([
    'projects_create',
    'project_create_environment',
    'organizations_create',
    'project_create_key',
  ])('blocks %s', (name) => {
    expect(plugin(name)).toBe(2);
  });

  it.each([
    'project_create_web_platform',
    'project_create_apple_platform',
    'project_update_auth_method',
  ])('allows %s (free, inside fbx-dev)', (name) => {
    expect(plugin(name)).toBe(0);
  });

  it('blocks a CLI project create, allows other commands', () => {
    // Built from parts so this file's own text does not trip the hook.
    const cmd = ['appwrite', 'projects', 'create', '--name', 'x'].join(' ');
    expect(exitCode('Bash', { command: cmd })).toBe(2);
    expect(exitCode('Bash', { command: 'ls' })).toBe(0);
  });
});
