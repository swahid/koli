import {Dimensions,Platform,PixelRatio} from 'react-native'
import NormalizeSize from '../Themes/NormalizeSize';

const{width,height} = Dimensions.get('window')
const font_ratio = PixelRatio.getFontScale()
const baseWidth = 1125;
const baseHeight = 2436;
const scaleWidth = width / baseWidth;
const scaleHeight = height / baseHeight;
const scale = Math.min(scaleWidth, scaleHeight);
// used via Metrics.baseMargin

const metrics = {
    
    banner_height:(NormalizeSize.getWPercent('100%')*4/7)+(Platform.OS==='android'?NormalizeSize.getH(30):NormalizeSize.getH(20)),
    development_banner_height:(NormalizeSize.getWPercent('60%')*4/7)+(Platform.OS==='android'?NormalizeSize.getH(30):NormalizeSize.getH(20)),

    text_small:NormalizeSize.getFontSize(10),
    text_11:NormalizeSize.getFontSize(11),
    text_medium:NormalizeSize.getFontSize(12),
    text_normal:NormalizeSize.getFontSize(14),
    text_16:NormalizeSize.getFontSize(16),
    text_15:NormalizeSize.getFontSize(15),
    text_17:NormalizeSize.getFontSize(17),
    text_13:NormalizeSize.getFontSize(13),

    text_large:NormalizeSize.getFontSize(18),
    text_largex:NormalizeSize.getFontSize(19),
    text_xxl:NormalizeSize.getFontSize(22),
    text_24:NormalizeSize.getFontSize(24),
    text_xxxl:NormalizeSize.getFontSize(28),

    Lato_Bold : "Lato-Bold",
    Lato_Italic : "Lato-Italic",
    Lato_Light : "Lato-Light",
    Lato_Light_Italic : "Lato-LightItalic",
    Lato_Regular : "Lato-Regular",
    Lato_Thin : "Lato-Thin",
    Lato_Thin_Italic : "Lato-ThinItalic",
    Lato_SemiBold : "Lato-SemiBold",
    Lato_Medium : "Lato-Medium",

    Lato: 'Lato',
    LatoThin : '200',
    LatoLight: '300',
    LatoRegular: '400',
    LatoSemiBold: '500',
    LatoBold: 'bold',
    LatoNormal: 'normal',

    Roboto: 'Roboto',
    Roboto_Medium: 'Roboto-Medium',
    Roboto_Regular: 'Roboto-Regular',

    width:width,
    height:height,
    marginHorizontal:10,
    marginVertical:10,
    section:25,
    baseMargin:10,
    doubleBaseMargin:20,
    smallMargin:5,
    doubleSection:50,
    horizontalLineHeight:1,
    screenWidth:width<height?width:height,
    screenHeight:width<height?height:width,
    navBarHeight:(Platform.OS==='ios')?64:54,
    dimen_5 : NormalizeSize.getH(5),
    dimen_6 : NormalizeSize.getH(6),
    dimen_7 : NormalizeSize.getH(7),
    dimen_1 : NormalizeSize.getH(1),
    dimen_tiny : NormalizeSize.getH(0.5),
    dimen_2 : NormalizeSize.getH(2),
    dimen_3 : NormalizeSize.getH(3),
    dimen_4 : NormalizeSize.getH(4),
    dimen_8 : NormalizeSize.getH(8),
    dimen_9 : NormalizeSize.getH(9),
    dimen_10: NormalizeSize.getH(10),
    dimen_12 : NormalizeSize.getH(12),
    dimen_13 : NormalizeSize.getH(13),
    dimen_14 : NormalizeSize.getH(14),
    dimen_15 : NormalizeSize.getH(15),
    dimen_16 : NormalizeSize.getH(16),
    dimen_18 : NormalizeSize.getH(18),
    dimen_20 : NormalizeSize.getH(20),
    dimen_22 : NormalizeSize.getH(22),
    dimen_24 : NormalizeSize.getH(24),
    dimen_28 : NormalizeSize.getH(24),
    dimen_25 : NormalizeSize.getH(25),
    dimen_27 : NormalizeSize.getH(27),
    dimen_30 : NormalizeSize.getH(30),
    dimen_32 : NormalizeSize.getH(32),
    dimen_35 : NormalizeSize.getH(35),
    dimen_36 : NormalizeSize.getH(36),
    dimen_37 : NormalizeSize.getH(37),
    dimen_40 : NormalizeSize.getH(40),
    dimen_42 : NormalizeSize.getH(42),
    dimen_44 : NormalizeSize.getH(44),
    dimen_45 : NormalizeSize.getH(45),
    dimen_46 : NormalizeSize.getH(46),
    dimen_48 : NormalizeSize.getH(48),
    dimen_49 : NormalizeSize.getH(49),
    dimen_50 : NormalizeSize.getH(50),
    dimen_54 : NormalizeSize.getH(54),
    dimen_55 : NormalizeSize.getH(55),
    dimen_56 : NormalizeSize.getH(56),
    dimen_60 : NormalizeSize.getH(60),
    dimen_64 : NormalizeSize.getH(64),
    dimen_65 : NormalizeSize.getH(65),
    dimen_70 : NormalizeSize.getH(70),
    dimen_72 : NormalizeSize.getH(72),
    dimen_75 : NormalizeSize.getH(75),
    dimen_80 : NormalizeSize.getH(80),
    dimen_85 : NormalizeSize.getH(85),
    dimen_90 : NormalizeSize.getH(90),
    dimen_92 : NormalizeSize.getH(92),
    dimen_96 : NormalizeSize.getH(96),
    dimen_100 : NormalizeSize.getH(100),
    dimen_120 : NormalizeSize.getH(120),
    dimen_140 :NormalizeSize.getH(140),
    dimen_145 :NormalizeSize.getH(145),
    dimen_150 : NormalizeSize.getH(150),
    dimen_155 : NormalizeSize.getH(155),
    dimen_160 : NormalizeSize.getH(160),
    dimen_170 : NormalizeSize.getH(170),
    dimen_183 : NormalizeSize.getH(183),
    dimen_190 : NormalizeSize.getH(190),
    dimen_200 : NormalizeSize.getH(200),
    dimen_230 : NormalizeSize.getH(230),
    dimen_210 : NormalizeSize.getH(210),
    dimen_280 : NormalizeSize.getH(280),
    dimen_300 : NormalizeSize.getH(300),
    dimen_360 : NormalizeSize.getH(360),
    getH : (size)=>NormalizeSize.getH(size),
    getHPercent : (percent)=>NormalizeSize.getHPercent(percent),
    getW : (size)=>NormalizeSize.getW(size),
    getWPercent : (percent)=>NormalizeSize.getWPercent(percent),
    getFontSize : (size)=>NormalizeSize.getFontSize(size),
    getHeightAspectRatio : (size)=>NormalizeSize.getHeightAspectRatio(size),

//Method for getting device width and height
aspectRatioHeight: (heightSize) => {
    return (heightSize / 1125) * Dimensions.get('window').width
 },
widthSize: (widthsize) => {
    return (widthsize / 1125) * Dimensions.get('window').width
 },

 heightSize:  (heightsize) => {
    return (heightsize / 2436) * Dimensions.get('window').height
 },

 size:  (size) => {
    return Math.ceil((size * scale))
 },

 deviceHeight: Dimensions.get('window').height,
 deviceWidth: Dimensions.get('window').width,


    icons:{
        tiny:15,
        small:20,
        medium:25,
        large:35,
        xl:50
    }
}

export default metrics
