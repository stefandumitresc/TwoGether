import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  RefreshControl,
} from 'react-native';
import { Card, Chip, Button, IconButton, Divider } from 'react-native-paper';
import { theme } from '../../theme';
import { useResponsiveDesign } from '../../hooks/useResponsiveDesign';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Restaurant, MenuItem, DiningPreferences, Location } from '../../types';
import {
  getRestaurantRecommendations,
  searchRestaurants,
  getRestaurantById,
  getMenuRecommendations,
  getAvailableReservations,
  makeReservation
} from '../../services/restaurantService';

const RestaurantsScreen = () => {
  const { spacing, fontSizes } = useResponsiveDesign();

  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'recommendations' | 'search'>('recommendations');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [partySize, setPartySize] = useState(2);

  // Mock user location and preferences
  const mockUserLocation: Location = {
    address: '123 Main St',
    city: 'Downtown',
    state: 'CA',
    zipCode: '90210',
    latitude: 34.0522,
    longitude: -118.2437
  };

  const mockUserPreferences: DiningPreferences = {
    cuisineTypes: ['Italian', 'Japanese', 'Mexican'],
    dislikedCuisines: ['Indian'],
    priceRange: 'moderate',
    atmospherePreference: 'romantic',
    dietaryRestrictions: [{ type: 'vegetarian', strict: false }],
    allergies: [],
    maxDistance: 10
  };

  const mockPartnerPreferences: DiningPreferences = {
    cuisineTypes: ['Italian', 'Seafood', 'Vegetarian'],
    dislikedCuisines: ['Mexican'],
    priceRange: 'upscale',
    atmospherePreference: 'quiet',
    dietaryRestrictions: [],
    allergies: ['shellfish'],
    maxDistance: 15
  };

  const loadRecommendations = async () => {
    setLoading(true);
    try {
      const recommendations = getRestaurantRecommendations(
        mockUserPreferences,
        mockPartnerPreferences,
        mockUserLocation
      );
      setRestaurants(recommendations);
    } catch (error) {
      Alert.alert('Error', 'Failed to load restaurant recommendations');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.length > 0) {
      const results = searchRestaurants(query);
      setRestaurants(results);
    } else {
      loadRecommendations();
    }
  };

  const handleRestaurantPress = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
    setModalVisible(true);
  };

  const handleMakeReservation = (restaurantId: string, reservationId: string) => {
    const success = makeReservation(restaurantId, reservationId, partySize);
    if (success) {
      Alert.alert('Success', 'Reservation confirmed!');
      setModalVisible(false);
    } else {
      Alert.alert('Error', 'Failed to make reservation');
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadRecommendations();
    setRefreshing(false);
  };

  useEffect(() => {
    loadRecommendations();
  }, []);

  const getPriceRangeSymbol = (priceRange: string) => {
    switch (priceRange) {
      case 'budget': return '$';
      case 'moderate': return '$$';
      case 'upscale': return '$$$';
      case 'fine-dining': return '$$$$';
      default: return '$$';
    }
  };

  const renderRestaurantCard = (restaurant: Restaurant) => (
    <TouchableOpacity
      key={restaurant.id}
      onPress={() => handleRestaurantPress(restaurant)}
      style={[styles.restaurantCard, { backgroundColor: theme.colors.surface }]}
    >
      <View style={styles.restaurantHeader}>
        <View style={styles.restaurantInfo}>
          <Text style={[styles.restaurantName, { color: theme.colors.onSurface, fontSize: fontSizes.large }]}>
            {restaurant.name}
          </Text>
          <View style={styles.restaurantMeta}>
            <Text style={[styles.cuisineType, { color: theme.colors.onSurfaceVariant, fontSize: fontSizes.medium }]}>
              {restaurant.cuisineType}
            </Text>
            <Text style={[styles.priceRange, { color: theme.colors.primary, fontSize: fontSizes.medium }]}>
              {getPriceRangeSymbol(restaurant.priceRange)}
            </Text>
          </View>
          <View style={styles.ratingContainer}>
            <Text style={[styles.rating, { color: theme.colors.primary, fontSize: fontSizes.small }]}>
              ⭐ {restaurant.rating}
            </Text>
            <Text style={[styles.reviewCount, { color: theme.colors.onSurfaceVariant, fontSize: fontSizes.small }]}>
              ({restaurant.reviewCount} reviews)
            </Text>
            {restaurant.distance && (
              <Text style={[styles.distance, { color: theme.colors.onSurfaceVariant, fontSize: fontSizes.small }]}>
                • {restaurant.distance.toFixed(1)} mi
              </Text>
            )}
          </View>
        </View>
        {restaurant.matchScore && (
          <View style={[styles.matchScore, { backgroundColor: theme.colors.primaryContainer }]}>
            <Text style={[styles.matchText, { color: theme.colors.onPrimaryContainer, fontSize: fontSizes.small }]}>
              {restaurant.matchScore}% match
            </Text>
          </View>
        )}
      </View>

      <View style={styles.atmosphereContainer}>
        {restaurant.atmosphere.map((atmosphere, index) => (
          <Chip
            key={index}
            mode="outlined"
            style={[styles.atmosphereChip, { marginRight: spacing.sm }]}
            textStyle={{ fontSize: fontSizes.small }}
          >
            {atmosphere}
          </Chip>
        ))}
      </View>

      <View style={styles.dietaryContainer}>
        {restaurant.dietaryAccommodations.slice(0, 3).map((accommodation, index) => (
          <Text key={index} style={[styles.dietaryTag, { color: theme.colors.secondary, fontSize: fontSizes.small }]}>
            {accommodation}
          </Text>
        ))}
      </View>
    </TouchableOpacity>
  );

  const renderRestaurantModal = () => {
    if (!selectedRestaurant) return null;

    const menuRecommendations = getMenuRecommendations(
      selectedRestaurant,
      mockUserPreferences,
      mockPartnerPreferences
    );

    const availableReservations = getAvailableReservations(
      selectedRestaurant.id,
      selectedDate,
      partySize
    );

    return (
      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setModalVisible(false)}
      >
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: theme.colors.background }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: theme.colors.onSurface, fontSize: fontSizes.large }]}>
              {selectedRestaurant.name}
            </Text>
            <IconButton
              icon="close"
              onPress={() => setModalVisible(false)}
              iconColor={theme.colors.onSurface}
            />
          </View>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            <View style={styles.restaurantDetails}>
              <View style={styles.restaurantMeta}>
                <Text style={[styles.cuisineType, { color: theme.colors.onSurfaceVariant, fontSize: fontSizes.medium }]}>
                  {selectedRestaurant.cuisineType}
                </Text>
                <Text style={[styles.priceRange, { color: theme.colors.primary, fontSize: fontSizes.medium }]}>
                  {getPriceRangeSymbol(selectedRestaurant.priceRange)}
                </Text>
              </View>

              <View style={styles.ratingContainer}>
                <Text style={[styles.rating, { color: theme.colors.primary, fontSize: fontSizes.medium }]}>
                  ⭐ {selectedRestaurant.rating}
                </Text>
                <Text style={[styles.reviewCount, { color: theme.colors.onSurfaceVariant, fontSize: fontSizes.medium }]}>
                  ({selectedRestaurant.reviewCount} reviews)
                </Text>
              </View>

              <Text style={[styles.address, { color: theme.colors.onSurfaceVariant, fontSize: fontSizes.medium }]}>
                {selectedRestaurant.location.address}, {selectedRestaurant.location.city}
              </Text>

              <View style={[styles.atmosphereContainer, { marginTop: spacing.md }]}>
                {selectedRestaurant.atmosphere.map((atmosphere, index) => (
                  <Chip
                    key={index}
                    mode="outlined"
                    style={[styles.atmosphereChip, { marginRight: spacing.sm }]}
                    textStyle={{ fontSize: fontSizes.small }}
                  >
                    {atmosphere}
                  </Chip>
                ))}
              </View>

              <View style={styles.dietaryContainer}>
                <Text style={[styles.dietaryTitle, { color: theme.colors.onSurface, fontSize: fontSizes.medium }]}>
                  Dietary Accommodations:
                </Text>
                {selectedRestaurant.dietaryAccommodations.map((accommodation, index) => (
                  <Text key={index} style={[styles.dietaryTag, { color: theme.colors.secondary, fontSize: fontSizes.small }]}>
                    • {accommodation}
                  </Text>
                ))}
              </View>
            </View>

            <Divider style={{ marginVertical: spacing.lg }} />

            <View style={styles.menuSection}>
              <Text style={[styles.sectionTitle, { color: theme.colors.onSurface, fontSize: fontSizes.large }]}>
                Menu Highlights
              </Text>
              <Text style={[styles.sectionSubtitle, { color: theme.colors.onSurfaceVariant, fontSize: fontSizes.medium }]}>
                Recommended based on your preferences
              </Text>

              {menuRecommendations.map((item, index) => (
                <View
                  key={index}
                  style={[
                    styles.menuItem,
                    !item.matchesPreferences && { opacity: 0.6 }
                  ]}
                >
                  <View style={styles.menuItemHeader}>
                    <Text style={[styles.menuItemName, { color: theme.colors.onSurface, fontSize: fontSizes.medium }]}>
                      {item.name}
                      {item.matchesPreferences && (
                        <Text style={[styles.recommendedTag, { color: theme.colors.primary, fontSize: fontSizes.small }]}>
                          {' '}✓ Recommended
                        </Text>
                      )}
                    </Text>
                    <Text style={[styles.menuItemPrice, { color: theme.colors.primary, fontSize: fontSizes.medium }]}>
                      ${item.price}
                    </Text>
                  </View>
                  <Text style={[styles.menuItemDescription, { color: theme.colors.onSurfaceVariant, fontSize: fontSizes.small }]}>
                    {item.description}
                  </Text>
                  <View style={styles.menuItemTags}>
                    {item.dietaryTags.map((tag, tagIndex) => (
                      <Chip
                        key={tagIndex}
                        mode="outlined"
                        style={[styles.dietaryChip, { marginRight: spacing.sm }]}
                        textStyle={{ fontSize: fontSizes.small }}
                      >
                        {tag}
                      </Chip>
                    ))}
                  </View>
                </View>
              ))}
            </View>

            <Divider style={{ marginVertical: spacing.lg }} />

            <View style={styles.reservationSection}>
              <Text style={[styles.sectionTitle, { color: theme.colors.onSurface, fontSize: fontSizes.large }]}>
                Make Reservation
              </Text>

              <View style={styles.reservationControls}>
                <View style={styles.partySizeContainer}>
                  <Text style={[styles.controlLabel, { color: theme.colors.onSurface, fontSize: fontSizes.medium }]}>
                    Party Size:
                  </Text>
                  <View style={styles.partySizeButtons}>
                    <TouchableOpacity
                      style={[styles.partySizeButton, { borderColor: theme.colors.primary }]}
                      onPress={() => setPartySize(Math.max(1, partySize - 1))}
                    >
                      <Text style={[styles.partySizeButtonText, { color: theme.colors.primary }]}>-</Text>
                    </TouchableOpacity>
                    <Text style={[styles.partySizeText, { color: theme.colors.onSurface, fontSize: fontSizes.medium }]}>
                      {partySize}
                    </Text>
                    <TouchableOpacity
                      style={[styles.partySizeButton, { borderColor: theme.colors.primary }]}
                      onPress={() => setPartySize(partySize + 1)}
                    >
                      <Text style={[styles.partySizeButtonText, { color: theme.colors.primary }]}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              <Text style={[styles.availableTimesTitle, { color: theme.colors.onSurface, fontSize: fontSizes.medium }]}>
                Available Times for {selectedDate.toLocaleDateString()}:
              </Text>

              {availableReservations.length === 0 ? (
                <Text style={[styles.noReservationsText, { color: theme.colors.onSurfaceVariant, fontSize: fontSizes.medium }]}>
                  No available reservations for this date
                </Text>
              ) : (
                <View style={styles.reservationTimes}>
                  {availableReservations.map((reservation) => (
                    <TouchableOpacity
                      key={reservation.id}
                      style={[styles.reservationTime, { backgroundColor: theme.colors.primaryContainer }]}
                      onPress={() => handleMakeReservation(selectedRestaurant.id, reservation.id)}
                    >
                      <Text style={[styles.reservationTimeText, { color: theme.colors.onPrimaryContainer, fontSize: fontSizes.medium }]}>
                        {reservation.time}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.colors.onSurface, fontSize: fontSizes.headline }]}>
          Restaurants
        </Text>

        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'recommendations' && { backgroundColor: theme.colors.primaryContainer }
            ]}
            onPress={() => {
              setActiveTab('recommendations');
              setSearchQuery('');
              loadRecommendations();
            }}
          >
            <Text style={[
              styles.tabText,
              {
                color: activeTab === 'recommendations' ? theme.colors.onPrimaryContainer : theme.colors.onSurface,
                fontSize: fontSizes.medium
              }
            ]}>
              For You
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'search' && { backgroundColor: theme.colors.primaryContainer }
            ]}
            onPress={() => setActiveTab('search')}
          >
            <Text style={[
              styles.tabText,
              {
                color: activeTab === 'search' ? theme.colors.onPrimaryContainer : theme.colors.onSurface,
                fontSize: fontSizes.medium
              }
            ]}>
              Search
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {activeTab === 'search' && (
        <View style={[styles.searchContainer, { backgroundColor: theme.colors.surface }]}>
          <TextInput
            style={[styles.searchInput, { color: theme.colors.onSurface, fontSize: fontSizes.medium }]}
            placeholder="Search restaurants..."
            placeholderTextColor={theme.colors.onSurfaceVariant}
            value={searchQuery}
            onChangeText={handleSearch}
          />
          <IconButton
            icon="magnify"
            iconColor={theme.colors.onSurface}
            onPress={() => handleSearch(searchQuery)}
          />
        </View>
      )}

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
          />
        }
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={[styles.loadingText, { color: theme.colors.onSurface, fontSize: fontSizes.medium }]}>
              Loading restaurants...
            </Text>
          </View>
        ) : restaurants.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: theme.colors.onSurfaceVariant, fontSize: fontSizes.medium }]}>
              {searchQuery ? 'No restaurants found' : 'No recommendations available'}
            </Text>
          </View>
        ) : (
          <View style={styles.restaurantsList}>
            {restaurants.map(renderRestaurantCard)}
          </View>
        )}
      </ScrollView>

      {renderRestaurantModal()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    paddingBottom: 8,
  },
  headerTitle: {
    fontWeight: 'bold',
    marginBottom: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 8,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
  },
  tabText: {
    fontWeight: '500',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 8,
    elevation: 1,
  },
  searchInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  content: {
    flex: 1,
  },
  restaurantsList: {
    padding: 16,
  },
  restaurantCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
  },
  restaurantHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  restaurantInfo: {
    flex: 1,
  },
  restaurantName: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  restaurantMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  cuisineType: {
    marginRight: 8,
  },
  priceRange: {
    fontWeight: '500',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  rating: {
    marginRight: 4,
  },
  reviewCount: {
    marginRight: 4,
  },
  distance: {},
  matchScore: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  matchText: {
    fontWeight: '500',
  },
  atmosphereContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  atmosphereChip: {
    marginBottom: 4,
  },
  dietaryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dietaryTitle: {
    fontWeight: '500',
    marginBottom: 4,
    width: '100%',
  },
  dietaryTag: {
    marginRight: 16,
    marginBottom: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  loadingText: {
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  modalTitle: {
    fontWeight: 'bold',
    flex: 1,
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  restaurantDetails: {
    marginBottom: 16,
  },
  address: {
    marginTop: 8,
    marginBottom: 8,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  sectionSubtitle: {
    marginBottom: 16,
  },
  menuSection: {
    marginBottom: 16,
  },
  menuItem: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  menuItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  menuItemName: {
    fontWeight: '500',
    flex: 1,
  },
  recommendedTag: {
    fontWeight: '400',
  },
  menuItemPrice: {
    fontWeight: '500',
  },
  menuItemDescription: {
    marginBottom: 8,
    lineHeight: 18,
  },
  menuItemTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dietaryChip: {
    marginBottom: 4,
  },
  reservationSection: {
    marginBottom: 16,
  },
  reservationControls: {
    marginBottom: 16,
  },
  partySizeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  controlLabel: {
    fontWeight: '500',
  },
  partySizeButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  partySizeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  partySizeButtonText: {
    fontSize: 18,
    fontWeight: '500',
  },
  partySizeText: {
    marginHorizontal: 16,
    fontWeight: '500',
  },
  availableTimesTitle: {
    fontWeight: '500',
    marginBottom: 12,
  },
  noReservationsText: {
    textAlign: 'center',
    fontStyle: 'italic',
  },
  reservationTimes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  reservationTime: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  reservationTimeText: {
    fontWeight: '500',
  },
});

export default RestaurantsScreen; 