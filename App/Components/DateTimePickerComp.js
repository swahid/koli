import React, {Component} from 'react'
import DateTimePicker from "react-native-modal-datetime-picker";


export default class DateTimePickerComp extends Component{
    render(){
        return(
            <DateTimePicker
            mode={this.props.mode}  
            minimumDate={this.props.minimumDate} 
            maximumDate={this.props.maximumDate}         
            isVisible={this.props.isDateTimePickerVisible}
            onConfirm={this.props.handleDatePicked}
            onCancel={this.props.hideDateTimePicker}
            timePickerModeAndroid={'spinner'}
            is24Hour={false}
        />
        )
    }
}