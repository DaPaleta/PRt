// You can import your modules
// import index from '../src/index'

import nock from 'nock'
// Requiring our app implementation
import myProbotApp from '../src'
import { Probot, ProbotOctokit } from 'probot'
// Requiring our fixtures
import payload from './fixtures/issues.opened.json'
import fs from 'fs'
import path from 'path'

const issueCreatedBody = { body: 'Thanks for opening this issue!' }
const privateKey = fs.readFileSync(path.join(__dirname, 'fixtures/mock-cert.pem'), 'utf-8')

describe('My Probot app', () => {
  let probot: Probot

  beforeEach(async () => {
    nock.disableNetConnect()
    probot = new Probot({
      appId: 123,
      privateKey,
      // disable request throttling and retries for testing
      Octokit: ProbotOctokit.defaults({
        retry: { enabled: false },
        throttle: { enabled: false }
      })
    })
    // Load our app into probot
    await probot.load(myProbotApp)
  })

  test('creates a comment when an issue is opened', async () => {
    const mock = nock('https://api.github.com')
      // Test that we correctly return a test token
      .post('/app/installations/2/access_tokens')
      .reply(200, {
        token: 'test',
        permissions: {
          issues: 'write'
        }
      })

      // Test that a comment is posted
      .post('/repos/hiimbex/testing-things/issues/1/comments', (body: unknown) => {
        expect(body).toMatchObject(issueCreatedBody)
        return true
      })
      .reply(200)

    // Receive a webhook event
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    await probot.receive({ name: 'issues', payload })

    expect(mock.pendingMocks()).toStrictEqual([])
  })

  afterEach(() => {
    nock.cleanAll()
    nock.enableNetConnect()
  })
})

// For more information about testing with Jest see:
// https://facebook.github.io/jest/

// For more information about using TypeScript in your tests, Jest recommends:
// https://github.com/kulshekhar/ts-jest

// For more information about testing with Nock see:
// https://github.com/nock/nock
