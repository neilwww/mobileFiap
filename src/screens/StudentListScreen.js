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
  Avatar
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import mockAPI from '../services/api';

const StudentListScreen = ({ navigation }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      setLoading(true);
      const data = await mockAPI.getStudents();
      setStudents(data);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os estudantes');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadStudents();
    setRefreshing(false);
  };

  const handleDeleteStudent = (student) => {
    Alert.alert(
      'Confirmar exclusão',
      `Deseja realmente excluir o estudante ${student.name}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => confirmDeleteStudent(student.id)
        }
      ]
    );
  };

  const confirmDeleteStudent = async (studentId) => {
    try {
      await mockAPI.deleteStudent(studentId);
      Alert.alert('Sucesso', 'Estudante excluído com sucesso!');
      loadStudents();
    } catch (error) {
      Alert.alert('Erro', error.message || 'Não foi possível excluir o estudante');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const renderStudent = ({ item }) => (
    <Card style={styles.studentCard}>
      <Card.Content>
        <View style={styles.studentHeader}>
          <Avatar.Icon 
            size={48} 
            icon="school" 
            style={styles.avatar}
          />
          <View style={styles.studentInfo}>
            <Title style={styles.studentName}>{item.name}</Title>
            <Text style={styles.studentEmail}>{item.email}</Text>
            <Text style={styles.studentUsername}>@{item.username}</Text>
          </View>
        </View>

        <View style={styles.studentMeta}>
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
            onPress={() => navigation.navigate('EditStudent', { studentId: item.id })}
            style={styles.editButton}
            icon="pencil"
            compact
          >
            Editar
          </Button>
          
          <Button
            mode="contained"
            onPress={() => handleDeleteStudent(item)}
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
      <Title style={styles.headerTitle}>Estudantes Cadastrados</Title>
      <Paragraph style={styles.headerSubtitle}>
        {students.length} estudante{students.length !== 1 ? 's' : ''} no sistema
      </Paragraph>
    </View>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Carregando estudantes...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={students}
        renderItem={renderStudent}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="school-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>Nenhum estudante cadastrado</Text>
            <Button
              mode="contained"
              onPress={() => navigation.navigate('CreateStudent')}
              style={styles.emptyButton}
              icon="plus"
            >
              Cadastrar Primeiro Estudante
            </Button>
          </View>
        }
      />
      
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate('CreateStudent')}
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
  studentCard: {
    marginHorizontal: 16,
    marginVertical: 8,
    elevation: 2,
  },
  studentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    marginRight: 16,
    backgroundColor: '#4caf50',
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  studentEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  studentUsername: {
    fontSize: 12,
    color: '#999',
  },
  studentMeta: {
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

export default StudentListScreen;