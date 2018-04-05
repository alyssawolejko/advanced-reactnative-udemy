import React, { Component } from 'react'
import { View, Text } from 'react-native'
import { FormLabel, FormInput, Button } from 'react-native-elements'
import axios from 'axios'

class SignInForm extends Component {
  state = { phone: '', code: '' }

  handleSubmit = async () => {
    const HOST = `https://us-central1-one-time-password-7f751.cloudfunctions.net`
    try {
      const res = await axios.post(`${HOST}/verifyOneTimePassword`, { phone: this.state.phone, code: this.state.code })
      this.props.setToken(res.data.token)
    } catch (err) {
      console.log(err)
    }
  }

  render(){
    return(
      <View>
        <View style={{ marginBottom: 10 }}>
          <FormLabel>Enter Phone Number</FormLabel>
          <FormInput 
            value={this.state.phone}
            onChangeText={phone => this.setState({ phone })}
          />
          <FormLabel>Enter Code</FormLabel>          
          <FormInput 
            value={this.state.code}
            onChangeText={code => this.setState({ code })}
          />
        </View>
        <Button onPress={this.handleSubmit} title="Submit"/>
      </View>
    )
  }
}

export default SignInForm