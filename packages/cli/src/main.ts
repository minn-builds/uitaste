#!/usr/bin/env node
import { defineCommand, runMain } from "citty";
import { initCommand } from "./commands/init.js";
import { lintCommand } from "./commands/lint.js";
import { presetCommand } from "./commands/preset.js";
import { shootCommand } from "./commands/shoot.js";

const main = defineCommand({
  meta: { name: "tastekit", description: "Distinctive, consistent frontends from coding agents" },
  subCommands: { init: initCommand, lint: lintCommand, preset: presetCommand, shoot: shootCommand },
});

void runMain(main);
