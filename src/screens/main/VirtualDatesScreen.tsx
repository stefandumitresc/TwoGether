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
import { Card, Chip, Button, IconButton, Divider, SegmentedButtons } from 'react-native-paper';
import { theme } from '../../theme';
import { useResponsiveDesign } from '../../hooks/useResponsiveDesign';
import { SafeAreaView } from 'react-native-safe-area-context';
import { VirtualDate, SharedWishlist, SynchronizedPlan } from '../../types';
import {
  getVirtualDateRecommendations,
  searchVirtualDates,
  getSharedWishlist,
  getSynchronizedPlans,
  addToSharedWishlist,
  createSynchronizedPlan,
  completeWishlistItem,
  convertTimeToTimezone
} from '../../services/virtualDateService';

const VirtualDatesScreen = () => {
  const { spacing, fontSizes } = useResponsiveDesign();

  const [activeCategory, setActiveCategory] = useState<'virtual-dates' | 'wishlist' | 'plans'>('virtual-dates');
  const [virtualDates, setVirtualDates] = useState<VirtualDate[]>([]);
  const [wishlistItems, setWishlistItems] = useState<SharedWishlist[]>([]);
  const [synchronizedPlans, setSynchronizedPlans] = useState<SynchronizedPlan[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<VirtualDate | SharedWishlist | SynchronizedPlan | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'recommendations' | 'search'>('recommendations');

  // Mock preferences
  const mockUserPreferences = {
    virtualActivityTypes: ['movie-sync', 'game-night', 'video-call'],
    timezone: 'America/New_York'
  };

  const mockPartnerPreferences = {
    virtualActivityTypes: ['cooking-together', 'virtual-tour', 'video-call'],
    timezone: 'America/Los_Angeles'
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const virtualDateRecs = getVirtualDateRecommendations(mockUserPreferences, mockPartnerPreferences);
      const wishlist = getSharedWishlist();
      const plans = getSynchronizedPlans();

      setVirtualDates(virtualDateRecs);
      setWishlistItems(wishlist);
      setSynchronizedPlans(plans);
    } catch (error) {
      Alert.alert('Error', 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.length > 0 && activeCategory === 'virtual-dates') {
      const results = searchVirtualDates(query);
      setVirtualDates(results);
    } else if (query.length === 0) {
      loadData();
    }
  };

  const handleItemPress = (item: VirtualDate | SharedWishlist | SynchronizedPlan) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const handlePlanVirtualDate = (virtualDate: VirtualDate) => {
    Alert.alert(
      'Plan Virtual Date',
      `Plan "${virtualDate.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Plan Date',
          onPress: () => {
            const newPlan = createSynchronizedPlan({
              title: virtualDate.title,
              description: virtualDate.description,
              scheduledDate: new Date(),
              scheduledTime: '20:00',
              timezone1: mockUserPreferences.timezone,
              timezone2: mockPartnerPreferences.timezone,
              type: 'virtual',
              participants: ['user1', 'user2']
            });
            setSynchronizedPlans([...synchronizedPlans, newPlan]);
            Alert.alert('Success', 'Virtual date planned!');
            setModalVisible(false);
          }
        }
      ]
    );
  };

  const handleCompleteWishlistItem = (item: SharedWishlist) => {
    Alert.alert(
      'Complete Wishlist Item',
      `Mark "${item.title}" as completed?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Complete',
          onPress: () => {
            completeWishlistItem(item.id);
            setWishlistItems(wishlistItems.map(w =>
              w.id === item.id ? { ...w, completed: true, completedDate: new Date() } : w
            ));
            Alert.alert('Success', 'Wishlist item completed!');
            setModalVisible(false);
          }
        }
      ]
    );
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'movie-sync': return '🎬';
      case 'game-night': return '🎮';
      case 'cooking-together': return '👨‍🍳';
      case 'virtual-tour': return '🗺️';
      case 'video-call': return '📹';
      default: return '💕';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return theme.colors.error;
      case 'medium': return theme.colors.primary;
      case 'low': return theme.colors.secondary;
      default: return theme.colors.onSurfaceVariant;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return theme.colors.secondary;
      case 'planned': return theme.colors.primary;
      case 'completed': return theme.colors.outline;
      case 'cancelled': return theme.colors.error;
      default: return theme.colors.onSurfaceVariant;
    }
  };

  const renderVirtualDateCard = (virtualDate: VirtualDate) => (
    <TouchableOpacity
      key={virtualDate.id}
      onPress={() => handleItemPress(virtualDate)}
      style={[styles.itemCard, { backgroundColor: theme.colors.surface }]}
    >
      <View style={styles.itemHeader}>
        <View style={styles.itemInfo}>
          <View style={styles.titleRow}>
            <Text style={styles.typeIcon}>{getTypeIcon(virtualDate.type)}</Text>
            <Text style={[styles.itemTitle, { color: theme.colors.onSurface, fontSize: fontSizes.large }]}>
              {virtualDate.title}
            </Text>
          </View>
          <Text style={[styles.itemSubtitle, { color: theme.colors.onSurfaceVariant, fontSize: fontSizes.medium }]}>
            {virtualDate.duration} min • {virtualDate.timezoneFlexible ? 'Flexible timing' : 'Fixed timing'}
          </Text>
        </View>
        {virtualDate.matchScore && (
          <View style={[styles.matchScore, { backgroundColor: theme.colors.primaryContainer }]}>
            <Text style={[styles.matchText, { color: theme.colors.onPrimaryContainer, fontSize: fontSizes.small }]}>
              {virtualDate.matchScore}% match
            </Text>
          </View>
        )}
      </View>

      <Text style={[styles.itemDescription, { color: theme.colors.onSurfaceVariant, fontSize: fontSizes.medium }]}>
        {virtualDate.description}
      </Text>

      <View style={styles.appsContainer}>
        <Text style={[styles.appsLabel, { color: theme.colors.onSurfaceVariant, fontSize: fontSizes.small }]}>
          Required apps:
        </Text>
        <View style={styles.appsList}>
          {virtualDate.requiredApps.slice(0, 3).map((app, index) => (
            <Chip
              key={index}
              mode="outlined"
              style={[styles.appChip, { marginRight: spacing.sm }]}
              textStyle={{ fontSize: fontSizes.small }}
            >
              {app}
            </Chip>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderWishlistCard = (item: SharedWishlist) => (
    <TouchableOpacity
      key={item.id}
      onPress={() => handleItemPress(item)}
      style={[
        styles.itemCard,
        { backgroundColor: theme.colors.surface },
        item.completed && { opacity: 0.6 }
      ]}
    >
      <View style={styles.itemHeader}>
        <View style={styles.itemInfo}>
          <Text style={[styles.itemTitle, { color: theme.colors.onSurface, fontSize: fontSizes.large }]}>
            {item.title}
            {item.completed && <Text style={[styles.completedTag, { color: theme.colors.secondary }]}> ✓</Text>}
          </Text>
          <Text style={[styles.itemSubtitle, { color: theme.colors.onSurfaceVariant, fontSize: fontSizes.medium }]}>
            {item.category} • {item.estimatedCost ? `$${item.estimatedCost}` : 'Free'}
          </Text>
        </View>
        <View style={[styles.priorityIndicator, { backgroundColor: getPriorityColor(item.priority) }]}>
          <Text style={[styles.priorityText, { color: 'white', fontSize: fontSizes.small }]}>
            {item.priority}
          </Text>
        </View>
      </View>

      {item.description && (
        <Text style={[styles.itemDescription, { color: theme.colors.onSurfaceVariant, fontSize: fontSizes.medium }]}>
          {item.description}
        </Text>
      )}

      {item.notes && (
        <Text style={[styles.itemNotes, { color: theme.colors.primary, fontSize: fontSizes.small }]}>
          Note: {item.notes}
        </Text>
      )}
    </TouchableOpacity>
  );

  const renderSynchronizedPlanCard = (plan: SynchronizedPlan) => (
    <TouchableOpacity
      key={plan.id}
      onPress={() => handleItemPress(plan)}
      style={[styles.itemCard, { backgroundColor: theme.colors.surface }]}
    >
      <View style={styles.itemHeader}>
        <View style={styles.itemInfo}>
          <Text style={[styles.itemTitle, { color: theme.colors.onSurface, fontSize: fontSizes.large }]}>
            {plan.title}
          </Text>
          <Text style={[styles.itemSubtitle, { color: theme.colors.onSurfaceVariant, fontSize: fontSizes.medium }]}>
            {plan.scheduledDate.toLocaleDateString()} • {plan.type}
          </Text>
        </View>
        <View style={[styles.statusIndicator, { backgroundColor: getStatusColor(plan.status) }]}>
          <Text style={[styles.statusText, { color: 'white', fontSize: fontSizes.small }]}>
            {plan.status}
          </Text>
        </View>
      </View>

      <Text style={[styles.itemDescription, { color: theme.colors.onSurfaceVariant, fontSize: fontSizes.medium }]}>
        {plan.description}
      </Text>

      <View style={styles.timezoneContainer}>
        <View style={styles.timezoneItem}>
          <Text style={[styles.timezoneLabel, { color: theme.colors.onSurfaceVariant, fontSize: fontSizes.small }]}>
            Your time:
          </Text>
          <Text style={[styles.timezoneTime, { color: theme.colors.onSurface, fontSize: fontSizes.medium }]}>
            {plan.convertedTime1}
          </Text>
        </View>
        <View style={styles.timezoneItem}>
          <Text style={[styles.timezoneLabel, { color: theme.colors.onSurfaceVariant, fontSize: fontSizes.small }]}>
            Partner's time:
          </Text>
          <Text style={[styles.timezoneTime, { color: theme.colors.onSurface, fontSize: fontSizes.medium }]}>
            {plan.convertedTime2}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderModal = () => {
    if (!selectedItem) return null;

    const isVirtualDate = 'requiredApps' in selectedItem;
    const isWishlistItem = 'priority' in selectedItem;
    const isSynchronizedPlan = 'timezone1' in selectedItem;

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
              {selectedItem.title}
            </Text>
            <IconButton
              icon="close"
              onPress={() => setModalVisible(false)}
              iconColor={theme.colors.onSurface}
            />
          </View>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            <Text style={[styles.itemDescription, { color: theme.colors.onSurface, fontSize: fontSizes.medium }]}>
              {selectedItem.description}
            </Text>

            <Divider style={{ marginVertical: spacing.lg }} />

            {isVirtualDate && (
              <View style={styles.virtualDateDetails}>
                <Text style={[styles.sectionTitle, { color: theme.colors.onSurface, fontSize: fontSizes.large }]}>
                  Instructions
                </Text>
                {(selectedItem as VirtualDate).instructions.map((instruction, index) => (
                  <Text key={index} style={[styles.instruction, { color: theme.colors.onSurface, fontSize: fontSizes.medium }]}>
                    {index + 1}. {instruction}
                  </Text>
                ))}

                <Text style={[styles.sectionTitle, { color: theme.colors.onSurface, fontSize: fontSizes.large, marginTop: spacing.lg }]}>
                  Required Apps
                </Text>
                {(selectedItem as VirtualDate).requiredApps.map((app, index) => (
                  <Text key={index} style={[styles.requiredApp, { color: theme.colors.onSurface, fontSize: fontSizes.medium }]}>
                    • {app}
                  </Text>
                ))}

                <Text style={[styles.timingInfo, { color: theme.colors.onSurfaceVariant, fontSize: fontSizes.medium, marginTop: spacing.lg }]}>
                  Timing: {(selectedItem as VirtualDate).timezoneFlexible ? 'Flexible - can be done at different times' : 'Fixed - must be done simultaneously'}
                </Text>
              </View>
            )}

            {isWishlistItem && (
              <View style={styles.wishlistDetails}>
                <View style={styles.wishlistMeta}>
                  <Text style={[styles.metaLabel, { color: theme.colors.onSurfaceVariant, fontSize: fontSizes.medium }]}>
                    Category: {(selectedItem as SharedWishlist).category}
                  </Text>
                  <Text style={[styles.metaLabel, { color: theme.colors.onSurfaceVariant, fontSize: fontSizes.medium }]}>
                    Priority: {(selectedItem as SharedWishlist).priority}
                  </Text>
                  {(selectedItem as SharedWishlist).estimatedCost && (
                    <Text style={[styles.metaLabel, { color: theme.colors.onSurfaceVariant, fontSize: fontSizes.medium }]}>
                      Estimated Cost: ${(selectedItem as SharedWishlist).estimatedCost}
                    </Text>
                  )}
                </View>

                {(selectedItem as SharedWishlist).notes && (
                  <View style={styles.notesSection}>
                    <Text style={[styles.sectionTitle, { color: theme.colors.onSurface, fontSize: fontSizes.large }]}>
                      Notes
                    </Text>
                    <Text style={[styles.notes, { color: theme.colors.onSurface, fontSize: fontSizes.medium }]}>
                      {(selectedItem as SharedWishlist).notes}
                    </Text>
                  </View>
                )}
              </View>
            )}

            {isSynchronizedPlan && (
              <View style={styles.planDetails}>
                <View style={styles.planMeta}>
                  <Text style={[styles.metaLabel, { color: theme.colors.onSurfaceVariant, fontSize: fontSizes.medium }]}>
                    Date: {(selectedItem as SynchronizedPlan).scheduledDate.toLocaleDateString()}
                  </Text>
                  <Text style={[styles.metaLabel, { color: theme.colors.onSurfaceVariant, fontSize: fontSizes.medium }]}>
                    Type: {(selectedItem as SynchronizedPlan).type}
                  </Text>
                  <Text style={[styles.metaLabel, { color: theme.colors.onSurfaceVariant, fontSize: fontSizes.medium }]}>
                    Status: {(selectedItem as SynchronizedPlan).status}
                  </Text>
                </View>

                <Text style={[styles.sectionTitle, { color: theme.colors.onSurface, fontSize: fontSizes.large, marginTop: spacing.lg }]}>
                  Synchronized Times
                </Text>
                <View style={styles.timezoneDetails}>
                  <Text style={[styles.timezoneDetail, { color: theme.colors.onSurface, fontSize: fontSizes.medium }]}>
                    Your time ({(selectedItem as SynchronizedPlan).timezone1}): {(selectedItem as SynchronizedPlan).convertedTime1}
                  </Text>
                  <Text style={[styles.timezoneDetail, { color: theme.colors.onSurface, fontSize: fontSizes.medium }]}>
                    Partner's time ({(selectedItem as SynchronizedPlan).timezone2}): {(selectedItem as SynchronizedPlan).convertedTime2}
                  </Text>
                </View>
              </View>
            )}
          </ScrollView>

          <View style={styles.modalActions}>
            {isVirtualDate && (
              <Button
                mode="contained"
                onPress={() => handlePlanVirtualDate(selectedItem as VirtualDate)}
                style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}
                labelStyle={{ color: theme.colors.onPrimary, fontSize: fontSizes.medium }}
              >
                Plan This Date
              </Button>
            )}

            {isWishlistItem && !(selectedItem as SharedWishlist).completed && (
              <Button
                mode="contained"
                onPress={() => handleCompleteWishlistItem(selectedItem as SharedWishlist)}
                style={[styles.actionButton, { backgroundColor: theme.colors.secondary }]}
                labelStyle={{ color: theme.colors.onSecondary, fontSize: fontSizes.medium }}
              >
                Mark as Completed
              </Button>
            )}

            {isSynchronizedPlan && (
              <Button
                mode="outlined"
                onPress={() => setModalVisible(false)}
                style={[styles.actionButton, { borderColor: theme.colors.primary }]}
                labelStyle={{ color: theme.colors.primary, fontSize: fontSizes.medium }}
              >
                View Details
              </Button>
            )}
          </View>
        </SafeAreaView>
      </Modal>
    );
  };

  const getCurrentItems = () => {
    switch (activeCategory) {
      case 'virtual-dates': return virtualDates;
      case 'wishlist': return wishlistItems;
      case 'plans': return synchronizedPlans;
      default: return [];
    }
  };

  const renderCurrentItems = () => {
    const items = getCurrentItems();

    return items.map((item) => {
      switch (activeCategory) {
        case 'virtual-dates': return renderVirtualDateCard(item as VirtualDate);
        case 'wishlist': return renderWishlistCard(item as SharedWishlist);
        case 'plans': return renderSynchronizedPlanCard(item as SynchronizedPlan);
        default: return null;
      }
    });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.colors.onSurface, fontSize: fontSizes.headline }]}>
          Long Distance
        </Text>

        <SegmentedButtons
          value={activeCategory}
          onValueChange={(value) => setActiveCategory(value as 'virtual-dates' | 'wishlist' | 'plans')}
          buttons={[
            { value: 'virtual-dates', label: 'Virtual Dates' },
            { value: 'wishlist', label: 'Wishlist' },
            { value: 'plans', label: 'Plans' },
          ]}
          style={styles.segmentedButtons}
        />

        {activeCategory === 'virtual-dates' && (
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[
                styles.tab,
                activeTab === 'recommendations' && { backgroundColor: theme.colors.primaryContainer }
              ]}
              onPress={() => {
                setActiveTab('recommendations');
                setSearchQuery('');
                loadData();
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
        )}
      </View>

      {activeTab === 'search' && activeCategory === 'virtual-dates' && (
        <View style={[styles.searchContainer, { backgroundColor: theme.colors.surface }]}>
          <TextInput
            style={[styles.searchInput, { color: theme.colors.onSurface, fontSize: fontSizes.medium }]}
            placeholder="Search virtual dates..."
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
              Loading {activeCategory}...
            </Text>
          </View>
        ) : getCurrentItems().length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: theme.colors.onSurfaceVariant, fontSize: fontSizes.medium }]}>
              {searchQuery ? `No ${activeCategory} found` : `No ${activeCategory} available`}
            </Text>
          </View>
        ) : (
          <View style={styles.itemsList}>
            {renderCurrentItems()}
          </View>
        )}
      </ScrollView>

      {renderModal()}
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
  segmentedButtons: {
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
  itemsList: {
    padding: 16,
  },
  itemCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  itemInfo: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typeIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  itemTitle: {
    fontWeight: 'bold',
    flex: 1,
  },
  completedTag: {
    fontWeight: 'normal',
  },
  itemSubtitle: {
    marginTop: 4,
  },
  itemDescription: {
    marginBottom: 12,
    lineHeight: 20,
  },
  itemNotes: {
    fontStyle: 'italic',
    marginTop: 4,
  },
  matchScore: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  matchText: {
    fontWeight: '500',
  },
  priorityIndicator: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityText: {
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  statusIndicator: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  appsContainer: {
    marginTop: 8,
  },
  appsLabel: {
    marginBottom: 4,
  },
  appsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  appChip: {
    marginBottom: 4,
  },
  timezoneContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  timezoneItem: {
    flex: 1,
  },
  timezoneLabel: {
    marginBottom: 2,
  },
  timezoneTime: {
    fontWeight: '500',
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
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 12,
  },
  virtualDateDetails: {},
  instruction: {
    marginBottom: 8,
    lineHeight: 20,
  },
  requiredApp: {
    marginBottom: 4,
  },
  timingInfo: {
    fontStyle: 'italic',
  },
  wishlistDetails: {},
  wishlistMeta: {
    marginBottom: 16,
  },
  metaLabel: {
    marginBottom: 4,
  },
  notesSection: {
    marginTop: 16,
  },
  notes: {
    lineHeight: 20,
  },
  planDetails: {},
  planMeta: {
    marginBottom: 16,
  },
  timezoneDetails: {
    marginTop: 8,
  },
  timezoneDetail: {
    marginBottom: 4,
  },
  modalActions: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  actionButton: {
    borderRadius: 8,
  },
});

export default VirtualDatesScreen; 