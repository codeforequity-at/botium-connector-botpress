# Botium Connector for Botpress 

[![NPM](https://nodei.co/npm/botium-connector-botpress.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/botium-connector-botpress/)

[![Codeship Status for codeforequity-at/botium-connector-botpress](https://app.codeship.com/projects/0628d960-f411-0136-964d-7aa71a943ab2/status?branch=master)](https://app.codeship.com/projects/320664)
[![npm version](https://badge.fury.io/js/botium-connector-botpress.svg)](https://badge.fury.io/js/botium-connector-botpress)
[![license](https://img.shields.io/github/license/mashape/apistatus.svg)]()

This is a [Botium](https://github.com/codeforequity-at/botium-core) connector for testing your Botpress chatbot.

__Did you read the [Botium in a Nutshell](https://medium.com/@floriantreml/botium-in-a-nutshell-part-1-overview-f8d0ceaf8fb4) articles ? Be warned, without prior knowledge of Botium you won't be able to properly use this library!__

## How it works ?
Botium uses the [Botpress built-in JSON channel](https://botpress.io/docs/build/channels/) to connect to your chatbot.

It can be used as any other Botium connector with all Botium Stack components:
* [Botium CLI](https://github.com/codeforequity-at/botium-cli/)
* [Botium Bindings](https://github.com/codeforequity-at/botium-bindings/)
* [Botium Box](https://www.botium.at)

## Requirements

* __Node.js and NPM__
* a __Botpress Server__
* a __project directory__ on your workstation to hold test cases and Botium configuration

## Install Botium and Botpress Connector

When using __Botium CLI__:

```
> npm install -g botium-cli
> npm install -g botium-connector-botpress
> botium-cli init
> botium-cli run
```

When using __Botium Bindings__:

```
> npm install -g botium-bindings
> npm install -g botium-connector-botpress
> botium-bindings init mocha
> npm install && npm run mocha
```

When using __Botium Box__:

_Already integrated into Botium Box, no setup required_

## Connecting your Botpress server to Botium

Open the file _botium.json_ in your working directory and add the Botpress chatbot connection settings.

```
{
  "botium": {
    "Capabilities": {
      "PROJECTNAME": "<whatever>",
      "CONTAINERMODE": "botpress",
      "BOTPRESS_SERVER_URL": "...",
      "BOTPRESS_BOTID": "..."
    }
  }
}
```
Botium setup is ready, you can begin to write your [BotiumScript](https://github.com/codeforequity-at/botium-core/wiki/Botium-Scripting) files.

## Supported Capabilities

Set the capability __CONTAINERMODE__ to __botpress__ to activate this connector.

### BOTPRESS_SERVER_URL
The Botpress server url (without any path, just http/https, servername, port)

### BOTPRESS_BOTID
The Botpress bot id

### BOTPRESS_USERID
If set, this userId will be used. Otherwise, for each convo a new userId is generated

### BOTPRESS_USE_INTENT
Set this to true for testing the resolved intents only instead of the output text
