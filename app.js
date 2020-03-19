const { App } = require('@slack/bolt');

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET
});

app.command('/random', async ({ command, ack, say }) => {
  console.log('------------------')
  console.log(command)
  console.log('------------------')
  ack();
  const random_num = String(Math.floor(Math.random() * Math.floor(100)))
  // say(`${command.text}`);
  say(random_num)
});

const restaurants = [
  { name: '割烹よし田', url: 'https://tabelog.com/fukuoka/A4001/A400103/40000692/' },
  { name: '真', url: 'https://tabelog.com/fukuoka/A4001/A400103/40003911/' },
  { name: '新三浦 天神店', url: 'https://tabelog.com/fukuoka/A4001/A400103/40000066/' },
  { name: '利花苑 大名本店', url: 'https://tabelog.com/fukuoka/A4001/A400104/40000443/' },
  { name: '106 サウスインディアン 福岡天神店', url: 'https://tabelog.com/fukuoka/A4001/A400103/40041110/' },
];

function getRecomendationRestarantBlock() {
  const restaurant = restaurants[Math.floor(Math.random() * restaurants.length)];
  return [
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": `:shallow_pan_of_food: <${restaurant.url}|${restaurant.name}> はいかがですか？`
      },
      "accessory": {
        "type": "button",
        "action_id": "find-another", // このキー名で app.action と連動する
        "text": {
          "type": "plain_text",
          "text": "他の店を見る",
          "emoji": true
        },
        "value": "next"
      }
    }
  ];
}

app.command('/restaurant', async ({ ack, respond }) => {
  ack();
  respond({
    response_type: 'in_channel',
    blocks: getRecomendationRestarantBlock()
  });
});

app.action('find-another', async ({ body, context, ack, respond }) => {
  ack();
  respond({
    response_type: 'in_channel', // 再びこのユーザにだけ見えるメッセージ
    replace_original: true, // もともとあったメッセージを置き換える
    blocks: getRecomendationRestarantBlock()
  })
});

(async () => {
  await app.start(process.env.PORT || 3000);
  console.log('⚡️ Bolt app is running!');
})();

