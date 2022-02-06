import MessageHandler from '../../Handlers/MessageHandler'
import BaseCommand from '../../lib/BaseCommand'
import WAClient from '../../lib/WAClient'
import { ISimplifiedMessage } from '../../typings'
import axios from 'axios'
import Heroku from 'heroku-client'
import got from 'got'

import request from '../../lib/request'
import { MessageType } from '@adiwajshing/baileys'
// import { MessageType, Mimetype } from '@adiwajshing/baileys'

export default class Command extends BaseCommand {
    constructor(client: WAClient, handler: MessageHandler) {
        super(client, handler, {
            command: 'dyno',
            description: `Shows your dyno info`,
            aliases: ['dyno'],
            category: 'heroku',
            usage: `${client.config.prefix}dyno`,
            baseXp: 50
        })
    }

    run = async (M: ISimplifiedMessage): Promise<void> => {
    if (!this.client.config.hapi) return void M.reply("No heroku API key set");
    if (!this.client.config.hname) return void M.reply("No heroku name set");
const heroku = new Heroku({
    token: `${this.client.config.hapi}`
});
const baseURI = '/apps/' + `${this.client.config.hname}`
    heroku.get('/account').then(async (account: any) => {
       const url = "https://api.heroku.com/accounts/" + account.id + "/actions/get-quota"
       const headers = {
            "User-Agent": "Chrome/80.0.3987.149 Mobile Safari/537.36",
            "Authorization": "Bearer " + `${this.client.config.hapi}`,
            "Accept": "application/vnd.heroku+json; version=3.account-quotas",
        };

        await got(url, {headers: headers}).then(async (res: any) => {
           const resp = JSON.parse(res.body);
          const total_quota = Math.floor(resp.account_quota);
           const quota_used = Math.floor(resp.quota_used);         
           const percentage = Math.round((quota_used / total_quota) * 100);
           const remaining = total_quota - quota_used;
           const i = Math.floor(total_quota / 3600);
           const h = Math.floor(quota_used / 3600); 
           const u = Math.floor(remaining / 3600); 
let g = `💻 *Total Quota*: _${i}_
🔎 *Quota Used*: _${h}_
🚦 *Percentage*: _${percentage}%_
🚧 *Left*: _${u}_
`
await M.reply(g)
});

    })
}
}
