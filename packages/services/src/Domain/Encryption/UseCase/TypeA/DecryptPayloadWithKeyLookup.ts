import { DecryptedParameters, ErrorDecryptingParameters, EncryptionOperatorsInterface } from '@standardnotes/encryption'
import {
  ContentTypeUsesKeySystemRootKeyEncryption,
  EncryptedPayloadInterface,
  ItemContent,
  KeySystemRootKeyInterface,
  RootKeyInterface,
} from '@standardnotes/models'

import { DecryptTypeAPayload } from './DecryptPayload'
import { RootKeyManager } from '../../../RootKeyManager/RootKeyManager'
import { KeySystemKeyManagerInterface } from '../../../KeySystem/KeySystemKeyManagerInterface'

export class DecryptTypeAPayloadWithKeyLookup {
  constructor(
    private operators: EncryptionOperatorsInterface,
    private keySystemKeyManager: KeySystemKeyManagerInterface,
    private rootKeyManager: RootKeyManager,
  ) {}

  async executeOne<C extends ItemContent = ItemContent>(
    payload: EncryptedPayloadInterface,
  ): Promise<DecryptedParameters<C> | ErrorDecryptingParameters> {
    let key: RootKeyInterface | KeySystemRootKeyInterface | undefined
    if (ContentTypeUsesKeySystemRootKeyEncryption(payload.content_type)) {
      if (!payload.key_system_identifier) {
        throw Error('Key system root key encrypted payload is missing key_system_identifier')
      }
      key = this.keySystemKeyManager.getPrimaryKeySystemRootKey(payload.key_system_identifier)
    } else {
      key = this.rootKeyManager.getRootKey()
    }

    if (key == undefined) {
      return {
        uuid: payload.uuid,
        errorDecrypting: true,
        waitingForKey: true,
      }
    }

    const usecase = new DecryptTypeAPayload(this.operators)

    return usecase.executeOne(payload, key)
  }

  async executeMany<C extends ItemContent = ItemContent>(
    payloads: EncryptedPayloadInterface[],
  ): Promise<(DecryptedParameters<C> | ErrorDecryptingParameters)[]> {
    return Promise.all(payloads.map((payload) => this.executeOne<C>(payload)))
  }
}
