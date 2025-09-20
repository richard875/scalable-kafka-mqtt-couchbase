import { JSONSchemaType } from "ajv";
import BetV2 from "@fdj/shared/types/kafka/betV2.js";

const BetV2Schema: JSONSchemaType<BetV2> = {
  type: "object",
  properties: {
    version: { type: "string", const: "v2" },
    payload: {
      type: "object",
      properties: {
        meta: {
          type: "object",
          properties: {
            id: { type: "string" },
            key: { type: "string" },
          },
          required: ["id", "key"],
          additionalProperties: false,
        },
        info: {
          type: "object",
          properties: {
            name: { type: "string" },
            team: { type: "string" },
          },
          required: ["name", "team"],
          additionalProperties: false,
        },
        stats: {
          type: "object",
          properties: {
            price: { type: "number" },
            amount: { type: "number" },
          },
          required: ["price", "amount"],
          additionalProperties: false,
        },
      },
      required: ["meta", "info", "stats"],
      additionalProperties: false,
    },
  },
  required: ["version", "payload"],
  additionalProperties: false,
};

export default BetV2Schema;
