import { FilesApiInterface } from '@standardnotes/files'
import { AbstractService } from '../Service/AbstractService'
import { ApiServiceEvent } from './ApiServiceEvent'
import { ApiServiceEventData } from './ApiServiceEventData'
import { SNFeatureRepo } from '@standardnotes/models'
import { ClientDisplayableError, HttpResponse } from '@standardnotes/responses'
import { AnyFeatureDescription } from '@standardnotes/features'

export interface LegacyApiServiceInterface
  extends AbstractService<ApiServiceEvent, ApiServiceEventData>,
    FilesApiInterface {
  isThirdPartyHostUsed(): boolean

  downloadOfflineFeaturesFromRepo(
    repo: SNFeatureRepo,
  ): Promise<{ features: AnyFeatureDescription[]; roles: string[] } | ClientDisplayableError>

  downloadFeatureUrl(url: string): Promise<HttpResponse>
}
