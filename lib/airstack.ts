import {
  validateFramesMessage,
  ValidateFramesMessageInput,
  ValidateFramesMessageOutput,
  init,
} from "@airstack/frames";

console.log(process.env.AIRSTACK_API_KEY);

init(process.env.AIRSTACK_API_KEY!);

export const validateFrameMessageWithAirstack = async (
  body: ValidateFramesMessageInput
): Promise<ValidateFramesMessageOutput> => {
  return validateFramesMessage(body);
};
