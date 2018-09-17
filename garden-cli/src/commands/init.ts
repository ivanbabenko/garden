/*
 * Copyright (C) 2018 Garden Technologies, Inc. <info@garden.io>
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { EnvironmentStatusMap } from "../types/plugin/outputs"
import {
  BooleanParameter,
  Command,
  CommandResult,
  CommandParams,
} from "./base"
import dedent = require("dedent")

export class InitCommand extends Command {
  name = "init"
  help = "Initialize environment or other runtime components."

  subCommands = [
    InitEnvironmentCommand,
  ]

  async action() { return {} }
}

const initEnvOptions = {
  force: new BooleanParameter({ help: "Force initalization of environment, ignoring the environment status check." }),
}

type InitEnvOpts = typeof initEnvOptions

export class InitEnvironmentCommand extends Command<{}, InitEnvOpts> {
  name = "environment"
  alias = "env"
  help = "Initializes your environment."

  description = dedent`
    Generally, environments are initialized automatically as part of other commands that you run.
    However, this command is useful if you want to make sure the environment is ready before running
    another command, or if you need to force a re-initialization using the --force flag.

    Examples:

        garden init env
        garden init env --force
  `

  options = initEnvOptions

  async action({ garden, opts }: CommandParams<{}, InitEnvOpts>): Promise<CommandResult<EnvironmentStatusMap>> {
    const { name } = garden.environment
    garden.log.header({ emoji: "gear", command: `Initializing ${name} environment` })

    const result = await garden.actions.prepareEnvironment({ force: opts.force })

    garden.log.info("")
    garden.log.header({ emoji: "heavy_check_mark", command: `Done!` })

    return { result }
  }
}