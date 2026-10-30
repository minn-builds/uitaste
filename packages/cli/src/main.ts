#!/usr/bin/env node
import { defineCommand, runMain } from "citty";
import { initCommand } from "./commands/init.js";
import { presetCommand } from "./commands/preset.js";

const main = defineCommand({
  meta: { name: "tastekit", description: "Distinctive, consistent frontends from coding agents" },
  subCommands: { init: initCommand, preset: presetCommand },
});

void runMain(main);
