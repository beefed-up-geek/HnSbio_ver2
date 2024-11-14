import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 20,
  },
  cameraContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  camera: {
    flex: 1,
    top: 10,
    left: 0,
    width: '100%',
    height: '100%',
  },
  imageContainer: {
    width: '100%',
    height: '70%',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    backgroundColor: '#ffffffaa',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: '#000',
  },
  captureButton: {
    position: 'absolute',
    bottom: 30,
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#ffffffaa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  resultContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 10,
  },
  result: {
    fontSize: 18,
    color: '#555555',
    marginBottom: 20,
  },
  percentageContainer: {
    width: '100%',
    marginBottom: 20,
  },
  percentageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  percentage: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  label: {
    fontSize: 16,
    color: '#777777',
  },
});

export default styles;
