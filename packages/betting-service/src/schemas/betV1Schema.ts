import { JSONSchemaType } from "ajv";
import BetV1 from "@fdj/shared/types/kafka/betV1.js";

const BetV1Schema: JSONSchemaType<BetV1> = {
  type: "object",
  properties: {
    version: { type: "string", const: "v1" },
    payload: {
      type: "object",
      properties: {
        id: { type: "string" },
        name: { type: "string" },
        price: { type: "number" },
        key: { type: "string" },
        team: { type: "string" },
        amount: { type: "number" },
      },
      required: ["id", "name", "price", "key", "team", "amount"],
      additionalProperties: false,
    },
  },
  required: ["version", "payload"],
  additionalProperties: false,
};

export default BetV1Schema;
