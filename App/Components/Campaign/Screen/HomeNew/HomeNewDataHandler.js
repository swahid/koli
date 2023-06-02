import { strings } from "../../../../Locales/i18"


export const SectionName = {
    "PAID":strings('Paid_Post'), 
    "COMMISSION":strings('Commission_based'),
    "VIDEO":strings('Video_endorsement'),
    "SHOUTOUT":strings('Shoutout_Exchange'),
    "EVENT":strings('Events_Appearance'),
    "SPONSORED":strings('Sponsored'),

}


export const getSectionName = (sectionType) =>{

    console.log('sectionType:',sectionType)
    const sectionValue = Object.values(SectionName).find(k => SectionName[k] === sectionType);
    console.log('SectionName[sectionType]:',sectionValue)

    return sectionValue;

}