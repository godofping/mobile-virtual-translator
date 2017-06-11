import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  // Empty. Add your own CSS if you like
  'spinner': {
    'margin': [{ 'unit': 'px', 'value': 100 }, { 'unit': 'string', 'value': 'auto' }, { 'unit': 'px', 'value': 100 }, { 'unit': 'string', 'value': 'auto' }],
    'width': [{ 'unit': 'px', 'value': 50 }],
    'height': [{ 'unit': 'px', 'value': 40 }],
    'textAlign': 'center',
    'fontSize': [{ 'unit': 'px', 'value': 10 }]
  },
  'spinner>div': {
    'marginTop': [{ 'unit': '%V', 'value': 0.8 }],
    'backgroundColor': '#bb0000',
    'height': [{ 'unit': '%V', 'value': 1 }],
    'width': [{ 'unit': 'px', 'value': 6 }],
    'display': 'inline-block',
    'WebkitAnimation': 'sk-stretchdelay 1.2s infinite ease-in-out',
    'animation': 'sk-stretchdelay 1.2s infinite ease-in-out'
  },
  'spinner rect2': {
    'WebkitAnimationDelay': '-1.1s',
    'animationDelay': '-1.1s'
  },
  'spinner rect3': {
    'WebkitAnimationDelay': '-1.0s',
    'animationDelay': '-1.0s'
  },
  'spinner rect4': {
    'WebkitAnimationDelay': '-0.9s',
    'animationDelay': '-0.9s'
  },
  'spinner rect5': {
    'WebkitAnimationDelay': '-0.8s',
    'animationDelay': '-0.8s'
  },
  '#talkButton': {
    'display': 'table',
    'margin': [{ 'unit': 'px', 'value': 0 }, { 'unit': 'string', 'value': 'auto' }, { 'unit': 'px', 'value': 0 }, { 'unit': 'string', 'value': 'auto' }],
    'marginTop': [{ 'unit': '%V', 'value': 0.6 }]
  },
  'button-right': {
    'display': 'block !important',
    'width': [{ 'unit': '%H', 'value': 1 }, { 'unit': 'string', 'value': '!important' }],
    'textAlign': 'right !important'
  },
  '[angular-ripple]': {
    'position': 'relative',
    'overflow': 'hidden'
  },
  'angular-ripple': {
    'display': 'block',
    'position': 'absolute',
    'backgroundColor': 'rgba(0,0,0,0.1)',
    'borderRadius': '50%',
    'transform': 'scale(0)'
  },
  'angular-rippleanimate': {
    'animation': 'ripple 0.35s linear'
  }
});
