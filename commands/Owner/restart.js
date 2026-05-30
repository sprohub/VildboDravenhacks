export default {
  name: "res",

  async run(sock, msg, args, chatId) {

    await sock.sendMessage(chatId, {
      text: "♻️ Reiniciando..."
    });

    process.exit(0);
  }
};
