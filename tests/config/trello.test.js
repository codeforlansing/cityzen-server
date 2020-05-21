const { loadConfig } = require('../../src/config')
const TrelloProvider = require('../../src/tasks/trello_provider')
const path = require('path')

const CONFIG_PATH = path.resolve(__dirname, '..', '..', 'config', 'trello.json')

describe("Test that Trello's config values load correctly", () => {
  test('Test loading config values', async () => {
    const config = loadConfig(CONFIG_PATH)
    expect(config).toHaveProperty('tasks.provider.provider')
    expect(config.tasks.provider.provider).toBeInstanceOf(TrelloProvider)
  })
})
