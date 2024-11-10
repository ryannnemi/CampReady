import { openNavigationApp } from '../Functions/openNavigationApp';
import { Linking, Alert, Platform } from 'react-native';
import NetInfo from '@react-native-community/netinfo';

// Mock the NetInfo and Linking modules
jest.mock('@react-native-community/netinfo', () => ({
  fetch: jest.fn(),
}));

jest.mock('react-native', () => ({
  Linking: {
    openURL: jest.fn(),
  },
  Alert: {
    alert: jest.fn(),
  },
  Platform: {
    select: jest.fn(),
  },
}));

describe('openNavigationApp', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  //////////////////////////////////
  // 14.1a - Load Navigation iOS //
  ////////////////////////////////

  it('14.1a - Load Navigation iOS', async () => {
    
    // Simulate internet connection
    NetInfo.fetch.mockResolvedValueOnce({ isConnected: true });

    // Mock Platform.select to return correct iOS URLs
    Platform.select.mockReturnValueOnce('maps:0,0?q=12.34,56.78');

    const mockItem = { location: { latitude: 44.339, longitude: -68.273 } };
    await openNavigationApp(mockItem);

    // Check for iOS URL
    expect(Linking.openURL).toHaveBeenCalledWith('maps:0,0?q=12.34,56.78'); 
    expect(Alert.alert).not.toHaveBeenCalled();
  });

  //////////////////////////////////////
  // 14.1b - Load Navigation Android //
  ////////////////////////////////////

  it('14.1b - Load Navigation Android', async () => {
    
    // Simulate internet connection
    NetInfo.fetch.mockResolvedValueOnce({ isConnected: true });

    // Mock Platform.select to return correct Android URLs
    Platform.select.mockReturnValueOnce('geo:0,0?q=12.34,56.78');

    const mockItem = { location: { latitude: 44.339, longitude: -68.273 } };
    await openNavigationApp(mockItem);

    // Check for Android URL
    expect(Linking.openURL).toHaveBeenCalledWith('geo:0,0?q=12.34,56.78'); 
    expect(Alert.alert).not.toHaveBeenCalled();
  });

  ///////////////////////////////////
  // 14.2 - Missing Location Data //
  /////////////////////////////////

  it('14.2 - Missing Location Data', async () => {
    
    // Set location as null
    const mockItem = { location: {} };
    await openNavigationApp(mockItem);

    expect(Alert.alert).toHaveBeenCalledWith("Location information is missing");
    expect(Linking.openURL).not.toHaveBeenCalled(); 
  });

  /////////////////////////
  // 14.3 - No Internet //
  ///////////////////////

  it('14.3 - No Internet', async () => {
    
    // Simulate no internet connection
    NetInfo.fetch.mockResolvedValueOnce({ isConnected: false });

    const mockItem = { location: { latitude: 36.268, longitude: -112.354 } };
    await openNavigationApp(mockItem);

    expect(Alert.alert).toHaveBeenCalledWith(
      "No internet connection",
      "Please check your network connection and try again."
    );
    expect(Linking.openURL).not.toHaveBeenCalled();
  });  
});
