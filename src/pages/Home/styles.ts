import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: 'mistyrose',
    padding: 20,
  },
  title: {
    fontSize: 38,
    color: 'black',
    fontWeight: 'bold',
    marginTop: 30,
    marginBottom: 'auto',
    textAlign: 'center',
  },
  input: {
    color: 'black',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'grey',
    backgroundColor: 'ghostwhite',
    padding: 10,
    fontSize: 16,
  },
  inputError: {
    fontSize: 12,
    color: 'red',
  },
  button: {
    marginTop: 20,
    marginBottom: 40,
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 10,
    backgroundColor: 'royalblue',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
});
