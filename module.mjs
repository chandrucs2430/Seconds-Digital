// @ts-check
import { module } from "@prisma/composer";
import figmaMakeAppService from "./service.mjs";

export default module("seconds-digital", ({ provision }) => {
  provision(figmaMakeAppService, { id: "figmamakeapp" });
});
