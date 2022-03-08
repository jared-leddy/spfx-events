import { override } from '@microsoft/decorators';
import { Log } from '@microsoft/sp-core-library';
import {
  BaseApplicationCustomizer
} from '@microsoft/sp-application-base';
import { Dialog } from '@microsoft/sp-dialog';

import * as strings from 'AzureAppInsightsScriptApplicationCustomizerStrings';

import { AppInsights } from "applicationinsights-js";

const LOG_SOURCE: string = 'AzureAppInsightsScriptApplicationCustomizer';

/**
 * If your command set uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface IAzureAppInsightsScriptApplicationCustomizerProperties {
  // This is an example; replace with your own property
  aikey: string;
}

/** A Custom Action which can be run during execution of a Client Side Application */
export default class AzureAppInsightsScriptApplicationCustomizer
  extends BaseApplicationCustomizer<IAzureAppInsightsScriptApplicationCustomizerProperties> {

  @override
  public onInit(): Promise<void> {
    Log.info(LOG_SOURCE, `Initialized ${strings.Title}`);

    AppInsights.downloadAndSetup({
      instrumentationKey: this.properties.aikey
    });

    AppInsights.setAuthenticatedUserContext(this.context.pageContext.user.email);
    AppInsights.trackPageView();
    AppInsights.trackEvent('spfx_appcustomizer_loaded', {
      site_id: this.context.pageContext.site.id,
      web_id: this.context.pageContext.web.id,
      web_title: this.context.pageContext.web.title,
      web_desc: this.context.pageContext.web.description
    });
    return Promise.resolve();
  }
}
