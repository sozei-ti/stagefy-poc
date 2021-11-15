import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    height: 60,
    backgroundColor: '#0E0D0D',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  input: {
    width: '50%',
    height: 40,
    padding: 6,
    backgroundColor: '#1D1D1D',
    color: '#FFF',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
    borderRadius: 8,
    backgroundColor: 'transparent',
  },
  buttonText: {
    padding: 10,
    color: '#000',
  },
  giftImage: {
    width: 25,
    height: 25,
  },
});
