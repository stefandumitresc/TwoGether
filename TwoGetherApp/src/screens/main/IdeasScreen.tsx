import React, { useState, useMemo } from 'react';
import { View, StyleSheet, ScrollView, FlatList, Dimensions } from 'react-native';
import { Text, Button, Card, Chip, Searchbar, IconButton, Portal, Modal } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { colors } from '../../theme';
import { useResponsiveDesign } from '../../hooks/useResponsiveDesign';

const { width: screenWidth } = Dimensions.get('window');

// Types
interface DateIdea {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  cost: 'Free' | 'Low' | 'Medium' | 'High';
  duration: string;
  tags: string[];
  location: 'Indoor' | 'Outdoor' | 'Either';
  timeOfDay: 'Morning' | 'Afternoon' | 'Evening' | 'Night' | 'Any';
  season?: 'Spring' | 'Summer' | 'Fall' | 'Winter' | 'Any';
}

// Mock data - this will be enhanced with AI recommendations later
const mockDateIdeas: DateIdea[] = [
  {
    id: '1',
    title: 'Sunset Picnic',
    description: 'Pack a basket with your favorite foods and watch the sunset together in a beautiful location.',
    category: 'Outdoor',
    difficulty: 'Easy',
    cost: 'Low',
    duration: '2-3 hours',
    tags: ['romantic', 'nature', 'food'],
    location: 'Outdoor',
    timeOfDay: 'Evening',
    season: 'Any',
  },
  {
    id: '2',
    title: 'Cooking Class',
    description: 'Learn to make a new cuisine together. Many local culinary schools offer couples classes.',
    category: 'Learning',
    difficulty: 'Medium',
    cost: 'Medium',
    duration: '3-4 hours',
    tags: ['learning', 'food', 'interactive'],
    location: 'Indoor',
    timeOfDay: 'Afternoon',
  },
  {
    id: '3',
    title: 'Art Gallery Tour',
    description: 'Explore local art galleries and discuss your favorite pieces over coffee afterward.',
    category: 'Culture',
    difficulty: 'Easy',
    cost: 'Low',
    duration: '2-3 hours',
    tags: ['culture', 'art', 'conversation'],
    location: 'Indoor',
    timeOfDay: 'Afternoon',
  },
  {
    id: '4',
    title: 'Hiking Adventure',
    description: 'Find a scenic trail and enjoy nature together. Bring water and snacks for the journey.',
    category: 'Adventure',
    difficulty: 'Medium',
    cost: 'Free',
    duration: '3-5 hours',
    tags: ['adventure', 'nature', 'exercise'],
    location: 'Outdoor',
    timeOfDay: 'Morning',
    season: 'Spring',
  },
  {
    id: '5',
    title: 'Movie Marathon Night',
    description: 'Pick a theme or series and create a cozy movie night with homemade popcorn and blankets.',
    category: 'Entertainment',
    difficulty: 'Easy',
    cost: 'Low',
    duration: '4-6 hours',
    tags: ['relaxing', 'entertainment', 'cozy'],
    location: 'Indoor',
    timeOfDay: 'Night',
  },
  {
    id: '6',
    title: 'Wine Tasting',
    description: 'Visit a local winery or create your own wine tasting experience at home.',
    category: 'Food & Drink',
    difficulty: 'Easy',
    cost: 'Medium',
    duration: '2-3 hours',
    tags: ['sophisticated', 'relaxing', 'taste'],
    location: 'Either',
    timeOfDay: 'Evening',
  },
  {
    id: '7',
    title: 'Stargazing',
    description: 'Find a dark spot away from city lights and explore the night sky together.',
    category: 'Outdoor',
    difficulty: 'Easy',
    cost: 'Free',
    duration: '2-4 hours',
    tags: ['romantic', 'peaceful', 'nature'],
    location: 'Outdoor',
    timeOfDay: 'Night',
    season: 'Any',
  },
  {
    id: '8',
    title: 'Escape Room',
    description: 'Work together to solve puzzles and escape within the time limit.',
    category: 'Adventure',
    difficulty: 'Medium',
    cost: 'Medium',
    duration: '1-2 hours',
    tags: ['teamwork', 'challenge', 'fun'],
    location: 'Indoor',
    timeOfDay: 'Any',
  },
];

const categories = ['All', 'Outdoor', 'Learning', 'Culture', 'Adventure', 'Entertainment', 'Food & Drink'];

const IdeasScreen = () => {
  const { user, partner } = useAuth();
  const { horizontalPadding, spacing, fontSizes, isSmallScreen } = useResponsiveDesign();
  const navigation = useNavigation();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedIdea, setSelectedIdea] = useState<DateIdea | null>(null);
  const [showIdeaModal, setShowIdeaModal] = useState(false);

  // Filter ideas based on search and category
  const filteredIdeas = useMemo(() => {
    return mockDateIdeas.filter((idea) => {
      const matchesSearch = idea.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        idea.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        idea.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory = selectedCategory === 'All' || idea.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const toggleFavorite = (ideaId: string) => {
    setFavorites(prev =>
      prev.includes(ideaId)
        ? prev.filter(id => id !== ideaId)
        : [...prev, ideaId]
    );
  };

  const openIdeaDetail = (idea: DateIdea) => {
    setSelectedIdea(idea);
    setShowIdeaModal(true);
  };

  const planThisIdea = (idea: DateIdea) => {
    // Navigate to calendar with pre-filled idea
    (navigation as any).navigate('Calendar', {
      newEvent: {
        id: Date.now().toString(),
        title: idea.title,
        date: new Date().toISOString().split('T')[0], // Today as default
        type: 'suggested',
        plannedBy: 'you',
        description: idea.description,
      }
    });
    setShowIdeaModal(false);
  };

  const getCostColor = (cost: string) => {
    switch (cost) {
      case 'Free': return colors.secondary;
      case 'Low': return colors.primary;
      case 'Medium': return '#FF9800';
      case 'High': return '#F44336';
      default: return colors.textSecondary;
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'star-outline';
      case 'Medium': return 'star-half-full';
      case 'Hard': return 'star';
      default: return 'star-outline';
    }
  };

  const renderIdeaCard = ({ item }: { item: DateIdea }) => (
    <Card style={[styles.ideaCard, { width: (screenWidth - horizontalPadding * 2 - spacing.md) / 2 }]}>
      <Card.Content style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text variant="titleSmall" style={[styles.ideaTitle, { fontSize: fontSizes.medium }]} numberOfLines={2}>
            {item.title}
          </Text>
          <IconButton
            icon={favorites.includes(item.id) ? 'heart' : 'heart-outline'}
            size={20}
            iconColor={favorites.includes(item.id) ? colors.heart : colors.textSecondary}
            onPress={() => toggleFavorite(item.id)}
            style={styles.favoriteButton}
          />
        </View>

        <Text variant="bodySmall" style={[styles.ideaDescription, { fontSize: fontSizes.small }]} numberOfLines={3}>
          {item.description}
        </Text>

        <View style={styles.ideaMetadata}>
          <View style={styles.metadataRow}>
            <MaterialCommunityIcons
              name={getDifficultyIcon(item.difficulty)}
              size={16}
              color={colors.primary}
            />
            <Text style={[styles.metadataText, { fontSize: fontSizes.small }]}>{item.difficulty}</Text>
          </View>

          <View style={styles.metadataRow}>
            <MaterialCommunityIcons name="currency-usd" size={16} color={getCostColor(item.cost)} />
            <Text style={[styles.metadataText, { fontSize: fontSizes.small, color: getCostColor(item.cost) }]}>
              {item.cost}
            </Text>
          </View>

          <View style={styles.metadataRow}>
            <MaterialCommunityIcons name="clock-outline" size={16} color={colors.textSecondary} />
            <Text style={[styles.metadataText, { fontSize: fontSizes.small }]}>{item.duration}</Text>
          </View>
        </View>

        <View style={styles.cardActions}>
          <Button
            mode="outlined"
            onPress={() => openIdeaDetail(item)}
            style={styles.actionButton}
            compact
          >
            Details
          </Button>
          <Button
            mode="contained"
            onPress={() => planThisIdea(item)}
            style={styles.actionButton}
            compact
          >
            Plan This
          </Button>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <View style={[styles.content, { paddingHorizontal: horizontalPadding }]}>
        {/* Search Bar */}
        <Searchbar
          placeholder="Search date ideas..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={[styles.searchBar, { marginBottom: spacing.md }]}
          iconColor={colors.primary}
        />

        {/* Category Filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesContainer}
          contentContainerStyle={styles.categoriesContent}
        >
          {categories.map((category) => (
            <Chip
              key={category}
              mode={selectedCategory === category ? 'flat' : 'outlined'}
              selected={selectedCategory === category}
              onPress={() => setSelectedCategory(category)}
              style={[
                styles.categoryChip,
                selectedCategory === category && styles.selectedCategoryChip
              ]}
              textStyle={{ fontSize: fontSizes.small }}
            >
              {category}
            </Chip>
          ))}
        </ScrollView>

        {/* Ideas Grid */}
        <FlatList
          data={filteredIdeas}
          renderItem={renderIdeaCard}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.ideasGrid}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <MaterialCommunityIcons name="lightbulb-outline" size={64} color={colors.textSecondary} />
              <Text variant="titleMedium" style={[styles.emptyTitle, { fontSize: fontSizes.medium }]}>
                No ideas found
              </Text>
              <Text variant="bodyMedium" style={[styles.emptySubtitle, { fontSize: fontSizes.small }]}>
                Try adjusting your search or category filter
              </Text>
            </View>
          }
        />
      </View>

      {/* Idea Detail Modal */}
      <Portal>
        <Modal
          visible={showIdeaModal}
          onDismiss={() => setShowIdeaModal(false)}
          contentContainerStyle={[styles.modalContainer, { margin: horizontalPadding }]}
        >
          {selectedIdea && (
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.modalHeader}>
                <Text variant="titleLarge" style={[styles.modalTitle, { fontSize: fontSizes.large }]}>
                  {selectedIdea.title}
                </Text>
                <IconButton
                  icon={favorites.includes(selectedIdea.id) ? 'heart' : 'heart-outline'}
                  size={24}
                  iconColor={favorites.includes(selectedIdea.id) ? colors.heart : colors.textSecondary}
                  onPress={() => toggleFavorite(selectedIdea.id)}
                />
              </View>

              <Text variant="bodyMedium" style={[styles.modalDescription, { fontSize: fontSizes.medium }]}>
                {selectedIdea.description}
              </Text>

              <View style={styles.modalMetadata}>
                <View style={styles.modalMetadataRow}>
                  <Text style={[styles.modalMetadataLabel, { fontSize: fontSizes.small }]}>Category:</Text>
                  <Text style={[styles.modalMetadataValue, { fontSize: fontSizes.small }]}>{selectedIdea.category}</Text>
                </View>

                <View style={styles.modalMetadataRow}>
                  <Text style={[styles.modalMetadataLabel, { fontSize: fontSizes.small }]}>Difficulty:</Text>
                  <Text style={[styles.modalMetadataValue, { fontSize: fontSizes.small }]}>{selectedIdea.difficulty}</Text>
                </View>

                <View style={styles.modalMetadataRow}>
                  <Text style={[styles.modalMetadataLabel, { fontSize: fontSizes.small }]}>Cost:</Text>
                  <Text style={[styles.modalMetadataValue, { fontSize: fontSizes.small, color: getCostColor(selectedIdea.cost) }]}>
                    {selectedIdea.cost}
                  </Text>
                </View>

                <View style={styles.modalMetadataRow}>
                  <Text style={[styles.modalMetadataLabel, { fontSize: fontSizes.small }]}>Duration:</Text>
                  <Text style={[styles.modalMetadataValue, { fontSize: fontSizes.small }]}>{selectedIdea.duration}</Text>
                </View>

                <View style={styles.modalMetadataRow}>
                  <Text style={[styles.modalMetadataLabel, { fontSize: fontSizes.small }]}>Location:</Text>
                  <Text style={[styles.modalMetadataValue, { fontSize: fontSizes.small }]}>{selectedIdea.location}</Text>
                </View>

                <View style={styles.modalMetadataRow}>
                  <Text style={[styles.modalMetadataLabel, { fontSize: fontSizes.small }]}>Best time:</Text>
                  <Text style={[styles.modalMetadataValue, { fontSize: fontSizes.small }]}>{selectedIdea.timeOfDay}</Text>
                </View>
              </View>

              {selectedIdea.tags.length > 0 && (
                <View style={styles.tagsContainer}>
                  <Text style={[styles.tagsLabel, { fontSize: fontSizes.small }]}>Tags:</Text>
                  <View style={styles.tagsRow}>
                    {selectedIdea.tags.map((tag, index) => (
                      <Chip
                        key={index}
                        mode="outlined"
                        compact
                        style={styles.tagChip}
                        textStyle={{ fontSize: fontSizes.small }}
                      >
                        {tag}
                      </Chip>
                    ))}
                  </View>
                </View>
              )}

              <View style={styles.modalActions}>
                <Button
                  mode="outlined"
                  onPress={() => setShowIdeaModal(false)}
                  style={styles.modalButton}
                >
                  Close
                </Button>
                <Button
                  mode="contained"
                  onPress={() => planThisIdea(selectedIdea)}
                  style={styles.modalButton}
                >
                  Plan This Date
                </Button>
              </View>
            </ScrollView>
          )}
        </Modal>
      </Portal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    paddingTop: 16,
  },
  searchBar: {
    backgroundColor: colors.surface,
    elevation: 2,
  },
  categoriesContainer: {
    maxHeight: 50,
  },
  categoriesContent: {
    paddingRight: 16,
  },
  categoryChip: {
    marginRight: 8,
    backgroundColor: colors.surface,
  },
  selectedCategoryChip: {
    backgroundColor: colors.primary + '20',
  },
  ideasGrid: {
    paddingTop: 16,
    paddingBottom: 20,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  ideaCard: {
    backgroundColor: colors.surface,
    elevation: 2,
    marginBottom: 8,
  },
  cardContent: {
    padding: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  ideaTitle: {
    color: colors.text,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 8,
  },
  favoriteButton: {
    margin: 0,
    padding: 0,
  },
  ideaDescription: {
    color: colors.textSecondary,
    marginBottom: 12,
    lineHeight: 18,
  },
  ideaMetadata: {
    marginBottom: 12,
  },
  metadataRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  metadataText: {
    color: colors.textSecondary,
    marginLeft: 4,
  },
  cardActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyTitle: {
    color: colors.text,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    color: colors.textSecondary,
    textAlign: 'center',
  },
  modalContainer: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 24,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  modalTitle: {
    color: colors.text,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 8,
  },
  modalDescription: {
    color: colors.text,
    marginBottom: 20,
    lineHeight: 22,
  },
  modalMetadata: {
    marginBottom: 20,
  },
  modalMetadataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  modalMetadataLabel: {
    color: colors.textSecondary,
    fontWeight: '500',
  },
  modalMetadataValue: {
    color: colors.text,
  },
  tagsContainer: {
    marginBottom: 20,
  },
  tagsLabel: {
    color: colors.textSecondary,
    fontWeight: '500',
    marginBottom: 8,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagChip: {
    backgroundColor: colors.surfaceVariant,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
  },
});

export default IdeasScreen; 