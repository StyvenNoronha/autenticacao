import { MailtrapClient } from "mailtrap";

export const sendTestEmail = async (
  to: string,
  subject: string,
  body: string,
) => {
  const client = new MailtrapClient({
    token: process.env.MAIL_TOKEN as string,
  });

  try {
    // Envia o email (vai parar na inbox de teste configurada no Mailtrap)
    await client.send({
      from: { name: "Sistema", email: "sistemaTeste@example.com" },
      to: [{ email: to }],
      subject,
      text: body,
    });

    // Depois você pode consultar as inboxes de teste
    const inboxes = await client.testing.inboxes;
    console.log("Inboxes de teste:", inboxes);

    // Pegar mensagens da primeira inbox
    const messages = await client.testing.messages;
    console.log("Mensagens na inbox de teste:", messages);

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};
