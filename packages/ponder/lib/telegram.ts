import { Telegraf } from "telegraf";
import { projectsData } from "../../nextjs/data/projects";

const botToken = process.env.TELEGRAM_BOT_TOKEN || "";
const channelId = process.env.TELEGRAM_CHANNEL_ID || "";
const baseUrl = process.env.APP_BASE_URL || "http://localhost:3000";

type WithdrawalRequest = {
  id: string;
  requestId: number;
  builder: string;
  amount: number;
  reason: string;
  projectName: string;
};

export class TelegramNotifier {
  private bot: Telegraf;
  private readonly REASON_MAX_LENGTH = 150;

  constructor() {
    this.bot = new Telegraf(botToken);
    this.setupBot();
  }

  private setupBot() {
    this.bot.launch().catch(console.error);
  }

  private truncateText(text: string, maxLength: number): string {
    if (!text) return "";
    return text.length > maxLength
      ? text.substring(0, maxLength).trim() + "..."
      : text;
  }

  private escapeHtml(text: string): string {
    if (!text) return "";
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  private makeEtherscanUrl(address: string): string {
    return `https://etherscan.io/address/${address}`;
  }

  async notifyNewWithdrawalRequest(withdrawal: WithdrawalRequest) {
    const truncatedReason = this.truncateText(
      withdrawal.reason,
      this.REASON_MAX_LENGTH
    );
    const message = `🎉 <b>New Withdrawal Request!</b>

<b>Builder:</b> <a href="${this.makeEtherscanUrl(withdrawal.builder)}">${
      withdrawal.builder
    }</a>
<b>Project:</b> ${
      projectsData.find((p) => p.name === withdrawal.projectName)?.title
    }
<b>Reason:</b>
${this.escapeHtml(truncatedReason)}
<b>Amount:</b> ${withdrawal.amount} USDC

Go to <a href="${baseUrl}/admin">${baseUrl}/admin</a>`;

    await this.bot.telegram.sendMessage(channelId, message, {
      link_preview_options: {
        is_disabled: true,
      },
      parse_mode: "HTML",
    });
  }
}
