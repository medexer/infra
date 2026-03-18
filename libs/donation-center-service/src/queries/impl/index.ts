import { SecureUserPayload } from "libs/common/src/interface";

export class SearchBloodDonorsQuery {
  constructor(
    public readonly query: string,
    public readonly secureUser: SecureUserPayload,
  ) { }
}