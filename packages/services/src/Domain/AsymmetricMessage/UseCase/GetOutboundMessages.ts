import { ClientDisplayableError, isErrorResponse, AsymmetricMessageServerHash } from '@standardnotes/responses'
import { AsymmetricMessageServerInterface } from '@standardnotes/api'

export class GetOutboundMessages {
  constructor(private messageServer: AsymmetricMessageServerInterface) {}

  async execute(): Promise<AsymmetricMessageServerHash[] | ClientDisplayableError> {
    const response = await this.messageServer.getOutboundUserMessages()

    if (isErrorResponse(response)) {
      return ClientDisplayableError.FromNetworkError(response)
    }

    return response.data.messages
  }
}
