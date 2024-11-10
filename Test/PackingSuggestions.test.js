// PackingSuggesitons.test.js
import { waitFor } from '@testing-library/react-native';
import { getRecommendedItems } from '../Functions/getRecommendedItems';
import axios from 'axios';
import { Alert } from 'react-native';

jest.mock('axios');
jest.spyOn(Alert, 'alert');
jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
}));

describe('getRecommendedItems', () => {
  const mockNavigate = jest.fn();
  const mockNavigation = { navigate: mockNavigate };

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Test Case 13.1 - Sunny Warm Hiking
  test('13.1 - Sunny Warm Hiking', async () => {

    const reservation = {
      id: '13.1',
      location: { name: 'Yosemite National Park', latitude: 37.86, longitude: -119.53 },
    };

    const weatherData = {
      '13.1': { main: { temp: 80 }, weather: [{ description: 'sunny' }] },
    };

    // Mock axios response
    axios.get.mockResolvedValueOnce({
      data: {
        RECDATA: [{ RecAreaID: 2991, RecAreaName: 'Yosemite National Park' }],
      },
    });
    axios.get.mockResolvedValueOnce({
      data: {
        RECDATA: [{ ActivityName: 'Hiking' }],
      },
    });

    await getRecommendedItems(reservation, weatherData, mockNavigation);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('Create List', expect.objectContaining({
        initialItems: expect.arrayContaining(['Shorts', 'T-shirts', 'Sunglasses', 'Sunscreen', 'Hat', 'Hiking boots', 'Backpack']),
        listName: 'Packing List for Yosemite National Park'
      }));
    });
  });


  // Test Case 13.2 - Rainy Cool Camping
  test('13.2 - Rainy Cool Camping', async () => {

    const reservation = {
      id: '13.2',
      location: { name: 'Olympic National Park', latitude: 47.802, longitude: -123.604 },
    };

    const weatherData = {
      '13.2': { main: { temp: 55 }, weather: [{ description: 'rain' }] },
    };

    // Mock axios response
    axios.get.mockResolvedValueOnce({
      data: {
        RECDATA: [{ RecAreaID: 2881, RecAreaName: 'Olympic National Park' }],
      },
    });
    axios.get.mockResolvedValueOnce({
      data: {
        RECDATA: [{ ActivityName: 'Camping' }],
      },
    });

    await getRecommendedItems(reservation, weatherData, mockNavigation);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('Create List', expect.objectContaining({
        initialItems: expect.arrayContaining(['Light jacket', 'Long pants', 'Comfortable shoes', 'Raincoat', 'Umbrella', 'Waterproof shoes', 'Tent', 'Sleeping bag', 'Camp stove']),
        listName: 'Packing List for Olympic National Park'
      }));
    });
  });


  // Test Case 13.3 - Snowy Cold
  test('13.3 - Snowy Cold', async () => {

    const reservation = {
      id: '13.3',
      location: { name: 'Rocky Mountain National Park', latitude: 40.343, longitude: -105.684 },
    };

    const weatherData = {
      '13.3': { main: { temp: 25 }, weather: [{ description: 'snow' }] },
    };

    // Mock axios response
    axios.get.mockResolvedValueOnce({
      data: {
        RECDATA: [{ RecAreaID: 2907, RecAreaName: 'Rocky Mountain National Park' }],
      },
    });
    axios.get.mockResolvedValueOnce({
      data: {
        RECDATA: [{ ActivityName: ' ' }],
      },
    });

    await getRecommendedItems(reservation, weatherData, mockNavigation);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('Create List', expect.objectContaining({
        initialItems: expect.arrayContaining(['Heavy coat', 'Waterproof boots', 'Warm hat', 'Gloves', 'Scarf']),
        listName: 'Packing List for Rocky Mountain National Park'
      }));
    });
  });


  // Test Case 13.4 - Hot Boating
  test('13.4 - Hot Windy Boating', async () => {

    const reservation = {
      id: '13.4',
      location: { name: 'Everglades National Park', latitude: 25.289, longitude: -80.899 },
    };

    const weatherData = {
      '13.4': { main: { temp: 85 }, weather: [{ description: 'windy' }] },
    };

    // Mock axios response
    axios.get.mockResolvedValueOnce({
      data: {
        RECDATA: [{ RecAreaID: 2677, RecAreaName: 'Everglades National Park' }],
      },
    });
    axios.get.mockResolvedValueOnce({
      data: {
        RECDATA: [{ ActivityName: 'Boating' }],
      },
    });

    await getRecommendedItems(reservation, weatherData, mockNavigation);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('Create List', expect.objectContaining({
        initialItems: expect.arrayContaining(['Shorts', 'T-shirts', 'Life jacket', 'Sunscreen', 'Hat', 'Sunglasses', 'Waterproof bag']),
        listName: 'Packing List for Everglades National Park'
      }));
    });
  });


    // Test Case 13.5 - Foggy Cool Horesback Riding
    test('13.5 - Foggy Cool Horesback Riding', async () => {

      const reservation = {
        id: '13.5',
        location: { name: 'Great Smoky Mountains National Park', latitude: 35.613, longitude: -83.553 },
      };
  
      const weatherData = {
        '13.5': { main: { temp: 45 }, weather: [{ description: 'fog' }] },
      };
  
      // Mock axios response
      axios.get.mockResolvedValueOnce({
        data: {
          RECDATA: [{ RecAreaID: 2739, RecAreaName: 'Great Smoky Mountains National Park' }],
        },
      });
      axios.get.mockResolvedValueOnce({
        data: {
          RECDATA: [{ ActivityName: 'Horseback riding' }],
        },
      });
  
      await getRecommendedItems(reservation, weatherData, mockNavigation);
  
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('Create List', expect.objectContaining({
          initialItems: expect.arrayContaining(['Warm coat', 'Gloves', 'Scarf', 'Warm socks', 'Long pants', 'Closed-toe shoes', 'Helmet', 'Gloves']),
          listName: 'Packing List for Great Smoky Mountains National Park'
        }));
      });
    });

    
  // Test Case 13.6 - Missing Weather Data
  test('13.6 - Missing Weather Data', async () => {

    const reservation = {
      id: '13.6',
      location: { name: 'Yellowstone National Park', latitude: 44.598, longitude: -110.561 },
    };

    // Set weather to null
    const weatherData = {
      '13.6': null,
    };

    // Mock axios response
    axios.get.mockResolvedValueOnce({
      data: {
        RECDATA: [{ RecAreaID: 2988, RecAreaName: 'Yellowstone National Park' }],
      },
    });
    axios.get.mockResolvedValueOnce({
      data: {
        RECDATA: [{ ActivityName: 'Camping' }],
      },
    });

    await getRecommendedItems(reservation, weatherData, mockNavigation);

    // Assert that Alert.alert was called with the correct message
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('No weather data available');
    });

    // Assert that navigation was not called
    expect(mockNavigate).not.toHaveBeenCalled();
    });
});
