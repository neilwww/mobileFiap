import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Alert,
  RefreshControl
} from 'react-native';
import {
  Text,
  Card,
  Title,
  Paragraph,
  Button,
  FAB,
  ActivityIndicator,
  Chip,
  Menu,
  Divider,
  IconButton
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import mockAPI from '../services/api';

const AdminScreen = ({ navigation }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [menuVisible, setMenuVisible] = useState({});

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const data = await mockAPI.getPosts();
      setPosts(data);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os posts');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadPosts();
    setRefreshing(false);
  };

  const handleEditPost = (post) => {
    navigation.navigate('EditPost', { postId: post.id });
  };

  const handleDeletePost = (post) => {
    Alert.alert(
      'Confirmar exclusão',
      `Deseja realmente excluir o post "${post.title}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => confirmDeletePost(post.id)
        }
      ]
    );
  };

  const confirmDeletePost = async (postId) => {
    try {
      await mockAPI.deletePost(postId);
      Alert.alert('Sucesso', 'Post excluído com sucesso!');
      loadPosts();
    } catch (error) {
      Alert.alert('Erro', error.message || 'Não foi possível excluir o post');
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

  const toggleMenu = (postId) => {
    setMenuVisible(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const closeMenu = (postId) => {
    setMenuVisible(prev => ({
      ...prev,
      [postId]: false
    }));
  };

  const renderPost = ({ item }) => (
    <Card style={styles.postCard}>
      <Card.Content>
        <View style={styles.postHeader}>
          <View style={styles.postInfo}>
            <Title style={styles.postTitle} numberOfLines={2}>
              {item.title}
            </Title>
            <View style={styles.postMeta}>
              <Text style={styles.author}>Por: {item.author}</Text>
              <Text style={styles.date}>{formatDate(item.createdAt)}</Text>
            </View>
          </View>
          
          <Menu
            visible={menuVisible[item.id] || false}
            onDismiss={() => closeMenu(item.id)}
            anchor={
              <IconButton
                icon="dots-vertical"
                onPress={() => toggleMenu(item.id)}
              />
            }
          >
            <Menu.Item
              onPress={() => {
                closeMenu(item.id);
                handleEditPost(item);
              }}
              title="Editar"
              leadingIcon="pencil"
            />
            <Menu.Item
              onPress={() => {
                closeMenu(item.id);
                handleDeletePost(item);
              }}
              title="Excluir"
              leadingIcon="delete"
            />
            <Divider />
            <Menu.Item
              onPress={() => {
                closeMenu(item.id);
                navigation.navigate('Posts', { 
                  screen: 'PostDetail', 
                  params: { postId: item.id } 
                });
              }}
              title="Visualizar"
              leadingIcon="eye"
            />
          </Menu>
        </View>

        <Paragraph numberOfLines={3} style={styles.description}>
          {item.description}
        </Paragraph>

        {item.tags && item.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {item.tags.slice(0, 3).map((tag, index) => (
              <Chip key={index} style={styles.tag} compact>
                {tag}
              </Chip>
            ))}
            {item.tags.length > 3 && (
              <Text style={styles.moreTags}>+{item.tags.length - 3} mais</Text>
            )}
          </View>
        )}

        <View style={styles.postStats}>
          <View style={styles.stat}>
            <MaterialCommunityIcons name="heart" size={16} color="#e91e63" />
            <Text style={styles.statText}>{item.likes}</Text>
          </View>
          <View style={styles.stat}>
            <MaterialCommunityIcons name="comment" size={16} color="#2196f3" />
            <Text style={styles.statText}>{item.comments?.length || 0}</Text>
          </View>
          
          {item.updatedAt !== item.createdAt && (
            <View style={styles.stat}>
              <MaterialCommunityIcons name="update" size={16} color="#ff9800" />
              <Text style={styles.statText}>Editado</Text>
            </View>
          )}
        </View>

        <View style={styles.actionButtons}>
          <Button
            mode="outlined"
            onPress={() => handleEditPost(item)}
            style={styles.editButton}
            icon="pencil"
            compact
          >
            Editar
          </Button>
          
          <Button
            mode="contained"
            onPress={() => handleDeletePost(item)}
            style={styles.deleteButton}
            buttonColor="#d32f2f"
            icon="delete"
            compact
          >
            Excluir
          </Button>
        </View>
      </Card.Content>
    </Card>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <Title style={styles.headerTitle}>Painel Administrativo</Title>
      <Paragraph style={styles.headerSubtitle}>
        Gerencie todos os posts do blog
      </Paragraph>
      
      <View style={styles.statsContainer}>
        <Card style={styles.statsCard}>
          <Card.Content style={styles.statsContent}>
            <MaterialCommunityIcons name="post" size={32} color="#6200ee" />
            <View style={styles.statsText}>
              <Text style={styles.statsNumber}>{posts.length}</Text>
              <Text style={styles.statsLabel}>Posts</Text>
            </View>
          </Card.Content>
        </Card>
        
        <Card style={styles.statsCard}>
          <Card.Content style={styles.statsContent}>
            <MaterialCommunityIcons name="heart" size={32} color="#e91e63" />
            <View style={styles.statsText}>
              <Text style={styles.statsNumber}>
                {posts.reduce((sum, post) => sum + post.likes, 0)}
              </Text>
              <Text style={styles.statsLabel}>Curtidas</Text>
            </View>
          </Card.Content>
        </Card>
        
        <Card style={styles.statsCard}>
          <Card.Content style={styles.statsContent}>
            <MaterialCommunityIcons name="comment" size={32} color="#2196f3" />
            <View style={styles.statsText}>
              <Text style={styles.statsNumber}>
                {posts.reduce((sum, post) => sum + (post.comments?.length || 0), 0)}
              </Text>
              <Text style={styles.statsLabel}>Comentários</Text>
            </View>
          </Card.Content>
        </Card>
      </View>
    </View>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Carregando painel...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="post-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>Nenhum post encontrado</Text>
            <Button
              mode="contained"
              onPress={() => navigation.navigate('CreatePost')}
              style={styles.emptyButton}
              icon="plus"
            >
              Criar Primeiro Post
            </Button>
          </View>
        }
      />
      
      <FAB
        style={styles.fab}
        icon="plus"
        label="Novo Post"
        onPress={() => navigation.navigate('CreatePost')}
      />
    </View>
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
  header: {
    padding: 16,
    backgroundColor: 'white',
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statsCard: {
    flex: 1,
    marginHorizontal: 4,
    elevation: 2,
  },
  statsContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  statsText: {
    marginLeft: 12,
    flex: 1,
  },
  statsNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  statsLabel: {
    fontSize: 12,
    color: '#666',
  },
  listContent: {
    paddingBottom: 100,
  },
  postCard: {
    marginHorizontal: 16,
    marginVertical: 8,
    elevation: 2,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  postInfo: {
    flex: 1,
    marginRight: 8,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  postMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  author: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  date: {
    fontSize: 12,
    color: '#666',
  },
  description: {
    marginBottom: 12,
    color: '#333',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginBottom: 12,
  },
  tag: {
    marginRight: 8,
    marginBottom: 4,
  },
  moreTags: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  postStats: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 16,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  statText: {
    marginLeft: 4,
    fontSize: 12,
    color: '#666',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  editButton: {
    flex: 1,
    marginRight: 8,
  },
  deleteButton: {
    flex: 1,
    marginLeft: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 64,
    paddingHorizontal: 32,
  },
  emptyText: {
    marginTop: 16,
    marginBottom: 24,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  emptyButton: {
    marginTop: 8,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default AdminScreen;