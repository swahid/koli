import {Dimensions,Platform, PixelRatio} from 'react-native'

const base_height = 812//667//592
const base_width = 375//375//360

const {height,width} = Dimensions.get('window')

const scaleHeight = height/base_height
const scaleWidth = width/base_width
const font_scale = PixelRatio.getFontScale()

class NormalizeSize {

    constructor(){
        this.getH = this.getH.bind(this)
        this.getHPercent = this.getHPercent.bind(this)
        this.getW = this.getW.bind(this)
        this.getWPercent = this.getWPercent.bind(this)
        this.getFontSize = this.getFontSize.bind(this)  
    }

    getH = (size)=>{
        return Math.ceil(size*scaleHeight)
    }

    getHPercent = (percent) =>{
        try {
            let val  = (parseFloat(percent)*height)/100
            return Math.ceil(val*scaleHeight)
            
        } catch (error) {
            return 0
        }
    }
    getW = (size)=>{
        return Math.ceil(size*scaleWidth)
    }

    getWPercent = (percent) =>{
        try {
            let val  = (parseFloat(percent)*width)/100
            return Math.ceil(val*scaleWidth)
            
        } catch (error) {
            return 0
        }
    }

    getFontSize = (size) =>{
        size = size/font_scale
        if(Platform.OS === 'ios')
        {
          return Math.floor(size*scaleWidth);
        }else
          return Math.floor(size*scaleWidth);
    }

    getHeightAspectRatio = (base) =>{
        return (base/base_height * height)
    }
}

export default new NormalizeSize()
