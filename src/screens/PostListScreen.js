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
  Searchbar,
  FAB,
  Button,
  ActivityIndicator,
  Chip
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import mockAPI from '../services/api';

const PostListScreen = ({ navigation }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, logout } = useAuth();

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async (searchTerm = '') => {
    try {
      setLoading(true);
      const data = await mockAPI.getPosts(searchTerm);
      setPosts(data);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os posts');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadPosts(searchQuery);
    setRefreshing(false);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.length >= 2 || query.length === 0) {
      loadPosts(query);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Sair',
      'Deseja realmente sair do aplicativo?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Sair', onPress: logout }
      ]
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const renderPost = ({ item }) => (
    <Card 
      style={styles.postCard}
      onPress={() => navigation.navigate('PostDetail', { postId: item.id })}
    >
      <Card.Content>
        <Title numberOfLines={2}>{item.title}</Title>
        <View style={styles.postMeta}>
          <Text style={styles.author}>Por: {item.author}</Text>
          <Text style={styles.date}>{formatDate(item.createdAt)}</Text>
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
        </View>
      </Card.Content>
    </Card>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.userInfo}>
        <Text style={styles.welcomeText}>Olá, {user?.name}!</Text>
        <Button 
          mode="text" 
          onPress={handleLogout}
          icon="logout"
          compact
        >
          Sair
        </Button>
      </View>
      
      <Searchbar
        placeholder="Buscar posts..."
        onChangeText={handleSearch}
        value={searchQuery}
        style={styles.searchbar}
      />
    </View>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Carregando posts...</Text>
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
            <Text style={styles.emptyText}>
              {searchQuery ? 'Nenhum post encontrado' : 'Nenhum post disponível'}
            </Text>
          </View>
        }
      />
      
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => {
          if (user?.role === 'docente') {
            // Professores navegam para o Admin
            navigation.navigate('Admin', { screen: 'CreatePost' });
          } else {
            // Estudantes navegam para a aba "Criar Post"
            navigation.getParent()?.navigate('Criar Post');
          }
        }}
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
  userInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  searchbar: {
    elevation: 2,
  },
  listContent: {
    paddingBottom: 100,
  },
  postCard: {
    marginHorizontal: 16,
    marginVertical: 8,
    elevation: 2,
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
    marginBottom: 12,
  },
  tag: {
    marginRight: 8,
    marginBottom: 4,
  },
  postStats: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
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
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 64,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default PostListScreen;