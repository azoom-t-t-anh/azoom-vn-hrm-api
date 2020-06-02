import { WebClient } from '@slack/web-api'
const createWebClient = () => {
  return new WebClient(process.env.SLACK_OAUTH_ACCESS_TOKEN)
}

export const slackBot = createWebClient()
