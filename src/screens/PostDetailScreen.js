import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import {
  Text,
  Card,
  Title,
  Paragraph,
  Button,
  TextInput,
  ActivityIndicator,
  Divider,
  Avatar
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import mockAPI from '../services/api';

const PostDetailScreen = ({ route, navigation }) => {
  const { postId } = route.params;
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    loadPost();
  }, [postId]);

  const loadPost = async () => {
    try {
      setLoading(true);
      const data = await mockAPI.getPostById(postId);
      setPost(data);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar o post');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) {
      Alert.alert('Aviso', 'Por favor, digite um comentário');
      return;
    }

    try {
      setSubmittingComment(true);
      await mockAPI.addComment(postId, {
        author: user.name,
        content: commentText.trim()
      });
      
      setCommentText('');
      await loadPost(); // Recarrega o post com o novo comentário
      Alert.alert('Sucesso', 'Comentário adicionado!');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível adicionar o comentário');
    } finally {
      setSubmittingComment(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatContent = (content) => {
    // Simples formatação para quebras de linha
    return content.split('\n').map((line, index) => (
      <Text key={index} style={styles.contentLine}>
        {line}
        {index < content.split('\n').length - 1 && '\n'}
      </Text>
    ));
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Carregando post...</Text>
      </View>
    );
  }

  if (!post) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Post não encontrado</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.scrollView}>
        <Card style={styles.postCard}>
          <Card.Content>
            <Title style={styles.title}>{post.title}</Title>
            
            <View style={styles.postMeta}>
              <View style={styles.authorInfo}>
                <Avatar.Icon 
                  size={32} 
                  icon="account" 
                  style={styles.avatar}
                />
                <View style={styles.authorDetails}>
                  <Text style={styles.author}>{post.author}</Text>
                  <Text style={styles.date}>
                    Publicado em {formatDate(post.createdAt)}
                  </Text>
                  {post.updatedAt !== post.createdAt && (
                    <Text style={styles.updatedDate}>
                      Editado em {formatDate(post.updatedAt)}
                    </Text>
                  )}
                </View>
              </View>
              
              <View style={styles.postStats}>
                <View style={styles.stat}>
                  <MaterialCommunityIcons name="heart" size={20} color="#e91e63" />
                  <Text style={styles.statText}>{post.likes}</Text>
                </View>
                <View style={styles.stat}>
                  <MaterialCommunityIcons name="comment" size={20} color="#2196f3" />
                  <Text style={styles.statText}>{post.comments?.length || 0}</Text>
                </View>
              </View>
            </View>

            <Divider style={styles.divider} />

            <Paragraph style={styles.content}>
              {formatContent(post.content)}
            </Paragraph>

            {post.tags && post.tags.length > 0 && (
              <View style={styles.tagsContainer}>
                <Text style={styles.tagsTitle}>Tags:</Text>
                <View style={styles.tags}>
                  {post.tags.map((tag, index) => (
                    <Text key={index} style={styles.tag}>
                      #{tag}
                    </Text>
                  ))}
                </View>
              </View>
            )}
          </Card.Content>
        </Card>

        {/* Seção de Comentários */}
        <Card style={styles.commentsCard}>
          <Card.Content>
            <Title style={styles.commentsTitle}>
              Comentários ({post.comments?.length || 0})
            </Title>

            {/* Formulário para adicionar comentário */}
            <View style={styles.addCommentContainer}>
              <TextInput
                label="Adicionar comentário"
                value={commentText}
                onChangeText={setCommentText}
                mode="outlined"
                multiline
                numberOfLines={3}
                style={styles.commentInput}
              />
              <Button
                mode="contained"
                onPress={handleAddComment}
                disabled={submittingComment || !commentText.trim()}
                style={styles.addCommentButton}
              >
                {submittingComment ? 'Enviando...' : 'Comentar'}
              </Button>
            </View>

            <Divider style={styles.divider} />

            {/* Lista de comentários */}
            {post.comments && post.comments.length > 0 ? (
              post.comments.map((comment) => (
                <View key={comment.id} style={styles.comment}>
                  <View style={styles.commentHeader}>
                    <Avatar.Icon 
                      size={28} 
                      icon="account-circle" 
                      style={styles.commentAvatar}
                    />
                    <View style={styles.commentMeta}>
                      <Text style={styles.commentAuthor}>{comment.author}</Text>
                      <Text style={styles.commentDate}>
                        {formatDate(comment.createdAt)}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.commentContent}>{comment.content}</Text>
                </View>
              ))
            ) : (
              <View style={styles.noCommentsContainer}>
                <MaterialCommunityIcons name="comment-outline" size={48} color="#ccc" />
                <Text style={styles.noCommentsText}>
                  Seja o primeiro a comentar!
                </Text>
              </View>
            )}
          </Card.Content>
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#666',
  },
  scrollView: {
    flex: 1,
  },
  postCard: {
    margin: 16,
    elevation: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  postMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    marginRight: 12,
  },
  authorDetails: {
    flex: 1,
  },
  author: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  date: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  updatedDate: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 2,
  },
  postStats: {
    flexDirection: 'row',
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
  },
  statText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#666',
    fontWeight: 'bold',
  },
  divider: {
    marginVertical: 16,
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    marginBottom: 16,
  },
  contentLine: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  tagsContainer: {
    marginTop: 16,
  },
  tagsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 8,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    fontSize: 12,
    color: '#6200ee',
    marginRight: 12,
    marginBottom: 4,
    fontWeight: '500',
  },
  commentsCard: {
    margin: 16,
    marginTop: 0,
    elevation: 4,
  },
  commentsTitle: {
    fontSize: 20,
    marginBottom: 16,
  },
  addCommentContainer: {
    marginBottom: 16,
  },
  commentInput: {
    marginBottom: 12,
  },
  addCommentButton: {
    alignSelf: 'flex-end',
  },
  comment: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  commentAvatar: {
    marginRight: 8,
  },
  commentMeta: {
    flex: 1,
  },
  commentAuthor: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  commentDate: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  commentContent: {
    fontSize: 14,
    color: '#333',
    marginLeft: 36,
    lineHeight: 20,
  },
  noCommentsContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  noCommentsText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});

export default PostDetailScreen;