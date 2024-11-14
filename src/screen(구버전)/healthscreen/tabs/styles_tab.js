// src\screen(구버전)\healthscreen\tabs\styles_tab.js
import { StyleSheet } from 'react-native';
import theme from '../../../theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '120%',
    padding: 15,
    backgroundColor: '#F4F5FB', // Set the background color of the container
  },
  contentContainer: {
    paddingBottom: 100,  // Adjust this value based on your bottom navigation bar height
    width: '90%',
    marginLeft: '-3%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataText: {
    fontSize: 18,
    color: '#333',
  },
  recordContainer: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 24,
    marginBottom: 10,
  },
  title: {
    ...theme.fonts.Bold,
    color: "#4A4A4F",
    fontSize: 16,
    marginBottom: 8,
  },
  value: {
    ...theme.fonts.Medium,
    color: "#72777A",
    fontSize: 16,
    marginBottom: 5,
  },
  analysis: {
    ...theme.fonts.Medium,
    marginTop: 12,
    fontSize: 14,
    color: '#72777A',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  barContainer: {
    position: 'relative',
    width: 200,
    height: 30,
  },
  markerLine: (leftPosition) => ({
    position: 'absolute',
    left: leftPosition,
    top: 0,
    height: 30,
    width: 2,
    backgroundColor: 'white',
  }),
  markerText: (leftPosition) => ({
    position: 'absolute',
    left: leftPosition,
    top: 15,
    fontSize: 10,
    color: 'gray',
  }),
});
