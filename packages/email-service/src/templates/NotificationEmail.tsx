import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Text,
  Img,
  Tailwind,
  pixelBasedPreset,
} from "@react-email/components";
import BetV2 from "@fdj/shared/types/kafka/betV2.js";

interface NotificationEmailProps {
  companyName: string;
  bets: BetV2[];
}

const mockData: BetV2[] = [
  {
    version: "v2",
    payload: {
      meta: {
        id: "6d77408c8d162496caaf0b9e47303b37abb31267384159f8b1d2e0a4cdc37c9d",
        key: "nfl",
        userId: "936bd6f2c6247d17fed7edcbf11d2233",
        isLast: false,
      },
      info: {
        name: "Green Bay Packers",
        team: "Green Bay Packers - Washington Commanders",
      },
      stats: {
        price: 1.54,
        amount: 50,
      },
    },
  },
  {
    version: "v2",
    payload: {
      meta: {
        id: "e3b270f931f8ce07a277f46fc35a819d49b0e08625c7de410ba0e9e9b28ff69b",
        key: "nfl",
        userId: "936bd6f2c6247d17fed7edcbf11d2233",
        isLast: true,
      },
      info: {
        name: "Detroit Lions",
        team: "Detroit Lions - Chicago Bears",
      },
      stats: {
        price: 1.42,
        amount: 50,
      },
    },
  },
];

export const NotificationEmail = ({ companyName, bets }: NotificationEmailProps) => {
  const userId = bets.length > 0 ? bets[0].payload.meta.userId : "Unknown";

  return (
    <Html>
      <Head />
      <Preview>Thank you for choosing {companyName}!</Preview>
      <Tailwind config={{ presets: [pixelBasedPreset] }}>
        <Body className="font-sans bg-[#EEEEEE] m-0 p-0 w-full max-w-full antialiased">
          <Container className="w-full max-w-full bg-[#147B45] text-center py-6">
            <table width="100%" cellPadding={0} cellSpacing={0} border={0}>
              <tr>
                <td align="center" valign="middle">
                  <Img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Unibet_logo.svg/512px-Unibet_logo.svg.png"
                    alt="Logo"
                    width="160"
                  />
                </td>
              </tr>
            </table>
          </Container>
          <Container className="max-w-full w-full py-14">
            <Container className="max-w-[760px] h-1.5 bg-[#bbbbbb]" />
            <Container className="max-w-[760px] mx-auto bg-white">
              <Img
                src="https://www.vouchertoday.uk/uploads/feature/unibet-coupon-codes-promo-codes/1500x500-10.jpeg"
                alt="Banner"
                className="w-full max-w-full h-auto"
              />
              <Container className="m-0 px-5 w-full max-w-full">
                <Text className="text-sm">Dear User,</Text>
                <Text className="text-sm">Thank you for placing your bets with {companyName}!</Text>
                <Text className="text-sm">Please view and confirm your bets below:</Text>
                <Container className="my-6 w-full max-w-full">
                  <table className="w-full border-collapse border border-[#dddddd]">
                    <thead>
                      <tr className="bg-[#f8f9fa]">
                        <th className="border border-[#dddddd] px-4 py-3 text-left text-sm font-bold text-[#333333] whitespace-nowrap">
                          Bet #
                        </th>
                        <th className="border border-[#dddddd] px-4 py-3 text-left text-sm font-bold text-[#333333]">
                          Match
                        </th>
                        <th className="border border-[#dddddd] px-4 py-3 text-left text-sm font-bold text-[#333333]">
                          Selection
                        </th>
                        <th className="border border-[#dddddd] px-4 py-3 text-center text-sm font-bold text-[#333333]">
                          Odds
                        </th>
                        <th className="border border-[#dddddd] px-4 py-3 text-right text-sm font-bold text-[#333333]">
                          Stake
                        </th>
                        <th className="border border-[#dddddd] px-4 py-3 text-right text-sm font-bold text-[#333333] whitespace-nowrap">
                          Potential Payout
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {bets.map((bet, index) => (
                        <tr
                          key={bet.payload.meta.id}
                          className={index % 2 === 0 ? "bg-white" : "bg-[#f9f9f9]"}
                        >
                          <td className="border border-[#dddddd] px-4 py-3 text-sm">{index + 1}</td>
                          <td className="border border-[#dddddd] px-4 py-3 text-sm">
                            {bet.payload.info.team}
                          </td>
                          <td className="border border-[#dddddd] px-4 py-3 text-sm font-bold text-[#147B45]">
                            {bet.payload.info.name}
                          </td>
                          <td className="border border-[#dddddd] px-4 py-3 text-center text-sm">
                            {bet.payload.stats.price}
                          </td>
                          <td className="border border-[#dddddd] px-4 py-3 text-right text-sm font-bold">
                            ${bet.payload.stats.amount.toFixed(2)}
                          </td>
                          <td className="border border-[#dddddd] px-4 py-3 text-right text-sm font-bold text-[#147B45]">
                            ${(bet.payload.stats.amount * bet.payload.stats.price).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <Container className="w-full max-w-full mt-4 px-4 bg-[#f8f9fa] border border-[#dddddd]">
                    <Text className="text-sm mb-1">
                      <span className="font-bold">Total Stake:</span> $
                      {bets.reduce((total, bet) => total + bet.payload.stats.amount, 0).toFixed(2)}
                    </Text>
                    <Text className="text-sm mt-1">
                      <span className="font-bold">Total Potential Payout:</span> $
                      {bets
                        .reduce(
                          (total, bet) =>
                            total + bet.payload.stats.amount * bet.payload.stats.price,
                          0
                        )
                        .toFixed(2)}
                    </Text>
                  </Container>
                </Container>
                <Text className="text-sm">Good luck!</Text>
                <Text className="text-sm mb-0">Best regards,</Text>
                <Text className="text-sm font-bold mt-0">{companyName} Team</Text>
                <Text className="text-sm">
                  <span className="font-bold">User ID:</span> {userId}
                </Text>
              </Container>
            </Container>
          </Container>
          <Container className="w-full max-w-full bg-white text-center">
            <Text className="text-sm font-bold mt-7 mb-2.5">
              Disclaimer: This email is a non-commercial coding exercise and is not the official
              Unibet Email or Communication.
            </Text>
            <Text className="text-sm font-bold mt-2.5 mb-7">
              © {new Date().getFullYear()} a Richard Everley's Production
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

NotificationEmail.PreviewProps = {
  companyName: "Unibet",
  bets: mockData,
} as NotificationEmailProps;

export default NotificationEmail;
