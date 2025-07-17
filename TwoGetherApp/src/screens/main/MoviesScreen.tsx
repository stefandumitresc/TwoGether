import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  Modal,
  Alert,
  RefreshControl,
} from 'react-native';
import { Card, Chip, Button, IconButton, Divider } from 'react-native-paper';
import { theme } from '../../theme';
import { useResponsiveDesign } from '../../hooks/useResponsiveDesign';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Movie, Snack, StreamingService, MoviePreferences } from '../../types';
import {
  getMovieRecommendations,
  searchMovies,
  getMovieById,
  getSnackRecommendations,
  streamingServices
} from '../../services/movieService';

const MoviesScreen = () => {
  const { spacing, fontSizes } = useResponsiveDesign();

  const [movies, setMovies] = useState<Movie[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'recommendations' | 'search'>('recommendations');

  // Mock user preferences - in real app, this would come from user context
  const mockUserPreferences: MoviePreferences = {
    favoriteGenres: ['Comedy', 'Romance', 'Action'],
    dislikedGenres: ['Horror'],
    preferredRating: 'PG-13',
    preferredDuration: 'medium',
    streamingServices: streamingServices.filter(s => s.isSubscribed),
    snackPreferences: {
      sweet: true,
      salty: true,
      spicy: false,
      healthy: true,
      allergies: []
    }
  };

  const mockPartnerPreferences: MoviePreferences = {
    favoriteGenres: ['Drama', 'Comedy', 'Sci-Fi'],
    dislikedGenres: ['Horror'],
    preferredRating: 'R',
    preferredDuration: 'long',
    streamingServices: streamingServices.filter(s => s.isSubscribed),
    snackPreferences: {
      sweet: false,
      salty: true,
      spicy: true,
      healthy: false,
      allergies: ['nuts']
    }
  };

  const loadRecommendations = async () => {
    setLoading(true);
    try {
      const recommendations = getMovieRecommendations(
        mockUserPreferences,
        mockPartnerPreferences
      );
      setMovies(recommendations);
    } catch (error) {
      Alert.alert('Error', 'Failed to load movie recommendations');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.length > 0) {
      const results = searchMovies(query);
      setMovies(results);
    } else {
      loadRecommendations();
    }
  };

  const handleMoviePress = (movie: Movie) => {
    setSelectedMovie(movie);
    setModalVisible(true);
  };

  const handlePlanDate = (movie: Movie) => {
    Alert.alert(
      'Plan Movie Date',
      `Plan a date to watch "${movie.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Plan Date',
          onPress: () => {
            // In real app, this would navigate to calendar or date planning
            Alert.alert('Success', 'Movie date planned!');
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

  const renderMovieCard = (movie: Movie) => (
    <TouchableOpacity
      key={movie.id}
      onPress={() => handleMoviePress(movie)}
      style={[styles.movieCard, { backgroundColor: theme.colors.surface }]}
    >
      <View style={styles.movieHeader}>
        <View style={styles.movieInfo}>
          <Text style={[styles.movieTitle, { color: theme.colors.onSurface, fontSize: fontSizes.large }]}>
            {movie.title}
          </Text>
          <Text style={[styles.movieYear, { color: theme.colors.onSurfaceVariant, fontSize: fontSizes.small }]}>
            {movie.releaseYear} • {movie.duration} min • {movie.rating}
          </Text>
          {movie.imdbRating && (
            <Text style={[styles.rating, { color: theme.colors.primary, fontSize: fontSizes.small }]}>
              ⭐ {movie.imdbRating}/10
            </Text>
          )}
        </View>
        {movie.matchScore && (
          <View style={[styles.matchScore, { backgroundColor: theme.colors.primaryContainer }]}>
            <Text style={[styles.matchText, { color: theme.colors.onPrimaryContainer, fontSize: fontSizes.small }]}>
              {movie.matchScore}% match
            </Text>
          </View>
        )}
      </View>

      <Text style={[styles.movieDescription, { color: theme.colors.onSurfaceVariant, fontSize: fontSizes.medium }]}>
        {movie.description}
      </Text>

      <View style={styles.genreContainer}>
        {movie.genres.map((genre, index) => (
          <Chip
            key={index}
            mode="outlined"
            style={[styles.genreChip, { marginRight: spacing.sm }]}
            textStyle={{ fontSize: fontSizes.small }}
          >
            {genre}
          </Chip>
        ))}
      </View>

      <View style={styles.streamingContainer}>
        {movie.streamingAvailability.slice(0, 3).map((availability, index) => (
          <View key={index} style={styles.streamingItem}>
            <Text style={[styles.streamingService, { color: theme.colors.primary, fontSize: fontSizes.small }]}>
              {availability.service.name}
            </Text>
            <Text style={[styles.streamingType, { color: theme.colors.onSurfaceVariant, fontSize: fontSizes.small }]}>
              {availability.type === 'subscription' ? 'Included' : `$${availability.price}`}
            </Text>
          </View>
        ))}
      </View>
    </TouchableOpacity>
  );

  const renderMovieModal = () => {
    if (!selectedMovie) return null;

    const snackRecommendations = getSnackRecommendations(
      selectedMovie.genres,
      mockUserPreferences.snackPreferences,
      mockPartnerPreferences.snackPreferences
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
              {selectedMovie.title}
            </Text>
            <IconButton
              icon="close"
              onPress={() => setModalVisible(false)}
              iconColor={theme.colors.onSurface}
            />
          </View>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            <View style={styles.movieDetails}>
              <Text style={[styles.movieYear, { color: theme.colors.onSurfaceVariant, fontSize: fontSizes.medium }]}>
                {selectedMovie.releaseYear} • {selectedMovie.duration} min • {selectedMovie.rating}
              </Text>

              {selectedMovie.imdbRating && (
                <Text style={[styles.rating, { color: theme.colors.primary, fontSize: fontSizes.medium }]}>
                  ⭐ {selectedMovie.imdbRating}/10
                </Text>
              )}

              <Text style={[styles.movieDescription, { color: theme.colors.onSurface, fontSize: fontSizes.medium, marginTop: spacing.md }]}>
                {selectedMovie.description}
              </Text>

              <View style={[styles.genreContainer, { marginTop: spacing.md }]}>
                {selectedMovie.genres.map((genre, index) => (
                  <Chip
                    key={index}
                    mode="outlined"
                    style={[styles.genreChip, { marginRight: spacing.sm }]}
                    textStyle={{ fontSize: fontSizes.small }}
                  >
                    {genre}
                  </Chip>
                ))}
              </View>
            </View>

            <Divider style={{ marginVertical: spacing.lg }} />

            <View style={styles.streamingSection}>
              <Text style={[styles.sectionTitle, { color: theme.colors.onSurface, fontSize: fontSizes.large }]}>
                Where to Watch
              </Text>
              {selectedMovie.streamingAvailability.map((availability, index) => (
                <View key={index} style={styles.streamingRow}>
                  <Text style={[styles.streamingService, { color: theme.colors.onSurface, fontSize: fontSizes.medium }]}>
                    {availability.service.name}
                  </Text>
                  <Text style={[styles.streamingType, { color: theme.colors.primary, fontSize: fontSizes.medium }]}>
                    {availability.type === 'subscription' ? 'Included' : `$${availability.price}`}
                  </Text>
                </View>
              ))}
            </View>

            <Divider style={{ marginVertical: spacing.lg }} />

            <View style={styles.snackSection}>
              <Text style={[styles.sectionTitle, { color: theme.colors.onSurface, fontSize: fontSizes.large }]}>
                Perfect Snacks
              </Text>
              <Text style={[styles.sectionSubtitle, { color: theme.colors.onSurfaceVariant, fontSize: fontSizes.medium }]}>
                Based on the movie genre and your preferences
              </Text>

              {snackRecommendations.map((snack, index) => (
                <View key={index} style={styles.snackItem}>
                  <Text style={[styles.snackName, { color: theme.colors.onSurface, fontSize: fontSizes.medium }]}>
                    {snack.name}
                  </Text>
                  <Text style={[styles.snackDescription, { color: theme.colors.onSurfaceVariant, fontSize: fontSizes.small }]}>
                    {snack.description}
                  </Text>
                  {snack.recipe && (
                    <Text style={[styles.snackRecipe, { color: theme.colors.primary, fontSize: fontSizes.small }]}>
                      Recipe: {snack.recipe}
                    </Text>
                  )}
                </View>
              ))}
            </View>
          </ScrollView>

          <View style={styles.modalActions}>
            <Button
              mode="contained"
              onPress={() => handlePlanDate(selectedMovie)}
              style={[styles.planButton, { backgroundColor: theme.colors.primary }]}
              labelStyle={{ color: theme.colors.onPrimary, fontSize: fontSizes.medium }}
            >
              Plan Movie Date
            </Button>
          </View>
        </SafeAreaView>
      </Modal>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.colors.onSurface, fontSize: fontSizes.extraLarge }]}>
          Movies
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
            placeholder="Search movies..."
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
              Loading movies...
            </Text>
          </View>
        ) : movies.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: theme.colors.onSurfaceVariant, fontSize: fontSizes.medium }]}>
              {searchQuery ? 'No movies found' : 'No recommendations available'}
            </Text>
          </View>
        ) : (
          <View style={styles.moviesList}>
            {movies.map(renderMovieCard)}
          </View>
        )}
      </ScrollView>

      {renderMovieModal()}
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
  moviesList: {
    padding: 16,
  },
  movieCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
  },
  movieHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  movieInfo: {
    flex: 1,
  },
  movieTitle: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  movieYear: {
    marginBottom: 4,
  },
  rating: {
    fontWeight: '500',
  },
  matchScore: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  matchText: {
    fontWeight: '500',
  },
  movieDescription: {
    marginBottom: 12,
    lineHeight: 20,
  },
  genreContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  genreChip: {
    marginBottom: 4,
  },
  streamingContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  streamingItem: {
    marginRight: 16,
    marginBottom: 4,
  },
  streamingService: {
    fontWeight: '500',
  },
  streamingType: {
    fontSize: 12,
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
  movieDetails: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  sectionSubtitle: {
    marginBottom: 16,
  },
  streamingSection: {
    marginBottom: 16,
  },
  streamingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  snackSection: {
    marginBottom: 16,
  },
  snackItem: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  snackName: {
    fontWeight: '500',
    marginBottom: 4,
  },
  snackDescription: {
    marginBottom: 4,
  },
  snackRecipe: {
    fontStyle: 'italic',
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

export default MoviesScreen; 