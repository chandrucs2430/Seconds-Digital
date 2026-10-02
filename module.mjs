// @ts-check
import { module } from "@prisma/composer";
import secondsDigitalStorefrontService from "./service.mjs";

export default module("seconds-digital", ({ provision }) => {
  provision(secondsDigitalStorefrontService, { id: "secondsdigitalstorefront" });
});
