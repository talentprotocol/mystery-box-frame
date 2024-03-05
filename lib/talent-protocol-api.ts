import { TALENT_PROTOCOL_API_URL } from "./constants";

export interface ClaimRewardResponse {
  message: string;
  wallet?: string;
  amount?: number;
}
export const claimTalReward = async (body: {
  trustedData: { messageBytes: string };
}) => {
  const response = await fetch(
    `${TALENT_PROTOCOL_API_URL}/api/v2/rewards/claim_mystery_box`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );
  return (await response.json()) as ClaimRewardResponse;
};
