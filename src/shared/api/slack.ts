interface IParams {
  title: string;
  ip?: string | null;
  memo?: string | null;
}

const notifySlack = async ({ title, ip, memo }: IParams) => {
  const text = `
    *${title}*
    • IP: \`${ip ?? '없음'}\`
    • MEMO: \`${memo ?? '없음'}\`
  `;

  try {
    await fetch(process.env.SLACK_WEBHOOK_URL!, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
  } catch (error) {
    console.error('[Slack Notify Error]', error);
  }
};

export default notifySlack;
