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
  IconButton,
  Avatar
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import mockAPI from '../services/api';

const TeacherListScreen = ({ navigation }) => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadTeachers();
  }, []);

  const loadTeachers = async () => {
    try {
      setLoading(true);
      const data = await mockAPI.getTeachers();
      setTeachers(data);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os professores');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadTeachers();
    setRefreshing(false);
  };

  const handleDeleteTeacher = (teacher) => {
    Alert.alert(
      'Confirmar exclusão',
      `Deseja realmente excluir o professor ${teacher.name}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => confirmDeleteTeacher(teacher.id)
        }
      ]
    );
  };

  const confirmDeleteTeacher = async (teacherId) => {
    try {
      await mockAPI.deleteTeacher(teacherId);
      Alert.alert('Sucesso', 'Professor excluído com sucesso!');
      loadTeachers();
    } catch (error) {
      Alert.alert('Erro', error.message || 'Não foi possível excluir o professor');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const renderTeacher = ({ item }) => (
    <Card style={styles.teacherCard}>
      <Card.Content>
        <View style={styles.teacherHeader}>
          <Avatar.Icon 
            size={48} 
            icon="account-tie" 
            style={styles.avatar}
          />
          <View style={styles.teacherInfo}>
            <Title style={styles.teacherName}>{item.name}</Title>
            <Text style={styles.teacherEmail}>{item.email}</Text>
            <Text style={styles.teacherUsername}>@{item.username}</Text>
          </View>
        </View>

        <View style={styles.teacherMeta}>
          <View style={styles.metaItem}>
            <MaterialCommunityIcons name="calendar" size={16} color="#666" />
            <Text style={styles.metaText}>
              Cadastrado em {formatDate(item.createdAt)}
            </Text>
          </View>
          
          {item.updatedAt !== item.createdAt && (
            <View style={styles.metaItem}>
              <MaterialCommunityIcons name="update" size={16} color="#666" />
              <Text style={styles.metaText}>
                Atualizado em {formatDate(item.updatedAt)}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.actionButtons}>
          <Button
            mode="outlined"
            onPress={() => navigation.navigate('EditTeacher', { teacherId: item.id })}
            style={styles.editButton}
            icon="pencil"
            compact
          >
            Editar
          </Button>
          
          <Button
            mode="contained"
            onPress={() => handleDeleteTeacher(item)}
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
      <Title style={styles.headerTitle}>Professores Cadastrados</Title>
      <Paragraph style={styles.headerSubtitle}>
        {teachers.length} professor{teachers.length !== 1 ? 'es' : ''} no sistema
      </Paragraph>
    </View>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Carregando professores...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={teachers}
        renderItem={renderTeacher}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="account-tie-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>Nenhum professor cadastrado</Text>
            <Button
              mode="contained"
              onPress={() => navigation.navigate('CreateTeacher')}
              style={styles.emptyButton}
              icon="plus"
            >
              Cadastrar Primeiro Professor
            </Button>
          </View>
        }
      />
      
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate('CreateTeacher')}
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
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  listContent: {
    paddingBottom: 100,
  },
  teacherCard: {
    marginHorizontal: 16,
    marginVertical: 8,
    elevation: 2,
  },
  teacherHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    marginRight: 16,
  },
  teacherInfo: {
    flex: 1,
  },
  teacherName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  teacherEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  teacherUsername: {
    fontSize: 12,
    color: '#999',
  },
  teacherMeta: {
    marginBottom: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  metaText: {
    marginLeft: 8,
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

export default TeacherListScreen;