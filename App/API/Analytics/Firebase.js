import analytics from '@react-native-firebase/analytics';
import { SignupUserTypes } from '../../SupportingFIles/Constants';

let enabled = true; //should be off for GDPR compliance / if the user selected not to opt in somehow in the future

//naming functions according to https://rnfirebase.io/reference/analytics, if applicable

export const logCustom = async (entityId, entityType, entity) => {
  if(!enabled) return;
  await analytics().logEvent('click_custom', {
    id: entityId,
    item: entity,
    description: ['custom desc 1', 'custom desc 2'],
    type: entityType,
  })
  console.warn(`logClick entity ${entity} entityType ${entityType} entityId ${entityId}`)
}

export const logClick = async (entityId, entity) => {
  if(!enabled) return;
  await analytics().logSelectContent({
    content_type: 'click_' + entity,
    item_id: entityId,

  })
  console.warn(`logCustom entity ${entity} entityId ${entityId}`)
}

export const logSearch = async (keyword) => {
  if(!enabled) return;
  await analytics().logSelectContent({
    content_type: 'search',
    item_id: keyword,
  })
  console.warn(`logSearch keyword ${keyword}`)
}

/** deprecated - it doesn't show the keyword entered by the user */
export const logSearchPredefined = async (keyword) => {
  if(!enabled) return;
  await analytics().logSearch({
    search_term: keyword
  });
  console.warn(`logSearch keyword ${keyword}`)
}

/** deprecated */
export const logEvent = async (campaignData) => {
  if(!enabled) return;
  await analytics().logEvent('campaignDetail', {
    id: campaignData.id,
    name: campaignData.campaignTitle,
    type: campaignData.campaignType,
  })
  console.warn(`logEvent campaignData ${JSON.stringify(campaignData)}`)
}

export const logScreenView = async (currentRouteName, cRouteName) => {
  if(!enabled) return;
  await analytics().logScreenView({
    screen_name: currentRouteName,
    screen_class: cRouteName
  });
  console.warn(`logScreenView currentRouteName ${currentRouteName} cRouteName ${cRouteName}`)
}
