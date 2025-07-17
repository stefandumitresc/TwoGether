import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import {
  Text,
  TextInput,
  Button,
  Card,
  Avatar,
  Chip,
  IconButton,
  Menu,
  Divider,
  Portal,
  Modal,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { CommonActions } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { colors } from '../../theme';
import { useResponsiveDesign } from '../../hooks/useResponsiveDesign';
import { MessagesStackParamList } from '../../navigation/MainNavigator';

const { width: screenWidth } = Dimensions.get('window');

// Message types
interface Message {
  id: string;
  text: string;
  senderId: string;
  senderName: string;
  timestamp: Date;
  type: 'text' | 'date-plan' | 'idea-share' | 'image' | 'location';
  metadata?: {
    dateId?: string;
    ideaId?: string;
    imageUrl?: string;
    location?: {
      name: string;
      address: string;
      coordinates: { lat: number; lng: number };
    };
    datePlan?: {
      title: string;
      date: string;
      time: string;
      location: string;
      status: 'proposed' | 'confirmed' | 'declined';
    };
  };
  reactions?: {
    userId: string;
    emoji: string;
  }[];
  readBy?: string[];
}

interface DatePlanMessage {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  status: 'proposed' | 'confirmed' | 'declined';
}

type ChatScreenNavigationProp = StackNavigationProp<MessagesStackParamList, 'MessagesMain'>;

const ChatScreen = () => {
  const { user, partner } = useAuth();
  const { horizontalPadding, spacing, fontSizes, isSmallScreen } = useResponsiveDesign();
  const navigation = useNavigation<ChatScreenNavigationProp>();
  const scrollViewRef = useRef<ScrollView>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [showDatePlanModal, setShowDatePlanModal] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [showReactionPicker, setShowReactionPicker] = useState(false);

  // Mock initial messages
  useEffect(() => {
    const mockMessages: Message[] = [
      {
        id: '1',
        text: 'Hey! What do you think about dinner tonight?',
        senderId: user?.id || 'user1',
        senderName: user?.name || 'You',
        timestamp: new Date(Date.now() - 3600000),
        type: 'text',
        readBy: [user?.id || 'user1', partner?.id || 'partner1'],
      },
      {
        id: '2',
        text: 'That sounds perfect! I was thinking the same thing 😊',
        senderId: partner?.id || 'partner1',
        senderName: partner?.name || 'Partner',
        timestamp: new Date(Date.now() - 3000000),
        type: 'text',
        readBy: [user?.id || 'user1', partner?.id || 'partner1'],
        reactions: [
          { userId: user?.id || 'user1', emoji: '❤️' }
        ],
      },
      {
        id: '3',
        text: 'How about dinner at Villa Italiana tonight at 7:30 PM?',
        senderId: user?.id || 'user1',
        senderName: user?.name || 'You',
        timestamp: new Date(Date.now() - 2400000),
        type: 'date-plan',
        metadata: {
          dateId: 'date1',
          datePlan: {
            title: 'Romantic Dinner',
            date: new Date().toISOString().split('T')[0],
            time: '19:30',
            location: 'Villa Italiana Downtown',
            status: 'proposed',
          },
        },
        readBy: [user?.id || 'user1'],
      },
      {
        id: '4',
        text: 'Perfect! What time works for you?',
        senderId: partner?.id || 'partner1',
        senderName: partner?.name || 'Partner',
        timestamp: new Date(Date.now() - 1800000),
        type: 'text',
        readBy: [user?.id || 'user1', partner?.id || 'partner1'],
      },
    ];
    setMessages(mockMessages);
  }, [user, partner]);

  const sendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: Date.now().toString(),
        text: newMessage.trim(),
        senderId: user?.id || 'user1',
        senderName: user?.name || 'You',
        timestamp: new Date(),
        type: 'text',
        readBy: [user?.id || 'user1'],
      };

      setMessages(prev => [...prev, message]);
      setNewMessage('');

      // Scroll to bottom
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  const addReaction = (messageId: string, emoji: string) => {
    setMessages(prev => prev.map(msg => {
      if (msg.id === messageId) {
        const reactions = msg.reactions || [];
        const existingReaction = reactions.find(r => r.userId === user?.id);

        if (existingReaction) {
          if (existingReaction.emoji === emoji) {
            // Remove reaction
            return {
              ...msg,
              reactions: reactions.filter(r => r.userId !== user?.id),
            };
          } else {
            // Update reaction
            return {
              ...msg,
              reactions: reactions.map(r =>
                r.userId === user?.id ? { ...r, emoji } : r
              ),
            };
          }
        } else {
          // Add new reaction
          return {
            ...msg,
            reactions: [...reactions, { userId: user?.id || 'user1', emoji }],
          };
        }
      }
      return msg;
    }));
    setShowReactionPicker(false);
    setSelectedMessage(null);
  };

  const handleDatePlanPress = (message: Message) => {
    if (message.type === 'date-plan' && message.metadata?.datePlan) {
      const datePlan = message.metadata.datePlan;
      // Navigate to calendar with the date plan info
      navigation.dispatch(
        CommonActions.navigate({
          name: 'Home',
          params: {
            screen: 'Calendar',
            params: {
              newEvent: {
                id: Date.now().toString(),
                date: datePlan.date,
                time: datePlan.time,
                title: datePlan.title,
                location: datePlan.location,
                type: 'planned' as const,
                plannedBy: 'partner' as const,
              }
            }
          },
        })
      );
    }
  };

  const shareDatePlan = () => {
    navigation.dispatch(
      CommonActions.navigate({
        name: 'Home',
        params: {
          screen: 'HomeMain',
        },
      })
    );
    setShowMenu(false);
  };

  const shareIdea = () => {
    navigation.dispatch(
      CommonActions.navigate({
        name: 'Discover',
        params: {
          screen: 'DiscoverMain',
        },
      })
    );
    setShowMenu(false);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    }
  };

  const MessageBubble = ({ message }: { message: Message }) => {
    const isOwn = message.senderId === user?.id;
    const isRead = message.readBy?.includes(partner?.id || 'partner1');

    return (
      <View style={[styles.messageContainer, isOwn && styles.ownMessageContainer]}>
        <TouchableOpacity
          style={[
            styles.messageBubble,
            isOwn ? styles.ownMessageBubble : styles.partnerMessageBubble,
          ]}
          onLongPress={() => {
            setSelectedMessage(message);
            setShowReactionPicker(true);
          }}
          onPress={() => {
            if (message.type === 'date-plan') {
              handleDatePlanPress(message);
            }
          }}
        >
          {message.type === 'date-plan' ? (
            <View style={styles.datePlanContent}>
              <View style={styles.datePlanHeader}>
                <MaterialCommunityIcons
                  name="calendar-heart"
                  size={20}
                  color={isOwn ? colors.surface : colors.primary}
                />
                <Text style={[
                  styles.datePlanLabel,
                  isOwn ? styles.ownMessageText : styles.partnerMessageText,
                ]}>
                  Date Plan
                </Text>
              </View>
              <Text style={[
                styles.messageText,
                isOwn ? styles.ownMessageText : styles.partnerMessageText,
              ]}>
                {message.text}
              </Text>
              {message.metadata?.datePlan && (
                <View style={styles.datePlanDetails}>
                  <Text style={[
                    styles.datePlanDetailText,
                    isOwn ? styles.ownMessageText : styles.partnerMessageText,
                  ]}>
                    📅 {new Date(message.metadata.datePlan.date).toLocaleDateString()}
                  </Text>
                  <Text style={[
                    styles.datePlanDetailText,
                    isOwn ? styles.ownMessageText : styles.partnerMessageText,
                  ]}>
                    🕒 {message.metadata.datePlan.time}
                  </Text>
                  <Text style={[
                    styles.datePlanDetailText,
                    isOwn ? styles.ownMessageText : styles.partnerMessageText,
                  ]}>
                    📍 {message.metadata.datePlan.location}
                  </Text>
                </View>
              )}
              <View style={styles.datePlanAction}>
                <Text style={[
                  styles.datePlanActionText,
                  isOwn ? styles.ownMessageText : styles.partnerMessageText,
                ]}>
                  Tap to view details
                </Text>
              </View>
            </View>
          ) : (
            <Text style={[
              styles.messageText,
              isOwn ? styles.ownMessageText : styles.partnerMessageText,
            ]}>
              {message.text}
            </Text>
          )}

          {message.reactions && message.reactions.length > 0 && (
            <View style={styles.reactionsContainer}>
              {message.reactions.map((reaction, index) => {
                const isOwnReaction = reaction.userId === user?.id;
                return (
                  <View key={index} style={[
                    styles.reactionBubble,
                    isOwnReaction && styles.ownReactionBubble
                  ]}>
                    <Text style={styles.reactionEmoji}>
                      {reaction.emoji}
                    </Text>
                  </View>
                );
              })}
            </View>
          )}
        </TouchableOpacity>

        <View style={[styles.messageInfo, isOwn && styles.ownMessageInfo]}>
          <Text style={styles.messageTime}>
            {formatTime(message.timestamp)}
          </Text>
          {isOwn && (
            <MaterialCommunityIcons
              name={isRead ? 'check-all' : 'check'}
              size={16}
              color={isRead ? colors.primary : colors.textSecondary}
            />
          )}
        </View>
      </View>
    );
  };

  const ReactionPicker = () => {
    const reactions = ['❤️', '😍', '😂', '👍', '😮', '😢'];

    return (
      <Portal>
        <Modal
          visible={showReactionPicker}
          onDismiss={() => {
            setShowReactionPicker(false);
            setSelectedMessage(null);
          }}
          contentContainerStyle={styles.reactionPickerModal}
        >
          <Text style={styles.reactionPickerTitle}>Add Reaction</Text>
          <View style={styles.reactionPickerGrid}>
            {reactions.map((emoji, index) => (
              <TouchableOpacity
                key={index}
                style={styles.reactionButton}
                onPress={() => selectedMessage && addReaction(selectedMessage.id, emoji)}
              >
                <Text style={styles.reactionButtonText}>{emoji}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Modal>
      </Portal>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      {/* Header */}
      <View style={[styles.header, { paddingHorizontal: horizontalPadding }]}>
        <View style={styles.headerLeft}>
          <Avatar.Text
            size={40}
            label={partner?.name?.charAt(0) || 'P'}
            style={styles.avatar}
          />
          <View style={styles.headerInfo}>
            <Text style={[styles.headerTitle, { fontSize: fontSizes.medium }]}>
              {partner?.name || 'Partner'}
            </Text>
            <Text style={[styles.headerSubtitle, { fontSize: fontSizes.small }]}>
              Online now
            </Text>
          </View>
        </View>

        <Menu
          visible={showMenu}
          onDismiss={() => setShowMenu(false)}
          anchor={
            <IconButton
              icon="dots-vertical"
              size={24}
              onPress={() => setShowMenu(true)}
            />
          }
        >
          <Menu.Item
            onPress={shareDatePlan}
            title="Share Date Plan"
            leadingIcon="calendar-plus"
          />
          <Menu.Item
            onPress={shareIdea}
            title="Share Idea"
            leadingIcon="lightbulb"
          />
          <Divider />
          <Menu.Item
            onPress={() => setShowMenu(false)}
            title="View Profile"
            leadingIcon="account"
          />
        </Menu>
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 25}
      >
        {/* Messages */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={[
            styles.messagesContent,
            { paddingHorizontal: horizontalPadding }
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {messages.map((message, index) => {
            const showDateSeparator = index === 0 ||
              formatDate(message.timestamp) !== formatDate(messages[index - 1].timestamp);

            return (
              <View key={message.id}>
                {showDateSeparator && (
                  <View style={styles.dateSeparator}>
                    <Text style={styles.dateSeparatorText}>
                      {formatDate(message.timestamp)}
                    </Text>
                  </View>
                )}
                <MessageBubble message={message} />
              </View>
            );
          })}
        </ScrollView>

        {/* Input */}
        <View style={[styles.inputContainer, { paddingHorizontal: horizontalPadding }]}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.textInput}
              value={newMessage}
              onChangeText={setNewMessage}
              placeholder="Type a message..."
              placeholderTextColor={colors.textSecondary}
              multiline
              maxLength={1000}
              mode="outlined"
              textColor={colors.text}
              outlineColor={colors.border}
              activeOutlineColor={colors.primary}
              contentStyle={{
                color: colors.text,
                fontSize: 16,
              }}
              theme={{
                colors: {
                  primary: colors.primary,
                  onSurface: colors.text,
                  onSurfaceVariant: colors.textSecondary,
                  outline: colors.border,
                }
              }}
              right={
                <TextInput.Icon
                  icon="send"
                  onPress={sendMessage}
                  disabled={!newMessage.trim()}
                />
              }
            />
          </View>
        </View>
      </KeyboardAvoidingView>

      <ReactionPicker />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    backgroundColor: colors.primary,
  },
  headerInfo: {
    marginLeft: 12,
  },
  headerTitle: {
    color: colors.text,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: colors.textSecondary,
    marginTop: 2,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    paddingVertical: 16,
  },
  messageContainer: {
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  ownMessageContainer: {
    alignItems: 'flex-end',
  },
  messageBubble: {
    maxWidth: screenWidth * 0.75,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    position: 'relative',
  },
  ownMessageBubble: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 4,
  },
  partnerMessageBubble: {
    backgroundColor: colors.surface,
    borderBottomLeftRadius: 4,
    elevation: 1,
  },
  datePlanContent: {
    width: '100%',
  },
  datePlanHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  datePlanLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 6,
  },
  datePlanDetails: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.2)',
  },
  datePlanDetailText: {
    fontSize: 14,
    marginBottom: 4,
  },
  datePlanAction: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
  },
  datePlanActionText: {
    fontSize: 12,
    fontStyle: 'italic',
    opacity: 0.8,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  ownMessageText: {
    color: colors.surface,
  },
  partnerMessageText: {
    color: colors.text,
  },
  reactionsContainer: {
    flexDirection: 'row',
    marginTop: 8,
    flexWrap: 'wrap',
  },
  reactionBubble: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 4,
    marginBottom: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  ownReactionBubble: {
    backgroundColor: colors.primary,
  },
  reactionEmoji: {
    fontSize: 16,
  },
  messageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    marginLeft: 16,
  },
  ownMessageInfo: {
    marginLeft: 0,
    marginRight: 16,
  },
  messageTime: {
    fontSize: 12,
    color: colors.textSecondary,
    marginRight: 4,
  },
  dateSeparator: {
    alignItems: 'center',
    marginVertical: 16,
  },
  dateSeparatorText: {
    fontSize: 12,
    color: colors.textSecondary,
    backgroundColor: colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  inputContainer: {
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  textInput: {
    flex: 1,
    maxHeight: 100,
    backgroundColor: colors.surface,
  },
  reactionPickerModal: {
    backgroundColor: colors.surface,
    margin: 20,
    borderRadius: 16,
    padding: 20,
  },
  reactionPickerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 16,
  },
  reactionPickerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  reactionButton: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 4,
    borderRadius: 25,
    backgroundColor: colors.background,
  },
  reactionButtonText: {
    fontSize: 24,
  },
});

export default ChatScreen; 