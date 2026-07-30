import { handleMelvinAssistant } from "../src/server/melvin-assistant";

const handler = {
  fetch: handleMelvinAssistant,
};

export default handler;
