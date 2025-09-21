import { Resend } from "resend";
import type BetV2 from "@fdj/shared/types/kafka/betV2.js";
import { RESEND_API_KEY, FROM_EMAIL, TO_EMAIL } from "../constants.js";
import NotificationEmail from "../templates/NotificationEmail.js";

const sendBetslipEmail = async (bets: BetV2[]) => {
  try {
    const resend = new Resend(RESEND_API_KEY);

    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [TO_EMAIL],
      subject: "Your Betslip from Unibet ⚽️",
      react: <NotificationEmail companyName="Unibet" bets={bets} />,
    });

    if (error) throw new Error("Failed to send email");
  } catch (error) {
    console.error("Error sending betslip email:", error);
  }
};

export default sendBetslipEmail;
