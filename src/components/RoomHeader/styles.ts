import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'red',
    maxHeight: 40,
    zIndex: 99999,
  },
  button: {
    position: 'absolute',
    top: '10%',
    right: 20,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,.8)',
  },
  buttonSwitch: {
    position: 'absolute',
    top: '3%',
    right: 20,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,.8)',
  },
});
