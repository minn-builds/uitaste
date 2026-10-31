# @uitaste/mcp

Stdio MCP server for [uitaste](https://github.com/uitaste/uitaste). Tools: `list_presets`, `get_preset`, `generate_tokens`, `lint`, `shoot`. Paths are confined to the working directory, and `shoot` only accepts local http(s) URLs unless `shoot.url` is set in `uitaste.config.json`.

```json
{
  "mcpServers": {
    "uitaste": { "command": "npx", "args": ["-y", "-p", "@uitaste/mcp", "uitaste-mcp"] }
  }
}
```

`shoot` needs Playwright in your project. Docs: https://github.com/uitaste/uitaste

MIT
