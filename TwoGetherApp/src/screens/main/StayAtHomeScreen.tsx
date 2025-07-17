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
import { Recipe, Game, HomeActivity } from '../../types';
import {
  getRecipeRecommendations,
  getGameRecommendations,
  getDIYRecommendations,
  searchRecipes,
  searchGames,
  searchDIYActivities,
  getRecipeById,
  getGameById,
  getDIYActivityById
} from '../../services/homeActivitiesService';

const StayAtHomeScreen = () => {
  const { spacing, fontSizes } = useResponsiveDesign();

  const [activeCategory, setActiveCategory] = useState<'cooking' | 'games' | 'diy'>('cooking');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [diyActivities, setDiyActivities] = useState<HomeActivity[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<Recipe | Game | HomeActivity | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'recommendations' | 'search'>('recommendations');

  // Mock preferences
  const mockUserPreferences = {
    cookingSkillLevel: 'intermediate',
    gameTypes: ['board', 'card', 'video'],
    diySkillLevel: 'beginner'
  };

  const mockPartnerPreferences = {
    cookingSkillLevel: 'beginner',
    gameTypes: ['board', 'trivia'],
    diySkillLevel: 'intermediate'
  };

  const loadRecommendations = async () => {
    setLoading(true);
    try {
      const recipeRecs = getRecipeRecommendations(mockUserPreferences, mockPartnerPreferences);
      const gameRecs = getGameRecommendations(mockUserPreferences, mockPartnerPreferences);
      const diyRecs = getDIYRecommendations(mockUserPreferences, mockPartnerPreferences);

      setRecipes(recipeRecs);
      setGames(gameRecs);
      setDiyActivities(diyRecs);
    } catch (error) {
      Alert.alert('Error', 'Failed to load recommendations');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.length > 0) {
      const recipeResults = searchRecipes(query);
      const gameResults = searchGames(query);
      const diyResults = searchDIYActivities(query);

      setRecipes(recipeResults);
      setGames(gameResults);
      setDiyActivities(diyResults);
    } else {
      loadRecommendations();
    }
  };

  const handleItemPress = (item: Recipe | Game | HomeActivity) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const handlePlanActivity = (item: Recipe | Game | HomeActivity) => {
    Alert.alert(
      'Plan Activity',
      `Plan to do "${item.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Plan Activity',
          onPress: () => {
            Alert.alert('Success', 'Activity planned!');
            setModalVisible(false);
          }
        }
      ]
    );
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadRecommendations();
    setRefreshing(false);
  };

  useEffect(() => {
    loadRecommendations();
  }, []);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': case 'beginner': return theme.colors.secondary;
      case 'medium': case 'intermediate': return theme.colors.primary;
      case 'hard': case 'advanced': return theme.colors.error;
      default: return theme.colors.onSurfaceVariant;
    }
  };

  const renderRecipeCard = (recipe: Recipe) => (
    <TouchableOpacity
      key={recipe.id}
      onPress={() => handleItemPress(recipe)}
      style={[styles.itemCard, { backgroundColor: theme.colors.surface }]}
    >
      <View style={styles.itemHeader}>
        <View style={styles.itemInfo}>
          <Text style={[styles.itemTitle, { color: theme.colors.onSurface, fontSize: fontSizes.large }]}>
            {recipe.name}
          </Text>
          <Text style={[styles.itemSubtitle, { color: theme.colors.onSurfaceVariant, fontSize: fontSizes.medium }]}>
            {recipe.cuisine} • {recipe.cookTime} min • {recipe.servings} servings
          </Text>
          <View style={styles.itemMeta}>
            <Chip
              mode="outlined"
              textStyle={{ color: getDifficultyColor(recipe.difficulty), fontSize: fontSizes.small }}
              style={{ borderColor: getDifficultyColor(recipe.difficulty) }}
            >
              {recipe.difficulty}
            </Chip>
          </View>
        </View>
        {recipe.matchScore && (
          <View style={[styles.matchScore, { backgroundColor: theme.colors.primaryContainer }]}>
            <Text style={[styles.matchText, { color: theme.colors.onPrimaryContainer, fontSize: fontSizes.small }]}>
              {recipe.matchScore}% match
            </Text>
          </View>
        )}
      </View>

      <Text style={[styles.itemDescription, { color: theme.colors.onSurfaceVariant, fontSize: fontSizes.medium }]}>
        {recipe.description}
      </Text>

      <View style={styles.tagContainer}>
        {recipe.dietaryTags.map((tag, index) => (
          <Chip
            key={index}
            mode="outlined"
            style={[styles.tag, { marginRight: spacing.sm }]}
            textStyle={{ fontSize: fontSizes.small }}
          >
            {tag}
          </Chip>
        ))}
      </View>
    </TouchableOpacity>
  );

  const renderGameCard = (game: Game) => (
    <TouchableOpacity
      key={game.id}
      onPress={() => handleItemPress(game)}
      style={[styles.itemCard, { backgroundColor: theme.colors.surface }]}
    >
      <View style={styles.itemHeader}>
        <View style={styles.itemInfo}>
          <Text style={[styles.itemTitle, { color: theme.colors.onSurface, fontSize: fontSizes.large }]}>
            {game.name}
          </Text>
          <Text style={[styles.itemSubtitle, { color: theme.colors.onSurfaceVariant, fontSize: fontSizes.medium }]}>
            {game.type} • {game.players} players • {game.duration} min
          </Text>
          <View style={styles.itemMeta}>
            <Chip
              mode="outlined"
              textStyle={{ color: getDifficultyColor(game.difficulty), fontSize: fontSizes.small }}
              style={{ borderColor: getDifficultyColor(game.difficulty) }}
            >
              {game.difficulty}
            </Chip>
          </View>
        </View>
        {game.matchScore && (
          <View style={[styles.matchScore, { backgroundColor: theme.colors.primaryContainer }]}>
            <Text style={[styles.matchText, { color: theme.colors.onPrimaryContainer, fontSize: fontSizes.small }]}>
              {game.matchScore}% match
            </Text>
          </View>
        )}
      </View>

      <Text style={[styles.itemDescription, { color: theme.colors.onSurfaceVariant, fontSize: fontSizes.medium }]}>
        {game.description}
      </Text>

      {game.platform && (
        <Text style={[styles.platform, { color: theme.colors.primary, fontSize: fontSizes.small }]}>
          Platform: {game.platform}
        </Text>
      )}
    </TouchableOpacity>
  );

  const renderDIYCard = (activity: HomeActivity) => (
    <TouchableOpacity
      key={activity.id}
      onPress={() => handleItemPress(activity)}
      style={[styles.itemCard, { backgroundColor: theme.colors.surface }]}
    >
      <View style={styles.itemHeader}>
        <View style={styles.itemInfo}>
          <Text style={[styles.itemTitle, { color: theme.colors.onSurface, fontSize: fontSizes.large }]}>
            {activity.name}
          </Text>
          <Text style={[styles.itemSubtitle, { color: theme.colors.onSurfaceVariant, fontSize: fontSizes.medium }]}>
            {activity.duration} min • ${activity.estimatedCost}
          </Text>
          <View style={styles.itemMeta}>
            <Chip
              mode="outlined"
              textStyle={{ color: getDifficultyColor(activity.skillLevel), fontSize: fontSizes.small }}
              style={{ borderColor: getDifficultyColor(activity.skillLevel) }}
            >
              {activity.skillLevel}
            </Chip>
          </View>
        </View>
        {activity.matchScore && (
          <View style={[styles.matchScore, { backgroundColor: theme.colors.primaryContainer }]}>
            <Text style={[styles.matchText, { color: theme.colors.onPrimaryContainer, fontSize: fontSizes.small }]}>
              {activity.matchScore}% match
            </Text>
          </View>
        )}
      </View>

      <Text style={[styles.itemDescription, { color: theme.colors.onSurfaceVariant, fontSize: fontSizes.medium }]}>
        {activity.description}
      </Text>
    </TouchableOpacity>
  );

  const renderItemModal = () => {
    if (!selectedItem) return null;

    const isRecipe = 'ingredients' in selectedItem;
    const isGame = 'players' in selectedItem;
    const isDIY = 'materials' in selectedItem;

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
              {selectedItem.name}
            </Text>
            <IconButton
              icon="close"
              onPress={() => setModalVisible(false)}
              iconColor={theme.colors.onSurface}
            />
          </View>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            <View style={styles.itemDetails}>
              <Text style={[styles.itemDescription, { color: theme.colors.onSurface, fontSize: fontSizes.medium }]}>
                {selectedItem.description}
              </Text>

              <View style={styles.itemMeta}>
                <Chip
                  mode="outlined"
                  textStyle={{
                    color: getDifficultyColor(
                      isRecipe ? (selectedItem as Recipe).difficulty :
                        isGame ? (selectedItem as Game).difficulty :
                          (selectedItem as HomeActivity).skillLevel
                    ),
                    fontSize: fontSizes.small
                  }}
                  style={{
                    borderColor: getDifficultyColor(
                      isRecipe ? (selectedItem as Recipe).difficulty :
                        isGame ? (selectedItem as Game).difficulty :
                          (selectedItem as HomeActivity).skillLevel
                    )
                  }}
                >
                  {isRecipe ? (selectedItem as Recipe).difficulty :
                    isGame ? (selectedItem as Game).difficulty :
                      (selectedItem as HomeActivity).skillLevel}
                </Chip>
              </View>
            </View>

            <Divider style={{ marginVertical: spacing.lg }} />

            {isRecipe && (
              <View style={styles.recipeDetails}>
                <Text style={[styles.sectionTitle, { color: theme.colors.onSurface, fontSize: fontSizes.large }]}>
                  Ingredients
                </Text>
                {(selectedItem as Recipe).ingredients.map((ingredient, index) => (
                  <Text key={index} style={[styles.ingredient, { color: theme.colors.onSurface, fontSize: fontSizes.medium }]}>
                    • {ingredient.amount} {ingredient.unit} {ingredient.name}
                  </Text>
                ))}

                <Text style={[styles.sectionTitle, { color: theme.colors.onSurface, fontSize: fontSizes.large, marginTop: spacing.lg }]}>
                  Instructions
                </Text>
                {(selectedItem as Recipe).instructions.map((instruction, index) => (
                  <Text key={index} style={[styles.instruction, { color: theme.colors.onSurface, fontSize: fontSizes.medium }]}>
                    {index + 1}. {instruction}
                  </Text>
                ))}

                {(selectedItem as Recipe).nutritionInfo && (
                  <View style={styles.nutritionInfo}>
                    <Text style={[styles.sectionTitle, { color: theme.colors.onSurface, fontSize: fontSizes.large, marginTop: spacing.lg }]}>
                      Nutrition (per serving)
                    </Text>
                    <Text style={[styles.nutrition, { color: theme.colors.onSurface, fontSize: fontSizes.medium }]}>
                      Calories: {(selectedItem as Recipe).nutritionInfo!.calories}
                    </Text>
                    <Text style={[styles.nutrition, { color: theme.colors.onSurface, fontSize: fontSizes.medium }]}>
                      Protein: {(selectedItem as Recipe).nutritionInfo!.protein}g
                    </Text>
                    <Text style={[styles.nutrition, { color: theme.colors.onSurface, fontSize: fontSizes.medium }]}>
                      Carbs: {(selectedItem as Recipe).nutritionInfo!.carbs}g
                    </Text>
                    <Text style={[styles.nutrition, { color: theme.colors.onSurface, fontSize: fontSizes.medium }]}>
                      Fat: {(selectedItem as Recipe).nutritionInfo!.fat}g
                    </Text>
                  </View>
                )}
              </View>
            )}

            {isGame && (
              <View style={styles.gameDetails}>
                <Text style={[styles.sectionTitle, { color: theme.colors.onSurface, fontSize: fontSizes.large }]}>
                  Game Details
                </Text>
                <Text style={[styles.gameInfo, { color: theme.colors.onSurface, fontSize: fontSizes.medium }]}>
                  Players: {(selectedItem as Game).players}
                </Text>
                <Text style={[styles.gameInfo, { color: theme.colors.onSurface, fontSize: fontSizes.medium }]}>
                  Duration: {(selectedItem as Game).duration} minutes
                </Text>
                <Text style={[styles.gameInfo, { color: theme.colors.onSurface, fontSize: fontSizes.medium }]}>
                  Type: {(selectedItem as Game).type}
                </Text>

                {(selectedItem as Game).platform && (
                  <Text style={[styles.gameInfo, { color: theme.colors.onSurface, fontSize: fontSizes.medium }]}>
                    Platform: {(selectedItem as Game).platform}
                  </Text>
                )}

                <Text style={[styles.sectionTitle, { color: theme.colors.onSurface, fontSize: fontSizes.large, marginTop: spacing.lg }]}>
                  Equipment Needed
                </Text>
                {(selectedItem as Game).equipment.map((item, index) => (
                  <Text key={index} style={[styles.equipment, { color: theme.colors.onSurface, fontSize: fontSizes.medium }]}>
                    • {item}
                  </Text>
                ))}
              </View>
            )}

            {isDIY && (
              <View style={styles.diyDetails}>
                <Text style={[styles.sectionTitle, { color: theme.colors.onSurface, fontSize: fontSizes.large }]}>
                  Materials Needed
                </Text>
                {(selectedItem as HomeActivity).materials.map((material, index) => (
                  <Text key={index} style={[styles.material, { color: theme.colors.onSurface, fontSize: fontSizes.medium }]}>
                    • {material}
                  </Text>
                ))}

                {(selectedItem as HomeActivity).instructions && (
                  <>
                    <Text style={[styles.sectionTitle, { color: theme.colors.onSurface, fontSize: fontSizes.large, marginTop: spacing.lg }]}>
                      Instructions
                    </Text>
                    {(selectedItem as HomeActivity).instructions!.map((instruction, index) => (
                      <Text key={index} style={[styles.instruction, { color: theme.colors.onSurface, fontSize: fontSizes.medium }]}>
                        {index + 1}. {instruction}
                      </Text>
                    ))}
                  </>
                )}

                <Text style={[styles.estimatedCost, { color: theme.colors.primary, fontSize: fontSizes.medium, marginTop: spacing.lg }]}>
                  Estimated Cost: ${(selectedItem as HomeActivity).estimatedCost}
                </Text>
              </View>
            )}
          </ScrollView>

          <View style={styles.modalActions}>
            <Button
              mode="contained"
              onPress={() => handlePlanActivity(selectedItem)}
              style={[styles.planButton, { backgroundColor: theme.colors.primary }]}
              labelStyle={{ color: theme.colors.onPrimary, fontSize: fontSizes.medium }}
            >
              Plan This Activity
            </Button>
          </View>
        </SafeAreaView>
      </Modal>
    );
  };

  const getCurrentItems = () => {
    switch (activeCategory) {
      case 'cooking': return recipes;
      case 'games': return games;
      case 'diy': return diyActivities;
      default: return [];
    }
  };

  const renderCurrentItems = () => {
    const items = getCurrentItems();

    return items.map((item) => {
      switch (activeCategory) {
        case 'cooking': return renderRecipeCard(item as Recipe);
        case 'games': return renderGameCard(item as Game);
        case 'diy': return renderDIYCard(item as HomeActivity);
        default: return null;
      }
    });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.colors.onSurface, fontSize: fontSizes.headline }]}>
          Stay at Home
        </Text>

        <SegmentedButtons
          value={activeCategory}
          onValueChange={(value) => setActiveCategory(value as 'cooking' | 'games' | 'diy')}
          buttons={[
            { value: 'cooking', label: 'Cooking' },
            { value: 'games', label: 'Games' },
            { value: 'diy', label: 'DIY' },
          ]}
          style={styles.segmentedButtons}
        />

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
            placeholder={`Search ${activeCategory}...`}
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
              {searchQuery ? `No ${activeCategory} found` : `No ${activeCategory} recommendations available`}
            </Text>
          </View>
        ) : (
          <View style={styles.itemsList}>
            {renderCurrentItems()}
          </View>
        )}
      </ScrollView>

      {renderItemModal()}
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
  itemTitle: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  itemSubtitle: {
    marginBottom: 8,
  },
  itemMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  itemDescription: {
    marginBottom: 12,
    lineHeight: 20,
  },
  platform: {
    fontStyle: 'italic',
  },
  matchScore: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  matchText: {
    fontWeight: '500',
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
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
  itemDetails: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 12,
  },
  recipeDetails: {},
  ingredient: {
    marginBottom: 4,
  },
  instruction: {
    marginBottom: 8,
    lineHeight: 20,
  },
  nutritionInfo: {},
  nutrition: {
    marginBottom: 2,
  },
  gameDetails: {},
  gameInfo: {
    marginBottom: 4,
  },
  equipment: {
    marginBottom: 4,
  },
  diyDetails: {},
  material: {
    marginBottom: 4,
  },
  estimatedCost: {
    fontWeight: '500',
  },
  modalActions: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  planButton: {
    borderRadius: 8,
  },
});

export default StayAtHomeScreen; 