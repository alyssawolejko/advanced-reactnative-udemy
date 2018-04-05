import React from 'react';
import { StyleSheet, Text, View, KeyboardAvoidingView } from 'react-native';
import SignUpForm from './components/SignUpForm';
import SignInForm from './components/SignInForm';

export default class App extends React.Component {
  state = { token: null }

  renderToken() {
    if (this.state.token){
      return (
        <Text>Token: {this.state.token}</Text>      
      )
    }
  }
  render() {
    return (
      <KeyboardAvoidingView style={styles.container}>
        <SignUpForm />
        <View style={{ marginVertical: 20 }}>
          <SignInForm setToken={(token) => this.setState({token: token})}/>
        </View>
        {this.renderToken()}
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
