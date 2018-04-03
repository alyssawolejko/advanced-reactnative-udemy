import React, { Component } from 'react'
import { 
  View,
  Animated,
  PanResponder,
  Dimensions, 
  LayoutAnimation,
  UIManager
} from 'react-native'

import { Icon } from 'react-native-elements'


const SCREEN_WIDTH = Dimensions.get('window').width
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25
const SWIPE_OUT_DURATION = 250

class Deck extends Component {
  static defaultProps = {
    onSwipeLeft: () => {},
    onSwipeRight: () => {}
  }
  constructor(props){
    super(props);
    const position = new Animated.ValueXY();
    const panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true, // this instance is responsible for gesture
      onPanResponderMove: (event, gesture) => {
        position.setValue({ x: gesture.dx, y: gesture.dy });
      }, 
      onPanResponderRelease: (event, gesture) => {
        if (gesture.dx > SWIPE_THRESHOLD){
          this.forceSwipeOut('right')
        } else if (gesture.dx < -SWIPE_THRESHOLD){
          this.forceSwipeOut('left')
        } else {
          this.resetPosition();
        }
      }
    });
    this.panResponder = panResponder
    this.position = position
    this.state = {
      index: 0
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.data !== this.props.data){
      this.setState({ index: 0 })
    }
  }

  componentWillUpdate() {
    // android
    UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
    LayoutAnimation.spring();
  }

  forceSwipeOut(direction) {
    const x = direction === 'right' ? SCREEN_WIDTH : -SCREEN_WIDTH
    Animated.timing(this.position, {
      toValue: { x, y: 0 }, 
      duration: SWIPE_OUT_DURATION
    }).start(() => {
      this.onSwipeComplete(direction);
    });
  } 

  onSwipeComplete(direction, index) {
    const { onSwipeLeft, onSwipeRight, data } = this.props;
    const item = data[this.state.index];
    direction === 'right' ? onSwipeRight(item) : onSwipeLeft(item);
    this.setState({ index: this.state.index + 1 });
    this.position.setValue({x: 0, y: 0});
    // this.resetPosition();
  }

  resetPosition() {
    Animated.spring(this.position, {
      toValue: { x: 0, y: 0 }
    }).start();
  }

  getCardStyle() {
    const { position } = this
    const rotate = position.x.interpolate({
      inputRange: [-SCREEN_WIDTH * 2, 0, SCREEN_WIDTH * 2],
      outputRange: ['-120deg', '0deg', '120deg']
    });
    return {
      ...position.getLayout(),
      transform: [{ rotate }]
    }
  }

  renderFeedback(option) {
    return (
      <View style={styles.feedback}>
        {option === 0 ? 
          <Icon
            name='ios-close'
            type='ionicon'
            color='red'
          /> : 
          <Icon
            name='ios-heart'
            type='ionicon'
            color='green'
          />
        }
      </View>
    )
  }

  renderCards = () => {
    if (this.state.index >= this.props.data.length){
      return this.props.renderNoMoreCards();
    }
    return this.props.data.map((item, i) => {
      if (i < this.state.index) {
        return null;
      }
      else if (i === this.state.index) {
        return (
          <Animated.View 
            key={item.id}
            style={[styles.cardStyle, this.getCardStyle()]}
            {...this.panResponder.panHandlers}
            >
            {this.props.renderCard(item)}
          </Animated.View>
        )
      } else {
        return (
          <Animated.View 
            key={item.id} 
            style={[styles.cardStyle, { top: 10 * (i - this.state.index) }]}>
            {this.props.renderCard(item)}
          </Animated.View>   
        )     
      } 
    }).reverse();
  }

  render(){
    return (
      <View>
        {this.renderCards()}
      </View>
    )
  }
}

const styles = {
  cardStyle: {
    position: 'absolute', 
    width: '100%'
  }, 
  feedback: {
    flex: 1,
    justifyContent: 'center', 
    alignItems: 'center', 
  }
}

export default Deck;