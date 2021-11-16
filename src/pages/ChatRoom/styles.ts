import { Dimensions, StyleSheet } from 'react-native';

const dimensions = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height,
};

export const styles = StyleSheet.create({
  frame: {
    flex: 1,
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#0093E9',
    borderRadius: 25,
  },
  fullView: {
    flex: 1,
    width: dimensions.width,
    height: dimensions.height - 100,
    backgroundColor: 'black',
  },
  remoteContainer: {
    paddingHorizontal: 2.5,
    width: '100%',
    height: 150,
    position: 'absolute',
    top: 5,
  },
  remote: {
    width: 150,
    height: 150,
    marginHorizontal: 2.5,
  },
  noUserText: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: '#0093E9',
  },
  loadingContainer: {
    marginTop: 'auto',
    marginBottom: 'auto',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: { marginTop: 20, fontSize: 16 },
});
