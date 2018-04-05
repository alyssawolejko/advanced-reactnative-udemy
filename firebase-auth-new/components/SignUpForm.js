import React, { Component } from 'react'
import { View, Text } from 'react-native'
import { FormLabel, FormInput, Button } from 'react-native-elements'
import axios from 'axios'

class SignUpForm extends Component {
  state = { phone: '' }

  handleSubmit = async () => {
    const HOST = `https://us-central1-one-time-password-7f751.cloudfunctions.net`
    try {
      await axios.post(`${HOST}/createUser`, { phone: this.state.phone })
      await axios.post(`${HOST}/requestOneTimePassword`, { phone: this.state.phone })
    } catch (err) {
      console.log(err)
    }
  }

  render(){
    return(
      <View>
        <View style={{ marginBottom: 10 }}>
          <FormLabel>Enter New Phone Number</FormLabel>
          <FormInput 
            value={this.state.phone}
            onChangeText={phone => this.setState({ phone })}
          />
        </View>
        <Button onPress={this.handleSubmit} title="Submit"/>
      </View>
    )
  }
}

export default SignUpForm